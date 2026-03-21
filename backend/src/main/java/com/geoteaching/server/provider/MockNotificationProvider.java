package com.geoteaching.server.provider;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.VerificationCodePurpose;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MockNotificationProvider implements NotificationProvider {

    private static final Logger LOGGER = LoggerFactory.getLogger(MockNotificationProvider.class);

    @Override
    public NotificationResult sendVerificationCode(String account, AuthChannel channel, VerificationCodePurpose purpose, String code) {
        String requestId = UUID.randomUUID().toString();
        LOGGER.info("[mock-notification] purpose={} channel={} account={} code={} requestId={}", purpose, channel, account, code, requestId);
        return new NotificationResult("mock", requestId);
    }
}