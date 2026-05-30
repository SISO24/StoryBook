package com.storybook.backend.dto;
import com.storybook.backend.entity.UserEntity;
import java.time.LocalDateTime;

public record UserResponse(
    String id,
    String email,
    LocalDateTime createdAt
) {
    public static UserResponse from(UserEntity user){
      return new UserResponse(
            user.getId().toString(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }
}
