package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateClassRequest(
        @NotBlank(message = "班级名称不能为空")
        String name,
        String teacherName) {
}
