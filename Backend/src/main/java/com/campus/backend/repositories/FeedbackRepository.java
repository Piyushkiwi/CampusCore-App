package com.campus.backend.repositories;

import com.campus.backend.entity.Class;
import com.campus.backend.entity.Educator;
import com.campus.backend.entity.Feedback;
import com.campus.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByStudent(Student student);

    List<Feedback> findByEducator(Educator educator);

    Optional<Feedback> findByEducatorAndStudentAndClazz(Educator educator, Student student, Class clazz);

    List<Feedback> findByStudentAndClazz(Student student, Class clazz);
}

