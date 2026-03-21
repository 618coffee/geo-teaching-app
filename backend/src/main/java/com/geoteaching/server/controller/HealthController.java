package com.geoteaching.server.controller;

import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.HealthResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final AuthProperties authProperties;

    public HealthController(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @GetMapping("/health")
    public ApiSuccessResponse<HealthResponse> health() {
        return ApiSuccessResponse.of(new HealthResponse("ok", authProperties.notificationProvider(), Instant.now()));
    }
}