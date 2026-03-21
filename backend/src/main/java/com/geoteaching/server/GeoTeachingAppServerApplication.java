package com.geoteaching.server;

import com.geoteaching.server.config.AuthProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AuthProperties.class)
public class GeoTeachingAppServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeoTeachingAppServerApplication.class, args);
    }
}