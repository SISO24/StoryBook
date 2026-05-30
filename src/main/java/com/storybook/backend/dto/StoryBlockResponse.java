package com.storybook.backend.dto;
import com.storybook.backend.entity.StoryBlockEntity;
import com.storybook.backend.entity.StoryBlockEntity.BlockType;
import java.time.LocalDateTime;
import java.util.UUID;

public record StoryBlockResponse(
    UUID id,
    BlockType type,
    String content,
    Integer position,
    LocalDateTime createdAt
) {
    public static StoryBlockResponse from(StoryBlockEntity block ){
        return new StoryBlockResponse(
            block.getId(),
            block.getType(),
            block.getContent(),
            block.getPosition(),
            block.getCreatedAt()
        );
    }
    
}
