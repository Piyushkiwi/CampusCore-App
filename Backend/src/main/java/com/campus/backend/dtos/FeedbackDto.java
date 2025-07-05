package com.campus.backend.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FeedbackDto {
    private Long id;
    private Long educatorId;
    private String educatorFirstName; // For display
    private String educatorLastName;  // For display
    private Long studentId;
    private String studentFirstName; // For display
    private String studentLastName;  // For display
    private Long classId;
    private String className;        // For display
    private String feedbackText;
    private Integer rating;
    private LocalDateTime feedbackDate;
}