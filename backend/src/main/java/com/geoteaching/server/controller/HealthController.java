package com.geoteaching.server.controller;

import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.HealthResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiSuccessResponse<HealthResponse> health() {
        return ApiSuccessResponse.of(new HealthResponse("ok", Instant.now()));
    }
}