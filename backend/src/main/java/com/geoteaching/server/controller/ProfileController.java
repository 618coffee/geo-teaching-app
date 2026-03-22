package com.geoteaching.server.controller;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.geoteaching.server.dto.request.UpdateProfileRequest;
import com.geoteaching.server.dto.request.UpdateTeachingClassesRequest;
import com.geoteaching.server.dto.response.ApiSuccessResponse;
import com.geoteaching.server.dto.response.AuthUserResponse;
import com.geoteaching.server.dto.response.TeachingClassesResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.service.JwtService;
import com.geoteaching.server.service.ProfileService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @PutMapping
    public ApiSuccessResponse<AuthUserResponse> updateProfile(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @Valid @RequestBody UpdateProfileRequest request) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String account = jwt.getClaim("account").asString();
        return ApiSuccessResponse.of(profileService.updateDisplayName(account, request.displayName()));
    }

    @GetMapping("/teaching-classes")
    public ApiSuccessResponse<TeachingClassesResponse> getTeachingClasses(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String userId = jwt.getSubject();
        List<String> classIds = profileService.getTeachingClassIds(userId);
        return ApiSuccessResponse.of(new TeachingClassesResponse(classIds));
    }

    @PutMapping("/teaching-classes")
    public ApiSuccessResponse<TeachingClassesResponse> setTeachingClasses(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            @RequestBody UpdateTeachingClassesRequest request) {
        DecodedJWT jwt = resolveJwt(authHeader);
        String userId = jwt.getSubject();
        List<String> classIds = request.classIds() != null ? request.classIds() : List.of();
        List<String> saved = profileService.setTeachingClassIds(userId, classIds);
        return ApiSuccessResponse.of(new TeachingClassesResponse(saved));
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
