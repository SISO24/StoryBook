package com.storybook.backend.repo;
import com.storybook.backend.entity.StoryBlockEntity;
import com.storybook.backend.entity.StoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface StoryBlockRepo extends  JpaRepository<StoryBlockEntity,UUID> {

    Optional<StoryBlockEntity> findByIdAndStory(UUID id, StoryEntity story);
    
    int  countByStory (StoryEntity story);
    
}
