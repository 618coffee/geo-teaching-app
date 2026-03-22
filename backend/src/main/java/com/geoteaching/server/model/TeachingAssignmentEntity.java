package com.geoteaching.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "teaching_assignments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "class_id"})
})
public class TeachingAssignmentEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "class_id", nullable = false, length = 36)
    private String classId;

    protected TeachingAssignmentEntity() {}

    public TeachingAssignmentEntity(String id, String userId, String classId) {
        this.id = id;
        this.userId = userId;
        this.classId = classId;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getClassId() { return classId; }
}
