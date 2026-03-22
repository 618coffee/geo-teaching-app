package com.geoteaching.server.service;

import com.geoteaching.server.dto.request.CreateClassRequest;
import com.geoteaching.server.dto.request.UpdateClassRequest;
import com.geoteaching.server.dto.response.ClassResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.model.ClassEntity;
import com.geoteaching.server.repository.ClassJpaRepository;
import com.geoteaching.server.repository.StudentJpaRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClassService {

    private final ClassJpaRepository classRepository;
    private final StudentJpaRepository studentRepository;

    public ClassService(ClassJpaRepository classRepository, StudentJpaRepository studentRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
    }

    public List<ClassResponse> listByTeacher(String teacherId) {
        return classRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ClassResponse create(String teacherId, String teacherDisplayName, CreateClassRequest request) {
        String teacherName = (request.teacherName() != null && !request.teacherName().isBlank())
                ? request.teacherName().trim()
                : teacherDisplayName;

        ClassEntity entity = new ClassEntity(
                UUID.randomUUID().toString(),
                request.name().trim(),
                teacherId,
                teacherName,
                "正常",
                Instant.now());
        classRepository.save(entity);
        return toResponse(entity);
    }

    @Transactional
    public ClassResponse update(String classId, String teacherId, UpdateClassRequest request) {
        ClassEntity entity = classRepository.findById(classId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASS_NOT_FOUND", "班级不存在。"));
        if (!entity.getTeacherId().equals(teacherId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "无权操作此班级。");
        }
        entity.setName(request.name().trim());
        if (request.teacherName() != null && !request.teacherName().isBlank()) {
            entity.setTeacherName(request.teacherName().trim());
        }
        classRepository.save(entity);
        return toResponse(entity);
    }

    @Transactional
    public void delete(String classId, String teacherId) {
        ClassEntity entity = classRepository.findById(classId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASS_NOT_FOUND", "班级不存在。"));
        if (!entity.getTeacherId().equals(teacherId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "无权操作此班级。");
        }
        classRepository.delete(entity);
    }

    public ClassEntity getEntityById(String classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CLASS_NOT_FOUND", "班级不存在。"));
    }

    private ClassResponse toResponse(ClassEntity entity) {
        long studentCount = studentRepository.countByClassId(entity.getId());
        return new ClassResponse(
                entity.getId(),
                entity.getName(),
                studentCount,
                entity.getTeacherName(),
                entity.getStatus(),
                entity.getCreatedAt());
    }
}
