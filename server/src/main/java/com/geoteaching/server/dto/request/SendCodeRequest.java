package com.geoteaching.server.dto.request;

import com.geoteaching.server.domain.VerificationCodePurpose;
import jakarta.validation.constraints.NotBlank;

public record SendCodeRequest(
        @NotBlank(message = "账号不能为空")
        String account,
        VerificationCodePurpose purpose) {
}