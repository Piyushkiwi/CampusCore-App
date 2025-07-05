package com.campus.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime publishDate;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // Optional: if you add `publishedBy` to News entity
    // private String publishedByUsername;
}