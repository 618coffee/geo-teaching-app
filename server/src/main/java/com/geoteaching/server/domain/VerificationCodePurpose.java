package com.geoteaching.server.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VerificationCodePurpose {
    REGISTER("register"),
    LOGIN("login");

    private final String value;

    VerificationCodePurpose(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static VerificationCodePurpose fromValue(String value) {
        for (VerificationCodePurpose purpose : values()) {
            if (purpose.value.equalsIgnoreCase(value)) {
                return purpose;
            }
        }

        throw new IllegalArgumentException("Unsupported verification purpose: " + value);
    }
}