package com.geoteaching.server.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.config.AuthProperties;
import com.geoteaching.server.dto.response.AuthUserResponse;
import java.time.Instant;
import java.util.Date;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final AuthProperties authProperties;

    public JwtService(AuthProperties authProperties) {
        this.authProperties = authProperties;
        this.algorithm = Algorithm.HMAC256(authProperties.jwtSecret());
        this.verifier = JWT.require(algorithm).build();
    }

    public String createAccessToken(AuthUserResponse user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(authProperties.accessTokenExpiresInHours() * 3600);

        return JWT.create()
                .withSubject(user.id())
                .withClaim("account", user.account())
                .withClaim("role", user.role().name())
                .withClaim("displayName", user.displayName())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expiresAt))
                .sign(algorithm);
    }

    public DecodedJWT verify(String token) {
        return verifier.verify(token);
    }
}