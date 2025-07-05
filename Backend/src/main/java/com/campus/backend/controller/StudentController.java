package com.campus.backend.controller;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.dtos.SubjectDto;
import com.campus.backend.services.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional; // Import Optional

@RestController
@RequestMapping("/api/student") // Base path for student-related endpoints
@PreAuthorize("hasRole('ROLE_STUDENT')") // Only accessible by STUDENT role
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        StudentDto profile = studentService.getStudentProfile(userDetails);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/enrolled-class")
    public ResponseEntity<ClassDto> getMyEnrolledClass(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<ClassDto> classDto = studentService.getEnrolledClass(userDetails);
        return classDto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackDto>> getMyFeedback(@AuthenticationPrincipal UserDetails userDetails) {
        List<FeedbackDto> feedback = studentService.getFeedbackForStudent(userDetails);
        return ResponseEntity.ok(feedback);
    }

    // Corrected endpoint paths: removed redundant "/student"
    @GetMapping("/subjects/all") // Corrected path to resolve to /api/student/subjects/all
    public ResponseEntity<List<SubjectDto>> getAllSubjectsForStudent() {
        List<SubjectDto> subjects = studentService.getAllSubjectsForStudent();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/classes/all") // Corrected path to resolve to /api/student/classes/all
    public ResponseEntity<List<ClassDto>> getAllClassesForStudent() {
        List<ClassDto> classes = studentService.getAllClassesForStudent();
        return ResponseEntity.ok(classes);
    }
}
