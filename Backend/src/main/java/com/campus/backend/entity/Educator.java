package com.campus.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "educators")
@EqualsAndHashCode(exclude = {"user", "classes", "subject"}) // EXCLUDE user, classes, AND THE NEW 'subject'
public class Educator {
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

    private String educatorHindiName; // New: Name in Hindi

    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String alternatePhoneNumber; // New: Alternate Phone Number

    // New: Detailed Address Fields
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;

    private String nationality; // New: Nationality

    private String profileImageUrl; // Path or URL to the image

    private LocalDate hireDate;
    private String qualification;
    private Integer experienceYears;
    private String designation; // New: Designation (e.g., Teacher, HOD, Principal)

    private String aadharNumber; // New: Aadhar Number
    private String accountNumber; // New: Account Number

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "educator_classes",
            joinColumns = @JoinColumn(name = "educator_id"),
            inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    private Set<Class> classes = new HashSet<>();

    // --- CRITICAL CHANGE: Many-to-One relationship with Subject ---
    // An Educator teaches only ONE Subject, but a Subject can have MANY Educators.
    // The foreign key (subject_id) will be in the 'educators' table.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", referencedColumnName = "id") // Foreign key in educators table
    private Subject subject;

    // Helper methods are fine
    public void addClass(Class clazz) {
        if (this.classes == null) {
            this.classes = new HashSet<>();
        }
        this.classes.add(clazz);
        if (clazz.getEducators() == null) {
            clazz.setEducators(new HashSet<>());
        }
        clazz.getEducators().add(this);
    }

    public void removeClass(Class clazz) {
        if (this.classes != null) {
            this.classes.remove(clazz);
        }
        if (clazz.getEducators() != null) {
            clazz.getEducators().remove(this);
        }
    }
}