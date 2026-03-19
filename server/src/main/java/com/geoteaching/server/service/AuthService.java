package com.geoteaching.server.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import com.geoteaching.server.domain.VerificationCodePurpose;
import com.geoteaching.server.dto.request.LoginWithCodeRequest;
import com.geoteaching.server.dto.request.LoginWithPasswordRequest;
import com.geoteaching.server.dto.request.RegisterRequest;
import com.geoteaching.server.dto.request.SendCodeRequest;
import com.geoteaching.server.dto.response.AuthResultResponse;
import com.geoteaching.server.dto.response.AuthUserResponse;
import com.geoteaching.server.dto.response.SendCodeResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.model.VerificationCodeRecord;
import com.geoteaching.server.provider.NotificationProvider;
import com.geoteaching.server.repository.JsonAuthStore;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", Pattern.CASE_INSENSITIVE);

    private final JsonAuthStore authStore;
    private final NotificationProvider notificationProvider;
    private final JwtService jwtService;
    private final AuthProperties authProperties;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(
            JsonAuthStore authStore,
            NotificationProvider notificationProvider,
            JwtService jwtService,
            AuthProperties authProperties) {
        this.authStore = authStore;
        this.notificationProvider = notificationProvider;
        this.jwtService = jwtService;
        this.authProperties = authProperties;
    }

    public SendCodeResponse sendVerificationCode(SendCodeRequest request) {
        String account = normalizeAccount(request.account());
        AuthChannel channel = requireChannel(account);
        VerificationCodePurpose purpose = request.purpose() == null ? VerificationCodePurpose.REGISTER : request.purpose();
        Instant now = Instant.now();

        Optional<StoredUser> existingUser = authStore.findUserByAccount(account);
        if (purpose == VerificationCodePurpose.REGISTER && existingUser.isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "ACCOUNT_EXISTS", "该账号已注册，请直接登录。");
        }

        if (purpose == VerificationCodePurpose.LOGIN && existingUser.isEmpty()) {
            throw new ApiException(HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", "账号不存在，请先完成注册。");
        }

        authStore.findActiveVerificationCode(account, purpose)
            .filter(record -> record.createdAt().plusSeconds(authProperties.verificationCodeRetrySeconds()).isAfter(now))
            .ifPresent(record -> {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "VERIFICATION_CODE_RATE_LIMITED", "验证码发送过于频繁，请稍后再试。");
            });

        String code = generateVerificationCode();
        VerificationCodeRecord record = new VerificationCodeRecord(
                account,
                channel,
                purpose,
                code,
            now.plusSeconds(authProperties.verificationCodeTtlSeconds()),
            now);
        authStore.saveVerificationCode(record);

        NotificationProvider.NotificationResult result = notificationProvider.sendVerificationCode(account, channel, purpose, code);
        return new SendCodeResponse(
                channel,
                authProperties.verificationCodeTtlSeconds(),
                authProperties.verificationCodeRetrySeconds(),
                result.requestId(),
                authProperties.exposeVerificationCode() ? code : null);
    }

    public AuthResultResponse register(RegisterRequest request) {
        String account = normalizeAccount(request.account());
        AuthChannel channel = requireChannel(account);
        UserRole role = request.role() == null ? UserRole.STUDENT : request.role();

        if (request.displayName().trim().length() < 2) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_DISPLAY_NAME", "姓名或昵称至少需要 2 个字。");
        }

        if (request.password().trim().length() < 8) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD", "密码至少需要 8 位。");
        }

        if (authStore.findUserByAccount(account).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "ACCOUNT_EXISTS", "该账号已注册，请直接登录。");
        }

        JsonAuthStore.VerificationCodeConsumeResult consumeResult = authStore.consumeVerificationCode(account, VerificationCodePurpose.REGISTER, request.code().trim());
        if (consumeResult.status() == JsonAuthStore.VerificationCodeStatus.MISSING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "VERIFICATION_CODE_MISSING", "请先获取注册验证码，或验证码已过期。");
        }

        if (consumeResult.status() == JsonAuthStore.VerificationCodeStatus.INVALID) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "VERIFICATION_CODE_INVALID", "验证码不正确。");
        }

        Instant now = Instant.now();
        StoredUser user = new StoredUser(
                UUID.randomUUID().toString(),
                account,
                channel,
                role,
                request.displayName().trim(),
                passwordEncoder.encode(request.password()),
                "bcrypt",
                now,
                now);
        authStore.saveUser(user);

        AuthUserResponse safeUser = toAuthUser(user);
        return new AuthResultResponse(jwtService.createAccessToken(safeUser), safeUser);
    }

    public AuthResultResponse loginWithPassword(LoginWithPasswordRequest request) {
        String account = normalizeAccount(request.account());
        StoredUser user = authStore.findUserByAccount(account)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", "账号不存在，请先完成注册。"));

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "账号或密码不正确。");
        }

        authStore.updateLastLogin(account, Instant.now());
        AuthUserResponse safeUser = toAuthUser(user);
        return new AuthResultResponse(jwtService.createAccessToken(safeUser), safeUser);
    }

    public AuthResultResponse loginWithCode(LoginWithCodeRequest request) {
        String account = normalizeAccount(request.account());
        StoredUser user = authStore.findUserByAccount(account)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", "账号不存在，请先完成注册。"));

        JsonAuthStore.VerificationCodeConsumeResult consumeResult = authStore.consumeVerificationCode(account, VerificationCodePurpose.LOGIN, request.code().trim());
        if (consumeResult.status() == JsonAuthStore.VerificationCodeStatus.MISSING) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "VERIFICATION_CODE_MISSING", "请先获取登录验证码，或验证码已过期。");
        }

        if (consumeResult.status() == JsonAuthStore.VerificationCodeStatus.INVALID) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "VERIFICATION_CODE_INVALID", "验证码不正确。");
        }

        authStore.updateLastLogin(account, Instant.now());
        AuthUserResponse safeUser = toAuthUser(user);
        return new AuthResultResponse(jwtService.createAccessToken(safeUser), safeUser);
    }

    public AuthUserResponse getCurrentUser(String accessToken) {
        DecodedJWT decodedJWT = jwtService.verify(accessToken);
        String account = Optional.ofNullable(decodedJWT.getClaim("account").asString())
            .map(this::normalizeAccount)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "登录态无效，请重新登录。"));

        StoredUser user = authStore.findUserByAccount(account)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "登录态无效，请重新登录。"));
        return toAuthUser(user);
    }

    private AuthUserResponse toAuthUser(StoredUser user) {
        return new AuthUserResponse(
                user.id(),
                user.account(),
                user.channel(),
                user.role(),
                user.displayName(),
                user.createdAt());
    }

    private String normalizeAccount(String account) {
        return account.trim().toLowerCase(Locale.ROOT);
    }

    private AuthChannel requireChannel(String account) {
        if (PHONE_PATTERN.matcher(account).matches()) {
            return AuthChannel.PHONE;
        }

        if (EMAIL_PATTERN.matcher(account).matches()) {
            return AuthChannel.EMAIL;
        }

        throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_ACCOUNT", "请输入有效的中国大陆手机号或邮箱地址。");
    }

    private String generateVerificationCode() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1_000_000));
    }
}