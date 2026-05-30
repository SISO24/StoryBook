package com.storybook.backend.dto;
import com.storybook.backend.entity.StoryEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record StorySummaryResponse(
    UUID id,
    String title,
    int blockcount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt

) {

    public static StorySummaryResponse from(StoryEntity story){
        return new StorySummaryResponse(
        story.getId(), 
        story.getTitle(),
        story.getBlocks().size(),
        story.getCreatedAt(),
        story.getUpdatedAt()
    );
    }
    
}
