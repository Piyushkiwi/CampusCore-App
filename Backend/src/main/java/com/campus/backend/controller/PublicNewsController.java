package com.campus.backend.controller;

import com.campus.backend.dtos.NewsResponse;
import com.campus.backend.dtos.NewsTitleResponse;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.services.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/news") // Publicly accessible path for news
public class PublicNewsController {

    private final NewsService newsService;

    @Autowired
    public PublicNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // --- Exception Handler for Resource Not Found (specific to public view) ---
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return error;
    }

    // --- Public News Endpoints ---

    @GetMapping("/titles")
    public ResponseEntity<List<NewsTitleResponse>> getPublishedNewsTitles() {
        List<NewsTitleResponse> titles = newsService.getPublishedNewsTitles();
        return ResponseEntity.ok(titles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponse> getPublishedNewsDetail(@PathVariable Long id) {
        NewsResponse news = newsService.getPublishedNewsDetail(id);
        return ResponseEntity.ok(news); // Service will throw ResourceNotFoundException if not found or not published
    }
}