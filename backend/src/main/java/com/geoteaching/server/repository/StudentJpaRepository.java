package com.geoteaching.server.repository;

import com.geoteaching.server.model.StudentEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentJpaRepository extends JpaRepository<StudentEntity, String> {

    List<StudentEntity> findByClassIdOrderByStudentNumberAsc(String classId);

    List<StudentEntity> findByClassIdInOrderByStudentNumberAsc(List<String> classIds);

    Optional<StudentEntity> findByStudentNumber(String studentNumber);

    long countByClassId(String classId);
}
