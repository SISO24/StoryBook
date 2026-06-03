package com.storybook.backend.dto;
import com.storybook.backend.entity.StoryBlockEntity.BlockType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddBlockRequest(
    @NotNull(message = "Block type is required")
    BlockType type,

    @NotBlank(message = "Content is required")
    String content
) {}
