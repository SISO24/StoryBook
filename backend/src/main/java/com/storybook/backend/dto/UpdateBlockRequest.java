package com.storybook.backend.dto;
import jakarta.validation.constraints.NotBlank;

public record UpdateBlockRequest(
    @NotBlank(message="Content is required")
    String content
) {}
