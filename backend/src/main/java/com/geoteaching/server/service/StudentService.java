package com.geoteaching.server.service;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import com.geoteaching.server.dto.request.CreateStudentRequest;
import com.geoteaching.server.dto.request.UpdateStudentRequest;
import com.geoteaching.server.dto.response.StudentResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.model.ClassEntity;
import com.geoteaching.server.model.StudentEntity;
import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.repository.StudentJpaRepository;
import com.geoteaching.server.repository.UserStore;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentJpaRepository studentRepository;
    private final ClassService classService;
    private final UserStore userStore;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public StudentService(StudentJpaRepository studentRepository, ClassService classService,
                          UserStore userStore) {
        this.studentRepository = studentRepository;
        this.classService = classService;
        this.userStore = userStore;
    }

    public List<StudentResponse> listByTeacherClasses(List<String> classIds) {
        if (classIds.isEmpty()) {
            return List.of();
        }
        return studentRepository.findByClassIdInOrderByStudentNumberAsc(classIds).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<StudentResponse> listByClass(String classId) {
        return studentRepository.findByClassIdOrderByStudentNumberAsc(classId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public StudentResponse create(CreateStudentRequest request) {
        ClassEntity classEntity = classService.getEntityById(request.classId());

        if (studentRepository.findByStudentNumber(request.studentNumber().trim()).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "STUDENT_NUMBER_EXISTS", "该学号已存在。");
        }

        // Create a user account for the student if password provided
        String userId = null;
        String password = request.password();
        if (password != null && !password.isBlank()) {
            String account = request.studentNumber().trim();
            if (userStore.findUserByAccount(account).isPresent()) {
                throw new ApiException(HttpStatus.CONFLICT, "ACCOUNT_EXISTS", "该学号对应的账号已存在。");
            }
            userId = UUID.randomUUID().toString();
            Instant now = Instant.now();
            StoredUser user = new StoredUser(
                    userId,
                    account,
                    AuthChannel.USERNAME,
                    UserRole.STUDENT,
                    request.name().trim(),
                    passwordEncoder.encode(password),
                    "bcrypt",
                    now,
                    null);
            userStore.saveUser(user);
        }

        StudentEntity entity = new StudentEntity(
                UUID.randomUUID().toString(),
                request.studentNumber().trim(),
                request.name().trim(),
                classEntity.getId(),
                classEntity.getName(),
                "正常",
                userId,
                Instant.now());
        studentRepository.save(entity);
        return toResponse(entity);
    }

    @Transactional
    public StudentResponse update(String studentId, UpdateStudentRequest request) {
        StudentEntity entity = studentRepository.findById(studentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "STUDENT_NOT_FOUND", "学生不存在。"));
        ClassEntity classEntity = classService.getEntityById(request.classId());
        entity.setName(request.name().trim());
        entity.setClassId(classEntity.getId());
        entity.setClassName(classEntity.getName());
        if (request.status() != null && !request.status().isBlank()) {
            entity.setStatus(request.status().trim());
        }
        studentRepository.save(entity);
        return toResponse(entity);
    }

    @Transactional
    public void delete(String studentId) {
        StudentEntity entity = studentRepository.findById(studentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "STUDENT_NOT_FOUND", "学生不存在。"));
        studentRepository.delete(entity);
    }

    private StudentResponse toResponse(StudentEntity entity) {
        return new StudentResponse(
                entity.getId(),
                entity.getName(),
                entity.getClassName(),
                entity.getClassId(),
                entity.getStudentNumber(),
                entity.getStatus(),
                entity.getCreatedAt());
    }
}
