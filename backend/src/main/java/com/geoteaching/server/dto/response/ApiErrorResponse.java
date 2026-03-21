package com.geoteaching.server.dto.response;

public record ApiErrorResponse(boolean success, ApiErrorBody error) {

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(false, new ApiErrorBody(code, message));
    }

    public record ApiErrorBody(String code, String message) {
    }
}