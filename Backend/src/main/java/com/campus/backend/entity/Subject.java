package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "subjects")
@EqualsAndHashCode(exclude = {"educators", "students"}) // Exclude relationships to prevent circular dependency issues in equals/hashCode. Changed from 'educator' to 'educators'.
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String subjectName;

    private String description;

    // --- CRITICAL CHANGE: One-to-Many with Educator ---
    // A Subject can be taught by MANY Educators.
    // The 'mappedBy' side (Subject) means the foreign key is NOT in this table.
    // It is in the 'Educator' table, named 'subject_id'.
    // Use a Set to avoid duplicate educators and manage the collection.
    @OneToMany(mappedBy = "subject", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private Set<Educator> educators = new HashSet<>(); // Changed from 'educator' to 'educators'

    // Many-to-Many with Student (one student can select many subjects, one subject can be selected by many students)
    @ManyToMany(mappedBy = "subjects", fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();

    // Helper method to manage educators for this subject
    public void addEducator(Educator educator) {
        if (this.educators == null) {
            this.educators = new HashSet<>();
        }
        this.educators.add(educator);
        if (educator.getSubject() != this) {
            educator.setSubject(this); // Ensure inverse side is set
        }
    }

    public void removeEducator(Educator educator) {
        if (this.educators != null) {
            this.educators.remove(educator);
        }
        if (educator.getSubject() == this) {
            educator.setSubject(null); // Ensure inverse side is unset
        }
    }

    // Helper method for students (already exists, but including for completeness)
    public void addStudent(Student student) {
        if (this.students == null) {
            this.students = new HashSet<>();
        }
        this.students.add(student);
        if (student.getSubjects() == null) {
            student.setSubjects(new HashSet<>());
        }
        student.getSubjects().add(this);
    }

    public void removeStudent(Student student) {
        if (this.students != null) {
            this.students.remove(student);
        }
        if (student.getSubjects() != null) {
            student.getSubjects().remove(this);
        }
    }
}