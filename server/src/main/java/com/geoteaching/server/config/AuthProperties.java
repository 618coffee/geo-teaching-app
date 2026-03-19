package com.geoteaching.server.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
        String jwtSecret,
        long accessTokenExpiresInHours,
        long verificationCodeTtlSeconds,
        long verificationCodeRetrySeconds,
        boolean exposeVerificationCode,
        String notificationProvider,
        String dataFilePath,
        List<String> corsOrigins,
        String aliyunSmsSignName,
        String aliyunSmsTemplateCode,
        String aliyunEmailAccountName) {
}