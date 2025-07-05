package com.campus.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class SubjectDto {
    private Long id;

    @NotBlank(message = "Subject name is required")
    @Size(max = 100, message = "Subject name cannot exceed 100 characters")
    private String subjectName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    // CRITICAL CHANGE: For the One-to-Many relationship with Educators
    // A subject can have many educators.
    private List<Long> educatorIds; // Changed from single educatorId to a list
    // You might also want to include educator names for display purposes, e.g.:
    // private List<EducatorInfo> educators; // If you create an inner DTO for educator info

    // For the ManyToMany relationship with Students
    private List<Long> studentIds;

    // If you want to nest educator info within SubjectDto for display
    @Data
    public static class EducatorInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email; // Optional
    }
    private List<EducatorInfo> educators; // Optional: for detailed display
}