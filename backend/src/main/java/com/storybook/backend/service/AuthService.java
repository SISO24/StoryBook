package com.storybook.backend.service;
import com.storybook.backend.entity.UserEntity;
import com.storybook.backend.entity.RefreshTokenEntity;
import com.storybook.backend.dto.LoginRequest; 
import com.storybook.backend.dto.AuthResponse;
import com.storybook.backend.dto.SignupRequest;
import com.storybook.backend.repo.UserRepo;
import com.storybook.backend.repo.RefrreshTokenRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final RefrreshTokenRepo refreshTokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;


   @Transactional
   public AuthResponse signup(SignupRequest request){
    if(userRepo.existsByEmail(request.email())){
        throw new RuntimeException("Email already registered");
    }

    UserEntity user= UserEntity.builder()
    .email(request.email())
    .password(passwordEncoder.encode(request.password())).build();

    userRepo.save(user);

    String accessToken= jwtService.generateAccessToken(user);
    String refreshToken=createRefreshToken(user);

    return AuthResponse.of(accessToken,refreshToken,user);


   }

       @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
            )
        );

        UserEntity user = userRepo.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Revoke all old refresh tokens for this user
        refreshTokenRepo.revokeAllByUser(user);

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = createRefreshToken(user);

        return AuthResponse.of(accessToken,refreshToken, user);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        RefreshTokenEntity refreshToken = refreshTokenRepo
                .findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (!refreshToken.isValid()) {
            throw new RuntimeException("Refresh token expired or revoked");
        }

        // Rotate — revoke old, issue new
        refreshToken.setRevoked(true);
        refreshTokenRepo.save(refreshToken);

        UserEntity user = refreshToken.getUser();
        String newAccessToken  = jwtService.generateAccessToken(user);
        String newRefreshToken = createRefreshToken(user);

        return AuthResponse.of(newAccessToken, newRefreshToken, user);
    }

   @Transactional
   public void logout(String refrehTokenValue){
    RefreshTokenEntity refreshTOken= refreshTokenRepo.findByToken(refrehTokenValue)
    .orElseThrow(()->new  RuntimeException("Refresh token not found"));
 refreshTokenRepo.revokeAllByUser(refreshTOken.getUser());

   }

   private String createRefreshToken(UserEntity user){
    RefreshTokenEntity refreshToken= RefreshTokenEntity
    .builder().
    token(UUID.randomUUID()
    .toString()).user(user)
    .expiresAt(LocalDateTime.now()
    .plusSeconds(refreshTokenExpiration/1000))
    .build();

     refreshTokenRepo.save(refreshToken);
   return refreshToken.getToken();

   }

  


}
