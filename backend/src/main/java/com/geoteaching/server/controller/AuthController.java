package com.geoteaching.server.controller;

import com.geoteaching.server.dto.request.LoginWithPasswordRequest;
import com.geoteaching.server.dto.request.RegisterRequest;
import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.AuthResultResponse;
import com.geoteaching.server.dto.response.AuthUserEnvelope;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiSuccessResponse<AuthResultResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiSuccessResponse.of(authService.register(request)));
    }

    @PostMapping("/login/password")
    public ApiSuccessResponse<AuthResultResponse> loginWithPassword(@Valid @RequestBody LoginWithPasswordRequest request) {
        return ApiSuccessResponse.of(authService.loginWithPassword(request));
    }

    @GetMapping("/me")
    public ApiSuccessResponse<AuthUserEnvelope> me(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader) {
        return ApiSuccessResponse.of(new AuthUserEnvelope(authService.getCurrentUser(extractBearerToken(authorizationHeader))));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTHORIZATION_INVALID", "Authorization 格式必须为 Bearer token。");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();
        if (token.isEmpty()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTHORIZATION_INVALID", "Authorization 格式必须为 Bearer token。");
        }

        return token;
    }
}