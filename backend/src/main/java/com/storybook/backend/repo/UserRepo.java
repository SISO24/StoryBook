package com.storybook.backend.repo;
import com.storybook.backend.entity.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;


public interface UserRepo extends JpaRepository<UserEntity,UUID> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
