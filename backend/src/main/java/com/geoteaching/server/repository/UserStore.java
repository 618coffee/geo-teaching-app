package com.geoteaching.server.repository;

import com.geoteaching.server.model.StoredUser;
import java.time.Instant;
import java.util.Optional;

/**
 * Abstraction over user persistence — implemented by both
 * {@link JsonAuthStore} (dev/local) and {@link JpaUserStore} (MySQL).
 */
public interface UserStore {

    Optional<StoredUser> findUserByAccount(String account);

    void saveUser(StoredUser user);

    void updateLastLogin(String account, Instant lastLoginAt);

    void updateDisplayName(String account, String displayName);
}
