package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateStudentRequest(
        @NotBlank(message = "姓名不能为空")
        String name,
        @NotBlank(message = "班级ID不能为空")
        String classId,
        String status) {
}
