package com.geoteaching.server.model;

import com.geoteaching.server.domain.AuthChannel;
import com.geoteaching.server.domain.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 128)
    private String account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private AuthChannel channel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UserRole role;

    @Column(name = "display_name", nullable = false, length = 64)
    private String displayName;

    @Column(name = "password_hash", nullable = false, length = 128)
    private String passwordHash;

    @Column(name = "password_salt", nullable = false, length = 32)
    private String passwordSalt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    protected UserEntity() {}

    public UserEntity(String id, String account, AuthChannel channel, UserRole role,
                      String displayName, String passwordHash, String passwordSalt,
                      Instant createdAt, Instant lastLoginAt) {
        this.id = id;
        this.account = account;
        this.channel = channel;
        this.role = role;
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.passwordSalt = passwordSalt;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }

    public StoredUser toStoredUser() {
        return new StoredUser(id, account, channel, role, displayName,
                passwordHash, passwordSalt, createdAt, lastLoginAt);
    }

    public static UserEntity fromStoredUser(StoredUser user) {
        return new UserEntity(user.id(), user.account(), user.channel(), user.role(),
                user.displayName(), user.passwordHash(), user.passwordSalt(),
                user.createdAt(), user.lastLoginAt());
    }

    public String getId() { return id; }
    public String getAccount() { return account; }
    public AuthChannel getChannel() { return channel; }
    public UserRole getRole() { return role; }
    public String getDisplayName() { return displayName; }
    public String getPasswordHash() { return passwordHash; }
    public String getPasswordSalt() { return passwordSalt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastLoginAt() { return lastLoginAt; }

    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
