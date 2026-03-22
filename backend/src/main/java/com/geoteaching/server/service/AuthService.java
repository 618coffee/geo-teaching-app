package com.geoteaching.server.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import com.geoteaching.server.dto.request.LoginWithPasswordRequest;
import com.geoteaching.server.dto.request.RegisterRequest;
import com.geoteaching.server.dto.response.AuthResultResponse;
import com.geoteaching.server.dto.response.AuthUserResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.repository.UserStore;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", Pattern.CASE_INSENSITIVE);

    private final UserStore authStore;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(
            UserStore authStore,
            JwtService jwtService,
            AuthProperties authProperties) {
        this.authStore = authStore;
        this.jwtService = jwtService;
    }

    public AuthResultResponse register(RegisterRequest request) {
        String account = normalizeAccount(request.account());
        AuthChannel channel = detectChannel(account);
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

    private AuthChannel detectChannel(String account) {
        if (PHONE_PATTERN.matcher(account).matches()) {
            return AuthChannel.PHONE;
        }

        if (EMAIL_PATTERN.matcher(account).matches()) {
            return AuthChannel.EMAIL;
        }

        return AuthChannel.USERNAME;
    }
}