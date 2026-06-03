package com.storybook.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateStoryRequest(
    @NotBlank(message = "Title is required")
    String title
) {}