package com.geoteaching.server.config;

import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AuthProperties authProperties;

    public WebConfig(AuthProperties authProperties) {
        this.authProperties = authProperties;
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(resolveCorsOrigins())
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @SuppressWarnings("null")
    private @NonNull String[] resolveCorsOrigins() {
        List<String> configuredOrigins = authProperties.corsOrigins();
        if (configuredOrigins == null || configuredOrigins.isEmpty()) {
            return new String[] {"http://localhost:5173"};
        }

        return configuredOrigins.stream()
                .filter(origin -> origin != null && !origin.isBlank())
                .toArray(String[]::new);
    }
}