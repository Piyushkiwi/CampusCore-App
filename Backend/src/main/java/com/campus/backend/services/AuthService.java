package com.campus.backend.services;

import com.campus.backend.dtos.AuthRequest;
import com.campus.backend.dtos.AuthResponse;
import com.campus.backend.dtos.UserDto;
import com.campus.backend.entity.PasswordResetToken;
import com.campus.backend.entity.User;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.PasswordResetTokenRepository;
import com.campus.backend.repositories.UserRepository;
import com.campus.backend.security.jwt.JwtHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtHelper jwtHelper;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService; // Inject EmailService
    private final PasswordResetTokenRepository passwordResetTokenRepository; // Inject token repository

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtHelper jwtHelper,
                       UserDetailsService userDetailsService, EmailService emailService,
                       PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtHelper = jwtHelper;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService; // Initialize
        this.passwordResetTokenRepository = passwordResetTokenRepository; // Initialize
    }

    @Transactional
    public UserDto registerUser(UserDto userDto, Role role) {
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        userDto.setId(savedUser.getId());
        userDto.setRole(savedUser.getRole());
        userDto.setPassword(null); // Clear password for DTO response
        return userDto;
    }

    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        String token = jwtHelper.generateToken(userDetails);

        User user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    // --- Forgot Password Methods ---
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(resetToken);

        // TODO: Replace with your actual frontend URL
        String resetLink = "http://localhost:5173/reset-password?token=" + token; // Example frontend URL

        String subject = "Password Reset Request";
        String body = "Dear " + user.getUsername() + ",\n\n" +
                      "You have requested to reset your password. Please click on the following link to reset it:\n" +
                      resetLink + "\n\n" +
                      "This link will expire in 24 hours. If you did not request this, please ignore this email.\n\n" +
                      "Regards,\nYour Campus Team";
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token."));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken); // Clean up expired token
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken); // Invalidate the token after use
    }
}