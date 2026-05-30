package com.storybook.backend.repo;
import com.storybook.backend.entity.StoryEntity;
import com.storybook.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface StoryRepo extends JpaRepository<StoryEntity,UUID>  {
    
 List<StoryEntity> findByUserOrderByCreatedAtDesc(UserEntity user);

    Optional<StoryEntity> findByIdAndUser(UUID id, UserEntity user);

}
