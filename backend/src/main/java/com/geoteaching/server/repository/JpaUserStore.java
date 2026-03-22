package com.geoteaching.server.repository;

import com.geoteaching.server.model.StoredUser;
import com.geoteaching.server.model.UserEntity;
import java.time.Instant;
import java.util.Optional;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Profile("mysql")
public class JpaUserStore implements UserStore {

    private final UserJpaRepository jpaRepository;

    public JpaUserStore(UserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<StoredUser> findUserByAccount(String account) {
        return jpaRepository.findByAccount(account).map(UserEntity::toStoredUser);
    }

    @Override
    @Transactional
    public void saveUser(StoredUser user) {
        jpaRepository.save(UserEntity.fromStoredUser(user));
    }

    @Override
    @Transactional
    public void updateLastLogin(String account, Instant lastLoginAt) {
        jpaRepository.findByAccount(account).ifPresent(entity -> {
            entity.setLastLoginAt(lastLoginAt);
            jpaRepository.save(entity);
        });
    }

    @Override
    @Transactional
    public void updateDisplayName(String account, String displayName) {
        jpaRepository.findByAccount(account).ifPresent(entity -> {
            entity.setDisplayName(displayName);
            jpaRepository.save(entity);
        });
    }
}
