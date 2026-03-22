package com.geoteaching.server.dto.response;

import java.time.Instant;

public record StudentResponse(
        String id,
        String name,
        String className,
        String classId,
        String studentId,
        String status,
        Instant createdAt) {
}
