package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginWithPasswordRequest(
        @NotBlank(message = "账号不能为空")
        String account,
        @NotBlank(message = "密码不能为空")
        String password) {
}