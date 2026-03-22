package com.geoteaching.server.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.auth")
public record AuthProperties(
        String jwtSecret,
        long accessTokenExpiresInHours,
        String dataFilePath,
        List<String> corsOrigins) {
}