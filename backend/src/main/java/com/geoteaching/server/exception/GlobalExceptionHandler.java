package com.geoteaching.server.exception;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.geoteaching.server.dto.response.ApiErrorResponse;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException exception) {
        return ResponseEntity.status(exception.getStatus())
                .body(ApiErrorResponse.of(exception.getCode(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("；"));

        return ResponseEntity.badRequest().body(ApiErrorResponse.of("VALIDATION_FAILED", message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleReadableException(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(ApiErrorResponse.of("INVALID_REQUEST_BODY", "请求体格式不正确。"));
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(JWTVerificationException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiErrorResponse.of("INVALID_TOKEN", "登录态无效，请重新登录。"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception exception) {
        log.error("Unhandled exception", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of("INTERNAL_SERVER_ERROR", "服务器内部错误，请稍后再试。"));
    }
}