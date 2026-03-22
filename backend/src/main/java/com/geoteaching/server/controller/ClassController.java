package com.geoteaching.server.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.dto.request.CreateClassRequest;
import com.geoteaching.server.dto.request.UpdateClassRequest;
import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.ClassResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.service.ClassService;
import com.geoteaching.server.service.JwtService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/classes")
public class ClassController {

    private final ClassService classService;
    private final JwtService jwtService;

    public ClassController(ClassService classService, JwtService jwtService) {
        this.classService = classService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ApiSuccessResponse<List<ClassResponse>> list(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String teacherId = jwt.getSubject();
        return ApiSuccessResponse.of(classService.listByTeacher(teacherId));
    }

    @PostMapping
    public ResponseEntity<ApiSuccessResponse<ClassResponse>> create(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @Valid @RequestBody CreateClassRequest request) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String teacherId = jwt.getSubject();
        String displayName = jwt.getClaim("displayName").asString();
        ClassResponse created = classService.create(teacherId, displayName, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiSuccessResponse.of(created));
    }

    @PutMapping("/{id}")
    public ApiSuccessResponse<ClassResponse> update(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @PathVariable String id,
            @Valid @RequestBody UpdateClassRequest request) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String teacherId = jwt.getSubject();
        return ApiSuccessResponse.of(classService.update(id, teacherId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @PathVariable String id) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String teacherId = jwt.getSubject();
        classService.delete(id, teacherId);
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
