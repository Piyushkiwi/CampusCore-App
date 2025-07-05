package com.campus.backend.repositories;

import com.campus.backend.entity.PasswordResetToken;
import com.campus.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user); // For cleanup if a new token is requested
}
