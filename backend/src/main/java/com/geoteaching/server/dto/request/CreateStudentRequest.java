package com.geoteaching.server.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateStudentRequest(
        @NotBlank(message = "班级ID不能为空")
        String classId,
        @NotBlank(message = "学号不能为空")
        String studentNumber,
        @NotBlank(message = "姓名不能为空")
        String name,
        String password) {
}
