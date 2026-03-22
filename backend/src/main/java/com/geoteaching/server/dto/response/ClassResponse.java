package com.geoteaching.server.dto.response;

import java.time.Instant;

public record ClassResponse(
        String id,
        String name,
        long students,
        String teacher,
        String status,
        Instant createdAt) {
}
