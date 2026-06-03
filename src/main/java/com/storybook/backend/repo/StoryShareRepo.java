package com.storybook.backend.repo;
import com.storybook.backend.entity.StoryEntity;
import com.storybook.backend.entity.StoryShareEntity;
import com.storybook.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoryShareRepo extends JpaRepository<StoryShareEntity,UUID> {

    List<StoryShareEntity> findBySharedWith(UserEntity sharedWith);

    Optional<StoryShareEntity> findByStoryAndSharedWith(StoryEntity story, UserEntity sharedWith);

    boolean existsByStoryAndSharedWith(StoryEntity story, UserEntity sharedWith);

    void deleteByStoryAndSharedWith(StoryEntity story, UserEntity sharedWith);
    
}
