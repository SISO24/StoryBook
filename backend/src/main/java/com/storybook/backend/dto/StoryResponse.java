package com.storybook.backend.dto;
import com.storybook.backend.entity.StoryEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StoryResponse(
    UUID id,
    String title,
    List<StoryBlockResponse> blocks,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static StoryResponse from(StoryEntity story){
return new StoryResponse(
  story.getId(),
            story.getTitle(),
            story.getBlocks()
                 .stream()
                 .map(StoryBlockResponse::from)
                 .toList(),
            story.getCreatedAt(),
            story.getUpdatedAt()
);
    }
}
