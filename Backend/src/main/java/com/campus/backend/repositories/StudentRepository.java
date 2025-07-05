package com.campus.backend.repositories;

import com.campus.backend.entity.Student;
import com.campus.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    // You can add custom queries here, e.g., findStudentsByGrade
}
