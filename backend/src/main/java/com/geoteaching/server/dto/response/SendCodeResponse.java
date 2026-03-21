package com.geoteaching.server.dto.response;

import com.geoteaching.server.domain.AuthChannel;

public record SendCodeResponse(
        AuthChannel channel,
        long expiresInSeconds,
        long retryAfterSeconds,
        String requestId,
        String debugCode) {
}