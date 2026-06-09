package com.storybook.backend.dto;
import jakarta.validation.constraints.NotNull;

public record UpdateBlockRequest(
    @NotNull(message="Content object container cannot be null")
    String content
) {}
