package com.geoteaching.server.dto.response;

public record AuthResultResponse(String accessToken, AuthUserResponse user) {
}