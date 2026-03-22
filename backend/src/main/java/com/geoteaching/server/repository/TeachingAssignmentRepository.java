package com.geoteaching.server.repository;

import com.geoteaching.server.model.TeachingAssignmentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachingAssignmentRepository extends JpaRepository<TeachingAssignmentEntity, String> {

    List<TeachingAssignmentEntity> findByUserId(String userId);

    void deleteByUserId(String userId);
}
