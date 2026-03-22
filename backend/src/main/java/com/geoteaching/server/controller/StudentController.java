package com.geoteaching.server.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.dto.request.CreateStudentRequest;
import com.geoteaching.server.dto.request.UpdateStudentRequest;
import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.ClassResponse;
import com.geoteaching.server.dto.response.StudentResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.service.ClassService;
import com.geoteaching.server.service.JwtService;
import com.geoteaching.server.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;
    private final ClassService classService;
    private final JwtService jwtService;

    public StudentController(StudentService studentService, ClassService classService,
                             JwtService jwtService) {
        this.studentService = studentService;
        this.classService = classService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ApiSuccessResponse<List<StudentResponse>> list(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @RequestParam(required = false) String classId) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String teacherId = jwt.getSubject();

        if (classId != null && !classId.isBlank()) {
            return ApiSuccessResponse.of(studentService.listByClass(classId));
        }

        // Return students from all classes owned by this teacher
        List<String> classIds = classService.listByTeacher(teacherId).stream()
                .map(ClassResponse::id)
                .toList();
        return ApiSuccessResponse.of(studentService.listByTeacherClasses(classIds));
    }

    @PostMapping
    public ResponseEntity<ApiSuccessResponse<StudentResponse>> create(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @Valid @RequestBody CreateStudentRequest request) {
        resolveJwt(authHeader); // ensure authenticated
        StudentResponse created = studentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiSuccessResponse.of(created));
    }

    @PutMapping("/{id}")
    public ApiSuccessResponse<StudentResponse> update(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @PathVariable String id,
            @Valid @RequestBody UpdateStudentRequest request) {
        resolveJwt(authHeader);
        return ApiSuccessResponse.of(studentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @PathVariable String id) {
        resolveJwt(authHeader); // ensure authenticated
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private DecodedJWT resolveJwt(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTHORIZATION_INVALID", "请先登录。");
        }
        String token = authHeader.substring("Bearer ".length()).trim();
        if (token.isEmpty()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTHORIZATION_INVALID", "请先登录。");
        }
        return jwtService.verify(token);
    }
}
