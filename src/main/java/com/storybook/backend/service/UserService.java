package com.storybook.backend.service;
import com.storybook.backend.entity.UserEntity;
import com.storybook.backend.dto.UserResponse;
import com.storybook.backend.repo.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.storybook.backend.repo.RefrreshTokenRepo;
import java.util.stream.Collectors;
import java.util.UUID;
import java.util.List;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepo userRepo;
    private final RefrreshTokenRepo refrreshTokenRepo;
    
    @Override
   public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        return userRepo.findByEmail(email)
                .orElseThrow(() ->
                    new UsernameNotFoundException("User not found: " + email));
    }

    public UserResponse getMe(String email) {
        UserEntity user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.from(user);
    }

        public List<UserResponse> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
  public void deleteUser(UUID id) {
    UserEntity user = userRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    refrreshTokenRepo.revokeAllByUser(user);
    refrreshTokenRepo.deleteAllByUser(user);
    userRepo.deleteById(id);
}
}
