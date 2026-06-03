package com.storybook.backend.dto;
import com.storybook.backend.entity.StoryShareEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record ShareStoryResponse(
    UUID shareId,
    UUID storyId,
    String storyTitle,
    String sharedByEmail,
    int blockCount,
    LocalDateTime sharedAt
) {
     public static ShareStoryResponse from(StoryShareEntity share) {
        return new ShareStoryResponse(
            share.getId(),
            share.getStory().getId(),
            share.getStory().getTitle(),
            share.getSharedBy().getEmail(),
            share.getStory().getBlocks().size(),
            share.getCreatedAt()
        );
    }
}
