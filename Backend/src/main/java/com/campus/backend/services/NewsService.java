package com.campus.backend.services;

import com.campus.backend.dtos.NewsRequest;
import com.campus.backend.dtos.NewsResponse;
import com.campus.backend.dtos.NewsTitleResponse;
import com.campus.backend.entity.News;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsRepository newsRepository;
    // If you implemented publishedBy in News entity, you might need a UserService here
    // private final UserService userService;

    @Autowired
    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    // --- Admin Operations ---

    public NewsResponse createNews(NewsRequest newsRequest) {
        News news = new News();
        news.setTitle(newsRequest.getTitle());
        news.setContent(newsRequest.getContent());
        news.setPublishDate(newsRequest.getPublishDate());
        news.setPublished(newsRequest.isPublished());
        // Optional: If you track who published it
        // news.setPublishedBy(userService.getCurrentAuthenticatedUser()); // Implement this method in UserService

        News savedNews = newsRepository.save(news);
        return mapToNewsResponse(savedNews);
    }

    public NewsResponse updateNews(Long id, NewsRequest newsRequest) {
        News existingNews = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with ID: " + id));

        existingNews.setTitle(newsRequest.getTitle());
        existingNews.setContent(newsRequest.getContent());
        existingNews.setPublishDate(newsRequest.getPublishDate());
        existingNews.setPublished(newsRequest.isPublished());

        News updatedNews = newsRepository.save(existingNews);
        return mapToNewsResponse(updatedNews);
    }

    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News not found with ID: " + id);
        }
        newsRepository.deleteById(id);
    }

    public NewsResponse getNewsByIdForAdmin(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News not found with ID: " + id));
        return mapToNewsResponse(news);
    }

    public Page<NewsResponse> getAllNewsForAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return newsRepository.findAll(pageable)
                .map(this::mapToNewsResponse);
    }

    public long getPublishedNewsCount() {
        return newsRepository.countByPublishedTrue();
    }

    // --- Public Operations ---

    public List<NewsTitleResponse> getPublishedNewsTitles() {
        // Fetches only published news, ordered by publish date (most recent first)
        return newsRepository.findByPublishedTrueOrderByPublishDateDesc().stream()
                .map(news -> new NewsTitleResponse(news.getId(), news.getTitle(), news.getPublishDate()))
                .collect(Collectors.toList());
    }

    public NewsResponse getPublishedNewsDetail(Long id) {
        return newsRepository.findById(id)
                .filter(News::isPublished) // Crucial: only return if published
                .map(this::mapToNewsResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Published news not found with ID: " + id));
    }

    // --- Helper Method for mapping Entity to Response DTO ---
    private NewsResponse mapToNewsResponse(News news) {
        NewsResponse response = new NewsResponse();
        response.setId(news.getId());
        response.setTitle(news.getTitle());
        response.setContent(news.getContent());
        response.setPublishDate(news.getPublishDate());
        response.setPublished(news.isPublished());
        response.setCreatedAt(news.getCreatedAt());
        response.setUpdatedAt(news.getUpdatedAt());
        // Optional: If you track who published it
        // if (news.getPublishedBy() != null) {
        //     response.setPublishedByUsername(news.getPublishedBy().getUsername());
        // }
        return response;
    }
}