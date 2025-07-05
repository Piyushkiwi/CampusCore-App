package com.campus.backend.repositories;

import com.campus.backend.entity.Educator;
import com.campus.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EducatorRepository extends JpaRepository<Educator, Long> {
    Optional<Educator> findByUser(User user);
    // You can add custom queries here if needed, e.g., findEducatorsByQualification
}
