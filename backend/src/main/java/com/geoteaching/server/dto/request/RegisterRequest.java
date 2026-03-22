package com.geoteaching.server.dto.request;

import com.geoteaching.server.domain.UserRole;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "账号不能为空")
        String account,
        @NotBlank(message = "密码不能为空")
        String password,
        @NotBlank(message = "姓名不能为空")
        String displayName,
        UserRole role) {
}