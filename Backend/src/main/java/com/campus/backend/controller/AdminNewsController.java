package com.campus.backend.controller;

import com.campus.backend.dtos.NewsRequest;
import com.campus.backend.dtos.NewsResponse;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.services.NewsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/news") // Specific path for admin news management
@PreAuthorize("hasRole('ROLE_ADMIN')") // Ensure only admins can access these endpoints
public class AdminNewsController {

    private final NewsService newsService;

    @Autowired
    public AdminNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    // --- Exception Handlers (can be moved to a global @ControllerAdvice if preferred) ---
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return error;
    }

    // --- News Management Endpoints ---

    @PostMapping
    public ResponseEntity<NewsResponse> createNews(@Valid @RequestBody NewsRequest newsRequest) {
        NewsResponse createdNews = newsService.createNews(newsRequest);
        return new ResponseEntity<>(createdNews, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsResponse> updateNews(@PathVariable Long id, @Valid @RequestBody NewsRequest newsRequest) {
        NewsResponse updatedNews = newsService.updateNews(id, newsRequest);
        return ResponseEntity.ok(updatedNews); // Service will throw ResourceNotFoundException if ID not found
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsResponse> getNewsById(@PathVariable Long id) {
        NewsResponse news = newsService.getNewsByIdForAdmin(id);
        return ResponseEntity.ok(news);
    }

    @GetMapping
    public ResponseEntity<Page<NewsResponse>> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NewsResponse> newsPage = newsService.getAllNewsForAdmin(page, size);
        return ResponseEntity.ok(newsPage);
    }

    @GetMapping("/published/count") // This path will be /api/admin/news/published/count
    public ResponseEntity<Long> getPublishedNewsCount() {
        long count = newsService.getPublishedNewsCount();
        return ResponseEntity.ok(count);
    }
}