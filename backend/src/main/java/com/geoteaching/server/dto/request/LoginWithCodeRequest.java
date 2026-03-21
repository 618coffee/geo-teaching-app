package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginWithCodeRequest(
        @NotBlank(message = "账号不能为空")
        String account,
        @NotBlank(message = "验证码不能为空")
        String code) {
}