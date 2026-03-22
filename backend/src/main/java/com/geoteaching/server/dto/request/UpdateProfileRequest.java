package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "姓名不能为空")
        String displayName) {
}
