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
@Table(name = "classes")
@EqualsAndHashCode(exclude = {"students", "educators"}) // EXCLUDE bidirectional collections
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String className;

    @Column(nullable = false, unique = true)
    private String classCode;

    @Lob
    private String description;

    // --- CHANGE STARTS HERE ---
    // Change from ManyToMany(mappedBy="classes") to OneToMany for students
    @OneToMany(mappedBy = "clazz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Student> students = new HashSet<>();
    // --- CHANGE ENDS HERE ---

    @ManyToMany(mappedBy = "classes", fetch = FetchType.LAZY)
    private Set<Educator> educators = new HashSet<>();

    // --- HELPER METHODS FOR BIDIRECTIONAL MANAGEMENT ---
    // Adjust addStudent/removeStudent to reflect OneToMany
    public void addStudent(Student student) {
        if (this.students == null) {
            this.students = new HashSet<>();
        }
        this.students.add(student);
        student.setClazz(this); // Set the class on the student side
    }

    public void removeStudent(Student student) {
        if (this.students != null) {
            this.students.remove(student);
        }
        if (student.getClazz() != null && student.getClazz().equals(this)) {
            student.setClazz(null); // Remove the class reference from the student side
        }
    }

    public void addEducator(Educator educator) {
        if (this.educators == null) {
            this.educators = new HashSet<>();
        }
        this.educators.add(educator);
        if (educator.getClasses() == null) {
            educator.setClasses(new HashSet<>());
        }
        educator.getClasses().add(this);
    }

    public void removeEducator(Educator educator) {
        if (this.educators != null) {
            this.educators.remove(educator);
        }
        if (educator.getClasses() != null) {
            educator.getClasses().remove(this);
        }
    }
}