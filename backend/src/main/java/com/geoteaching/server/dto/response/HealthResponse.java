package com.geoteaching.server.dto.response;

import java.time.Instant;

public record HealthResponse(String status, String provider, Instant timestamp) {
}