package com.storybook.backend.controller;

import com.storybook.backend.dto.AuthResponse;
import com.storybook.backend.dto.LoginRequest;
import com.storybook.backend.dto.SignupRequest;
import com.storybook.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
            authService.refresh(body.get("refreshToken"))
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestBody Map<String, String> body) {
        authService.logout(body.get("refreshToken"));
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        // Intercept your explicit message string matching line 82
        if (ex.getMessage() != null && ex.getMessage().contains("Refresh token expired or revoked")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) // Return a clean 401 status code!
                    .body(Map.of(
                        "error", "Unauthorized",
                        "message", "Your session has fully expired. Please log in again."
                    ));
        }
        
        // Let any other generic system runtime errors default back to a standard 500 error boundary pass
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal Server Error", "message", ex.getMessage()));
    }

}