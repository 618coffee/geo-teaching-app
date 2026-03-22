package com.geoteaching.server.repository;

import com.geoteaching.server.model.ClassEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassJpaRepository extends JpaRepository<ClassEntity, String> {

    List<ClassEntity> findByTeacherIdOrderByCreatedAtDesc(String teacherId);
}
