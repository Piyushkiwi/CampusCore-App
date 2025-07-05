package com.campus.backend.controller;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.services.EducatorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/educator")
@PreAuthorize("hasRole('ROLE_EDUCATOR')") // Only accessible by EDUCATOR role
public class EducatorController {

    private final EducatorService educatorService;

    public EducatorController(EducatorService educatorService) {
        this.educatorService = educatorService;
    }

    @GetMapping("/profile")
    public ResponseEntity<EducatorDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        EducatorDto profile = educatorService.getEducatorProfile(userDetails);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/classes")
    public ResponseEntity<List<ClassDto>> getMyClasses(@AuthenticationPrincipal UserDetails userDetails) {
        List<ClassDto> classes = educatorService.getClassesTaughtByEducator(userDetails);
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/classes/{classId}/students")
    public ResponseEntity<Page<StudentDto>> getStudentsInClass(
            @PathVariable Long classId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<StudentDto> students = educatorService.getStudentsInClass(classId, page, size);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentDto> getStudentDetail(@PathVariable Long studentId) {
        StudentDto student = educatorService.getStudentDetailForEducator(studentId);
        return ResponseEntity.ok(student);
    }

    @PostMapping("/students/{studentId}/classes/{classId}/feedback")
    public ResponseEntity<FeedbackDto> createOrUpdateFeedback(
            @PathVariable Long studentId,
            @PathVariable Long classId,
            @Valid @RequestBody FeedbackDto feedbackDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        FeedbackDto savedFeedback = educatorService.createOrUpdateFeedback(studentId, classId, feedbackDto, userDetails);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    @GetMapping("/students/{studentId}/classes/{classId}/feedback")
    public ResponseEntity<List<FeedbackDto>> getFeedbackForStudentByEducatorAndClass(
            @PathVariable Long studentId,
            @PathVariable Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<FeedbackDto> feedback = educatorService.getFeedbackForStudentByEducatorAndClass(studentId, classId, userDetails);
        return ResponseEntity.ok(feedback);
    }
}