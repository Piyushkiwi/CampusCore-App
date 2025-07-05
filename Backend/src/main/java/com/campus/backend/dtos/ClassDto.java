package com.campus.backend.dtos;

import lombok.Data;

import java.util.List;

@Data
public class ClassDto {
    private Long id;
    private String className;
    private String classCode;
    private String description;

    private List<EducatorInfo> educators; // New field for educators
    private List<StudentInfo> students;   // New field for students

    @Data
    public static class EducatorInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email; // Include email if useful
    }

    @Data
    public static class StudentInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String email; // Include email if useful
    }
}
