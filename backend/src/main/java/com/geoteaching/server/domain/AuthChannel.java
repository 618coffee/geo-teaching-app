package com.geoteaching.server.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AuthChannel {
    PHONE("phone"),
    EMAIL("email"),
    USERNAME("username");

    private final String value;

    AuthChannel(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return value;
    }

    @JsonCreator
    public static AuthChannel fromValue(String value) {
        for (AuthChannel channel : values()) {
            if (channel.value.equalsIgnoreCase(value)) {
                return channel;
            }
        }

        throw new IllegalArgumentException("Unsupported auth channel: " + value);
    }
}