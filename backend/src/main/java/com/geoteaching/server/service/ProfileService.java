package com.geoteaching.server.service;

import com.geoteaching.server.dto.response.AuthUserResponse;
import com.geoteaching.server.exception.ApiException;
import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.model.TeachingAssignmentEntity;
import com.geoteaching.server.repository.ClassJpaRepository;
import com.geoteaching.server.repository.TeachingAssignmentRepository;
import com.geoteaching.server.repository.UserStore;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserStore userStore;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final ClassJpaRepository classRepository;

    public ProfileService(UserStore userStore,
                          TeachingAssignmentRepository teachingAssignmentRepository,
                          ClassJpaRepository classRepository) {
        this.userStore = userStore;
        this.teachingAssignmentRepository = teachingAssignmentRepository;
        this.classRepository = classRepository;
    }

    public AuthUserResponse updateDisplayName(String account, String displayName) {
        StoredUser user = userStore.findUserByAccount(account)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ACCOUNT_NOT_FOUND", "账号不存在。"));

        userStore.updateDisplayName(account, displayName.trim());

        return new AuthUserResponse(
                user.id(), user.account(), user.channel(),
                user.role(), displayName.trim(), user.createdAt());
    }

    public List<String> getTeachingClassIds(String userId) {
        return teachingAssignmentRepository.findByUserId(userId).stream()
                .map(TeachingAssignmentEntity::getClassId)
                .toList();
    }

    @Transactional
    public List<String> setTeachingClassIds(String userId, List<String> classIds) {
        // Validate that all class IDs exist
        for (String classId : classIds) {
            if (!classRepository.existsById(classId)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "CLASS_NOT_FOUND",
                        "班级不存在：" + classId);
            }
        }

        teachingAssignmentRepository.deleteByUserId(userId);

        List<TeachingAssignmentEntity> assignments = classIds.stream()
                .distinct()
                .map(classId -> new TeachingAssignmentEntity(
                        UUID.randomUUID().toString(), userId, classId))
                .toList();
        teachingAssignmentRepository.saveAll(assignments);

        return classIds.stream().distinct().toList();
    }
}
