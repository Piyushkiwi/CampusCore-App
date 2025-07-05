package com.campus.backend.controller;

import com.campus.backend.dtos.AuthRequest;
import com.campus.backend.dtos.AuthResponse;
import com.campus.backend.dtos.ForgotPasswordRequest;
import com.campus.backend.dtos.UserDto;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*") // Allow all origins for CORS; adjust as needed for security
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserDto> registerAdmin(@Valid @RequestBody UserDto userDto) {
        UserDto registeredUser = authService.registerUser(userDto, Role.ROLE_ADMIN);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    // New Endpoints for Forgot Password
    @PostMapping("/forgot-password/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody ForgotPasswordRequest request) { // <--- CHANGE HERE
        authService.requestPasswordReset(request.getEmail()); // <--- EXTRACT EMAIL FROM DTO
        return new ResponseEntity<>("Password reset link sent to your email if it exists.", HttpStatus.OK);
    }

    // DTO for new password (optional, could use a map or direct String for simplicity)
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;

        // Getters and Setters
        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return new ResponseEntity<>("Your password has been reset successfully.", HttpStatus.OK);
    }

    // Educators and Students will be created by Admin through AdminController, not via direct registration
    // This design choice is based on the prompt "Admin can: Create login credentials for all users"
}