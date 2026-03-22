package com.geoteaching.server.repository;

import com.geoteaching.server.model.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserJpaRepository extends JpaRepository<UserEntity, String> {

    Optional<UserEntity> findByAccount(String account);
}
