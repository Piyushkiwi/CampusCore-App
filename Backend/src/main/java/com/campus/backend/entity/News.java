package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data // Lombok annotation for getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok annotation for no-args constructor
@AllArgsConstructor // Lombok annotation for all-args constructor
@Entity
@Table(name = "news") // Table name for your news entries
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255) // Title should not be too long
    private String title;

    @Lob // For larger text content, maps to TEXT in MySQL
    @Column(nullable = false)
    private String content;

    @Column(name = "publish_date", nullable = false)
    private LocalDateTime publishDate;

    @Column(nullable = false)
    private boolean published; // True if visible to public, false otherwise

    // Optional: If you want to track which admin published it
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "published_by_admin_id")
    // private User publishedBy; // Assuming your User entity represents admins too

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}