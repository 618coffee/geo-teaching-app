package com.geoteaching.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "student_number", nullable = false, unique = true, length = 32)
    private String studentNumber;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(name = "class_id", nullable = false, length = 36)
    private String classId;

    @Column(name = "class_name", nullable = false, length = 64)
    private String className;

    @Column(nullable = false, length = 16)
    private String status;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected StudentEntity() {}

    public StudentEntity(String id, String studentNumber, String name, String classId,
                         String className, String status, String userId, Instant createdAt) {
        this.id = id;
        this.studentNumber = studentNumber;
        this.name = name;
        this.classId = classId;
        this.className = className;
        this.status = status;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getStudentNumber() { return studentNumber; }
    public String getName() { return name; }
    public String getClassId() { return classId; }
    public String getClassName() { return className; }
    public String getStatus() { return status; }
    public String getUserId() { return userId; }
    public Instant getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setClassName(String className) { this.className = className; }
    public void setClassId(String classId) { this.classId = classId; }
    public void setStatus(String status) { this.status = status; }
    public void setUserId(String userId) { this.userId = userId; }
}
