package com.geoteaching.server.dto.response;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import java.time.Instant;

public record AuthUserResponse(
        String id,
        String account,
        AuthChannel channel,
        UserRole role,
        String displayName,
        Instant createdAt) {
}