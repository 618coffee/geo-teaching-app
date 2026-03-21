package com.geoteaching.server.model;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.VerificationCodePurpose;
import java.time.Instant;

public record VerificationCodeRecord(
        String account,
        AuthChannel channel,
        VerificationCodePurpose purpose,
        String code,
        Instant expiresAt,
        Instant createdAt) {
}