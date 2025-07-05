package com.campus.backend.repositories;

import com.campus.backend.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    // Custom query to find all published news, ordered by publish date (most recent first)
    List<News> findByPublishedTrueOrderByPublishDateDesc();

    long countByPublishedTrue();
    // You might add more methods here, e.g., for searching news by title or content
    // List<News> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);
}