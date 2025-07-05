package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.Period; // Import Period for age calculation
import java.util.HashSet;
import java.util.Set;
import java.util.UUID; // For generating unique roll numbers (if random)

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
@EqualsAndHashCode(exclude = {"user", "clazz", "feedback", "subjects"})
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber; // Main student mobile number

    // Address Details
    private String addressLine1; // Renamed from 'address'
    private String city;
    private String state; // Added state
    private String pincode; // Added pincode
    private String country; // Added country

    private String profileImageUrl;

    private LocalDate enrollmentDate;
    private String grade;

    // Parent Details
    private String fatherName; // Added father's name
    private String motherName; // Added mother's name
    private String fatherMobileNumber; // Added father's mobile number
    private String motherMobileNumber; // Added mother's mobile number
    private String localMobileNumber; // Added local mobile number for student

    // More Student Details
    private String studentHindiName; // Added student's name in Hindi
    private String religion; // Added religion
    private String nationality; // Added nationality
    private String category; // Added category (e.g., General, OBC, SC, ST)
    private Boolean physicalHandicapped; // Added physical handicapped status (boolean)

    @Column(unique = true, length = 5) // Roll number column, ensure uniqueness and length
    private String rollNumber; // Added roll number

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class clazz;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedback = new HashSet<>(); // Initialize to prevent NPE

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "student_subjects",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private Set<Subject> subjects = new HashSet<>();

    // Helper methods for Many-to-Many
    public void addSubject(Subject subject) {
        if (this.subjects == null) {
            this.subjects = new HashSet<>();
        }
        this.subjects.add(subject);
        if (subject.getStudents() == null) {
            subject.setStudents(new HashSet<>());
        }
        subject.getStudents().add(this);
    }

    public void removeSubject(Subject subject) {
        if (this.subjects != null) {
            this.subjects.remove(subject);
        }
        if (subject.getStudents() != null) {
            subject.getStudents().remove(this);
        }
    }

    // Lifecycle callback to generate roll number before persisting
    @PrePersist
    public void generateRollNumber() {
        if (this.rollNumber == null || this.rollNumber.isEmpty()) {
            this.rollNumber = generateRandomAlphaNumeric(5);
            // NOTE: In a real application, you might want to check for uniqueness
            // and regenerate if a conflict occurs, possibly in a service layer.
        }
    }

    // Helper method to generate a random alphanumeric string
    private String generateRandomAlphaNumeric(int length) {
        String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }
}