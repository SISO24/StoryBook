package com.storybook.backend.dto;
import com.storybook.backend.entity.UserEntity;

public record AuthResponse(
String accessToken,
String refreshToken,
String tokenType,
UserInfo user
) {
    public record UserInfo(
        String id,
        String email
    ){}
    public static AuthResponse of(String accessToken,String refreshToken,UserEntity user){
        return new AuthResponse(accessToken,
             refreshToken, 
             "Bearer",
             new UserInfo(
             user.getId().toString(),
             user.getEmail()
        ));
    }
    
}
