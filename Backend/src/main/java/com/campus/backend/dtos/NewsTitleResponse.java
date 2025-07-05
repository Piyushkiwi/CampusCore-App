package com.campus.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsTitleResponse {
    private Long id;
    private String title;
    private LocalDateTime publishDate; // Useful for displaying when it was published
}