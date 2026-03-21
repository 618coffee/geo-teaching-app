package com.geoteaching.server.model;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import java.time.Instant;

public record StoredUser(
        String id,
        String account,
        AuthChannel channel,
        UserRole role,
        String displayName,
        String passwordHash,
        String passwordSalt,
        Instant createdAt,
        Instant lastLoginAt) {
}