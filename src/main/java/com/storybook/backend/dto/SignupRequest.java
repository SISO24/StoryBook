package com.storybook.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record  SignupRequest(
     @NotBlank(message = "Email is required")
     @Email(message="Invalid Email format")
     String email,
     @NotBlank(message="Password is required")
     @Size(min=6 , message= "Password must be atleas 6 characters")
     String password

){}