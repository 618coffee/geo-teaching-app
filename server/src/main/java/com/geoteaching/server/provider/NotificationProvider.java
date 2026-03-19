package com.geoteaching.server.provider;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.VerificationCodePurpose;

public interface NotificationProvider {

    NotificationResult sendVerificationCode(
            String account,
            AuthChannel channel,
            VerificationCodePurpose purpose,
            String code);

    record NotificationResult(String provider, String requestId) {
    }
}