// Feedback.java - No changes needed here as it only has ManyToOne relationships,
// and the problem usually occurs with ManyToMany or OneToOne bidirectional where both sides
// try to resolve each other's hash codes.
package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "feedback", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"educator_id", "student_id", "class_id"})
})
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educator_id", nullable = false)
    private Educator educator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class clazz;

    @Lob
    @Column(nullable = false)
    private String feedbackText;

    private Integer rating;

    @CreationTimestamp
    @Column(name = "feedback_date", nullable = false, updatable = false)
    private LocalDateTime feedbackDate;
}