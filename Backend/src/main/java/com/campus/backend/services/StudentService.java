package com.campus.backend.services;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.dtos.SubjectDto;
import com.campus.backend.entity.Feedback;
import com.campus.backend.entity.Student;
import com.campus.backend.entity.User;
import com.campus.backend.entity.Class; // Ensure this is imported correctly
import com.campus.backend.entity.Subject; // Import Subject
import com.campus.backend.entity.Educator; // Import Educator for SubjectDto.EducatorInfo
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final SubjectRepository subjectRepository;
    private final ClassRepository classRepository;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository,
                          FeedbackRepository feedbackRepository, SubjectRepository subjectRepository, ClassRepository classRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.feedbackRepository = feedbackRepository;
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
    }

    public StudentDto getStudentProfile(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return convertToStudentDto(student);
    }

    public Optional<ClassDto> getEnrolledClass(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (student.getClazz() != null) {
            return Optional.of(convertToClassDto(student.getClazz()));
        }
        return Optional.empty();
    }

    public List<FeedbackDto> getFeedbackForStudent(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        List<Feedback> feedbacks = feedbackRepository.findByStudent(student);
        return feedbacks.stream()
                .map(this::convertToFeedbackDto)
                .collect(Collectors.toList());
    }

    public List<SubjectDto> getEnrolledSubjects(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return student.getSubjects().stream()
                .map(this::convertToSubjectDto)
                .collect(Collectors.toList());
    }


    // --- Helper methods to convert Entity to DTO ---
    private StudentDto convertToStudentDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        // User details
        if (student.getUser() != null) {
            dto.setUsername(student.getUser().getUsername());
            dto.setEmail(student.getUser().getEmail());
            dto.setRole(student.getUser().getRole());
        }

        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setPhoneNumber(student.getPhoneNumber());

        // --- UPDATED: Address Fields ---
        // Removed: dto.setAddress(student.getAddress());
        dto.setAddressLine1(student.getAddressLine1());
        dto.setCity(student.getCity());
        dto.setState(student.getState());
        dto.setPincode(student.getPincode());
        dto.setCountry(student.getCountry());

        dto.setProfileImageUrl(student.getProfileImageUrl());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        dto.setGrade(student.getGrade());
        dto.setRollNumber(student.getRollNumber()); // Add Roll Number

        // --- NEW: Parent Details ---
        dto.setFatherName(student.getFatherName());
        dto.setMotherName(student.getMotherName());
        dto.setFatherMobileNumber(student.getFatherMobileNumber());
        dto.setMotherMobileNumber(student.getMotherMobileNumber());
        dto.setLocalMobileNumber(student.getLocalMobileNumber());

        // --- NEW: More Student Details ---
        dto.setStudentHindiName(student.getStudentHindiName());
        dto.setReligion(student.getReligion());
        dto.setNationality(student.getNationality());
        dto.setCategory(student.getCategory());
        dto.setPhysicalHandicapped(student.getPhysicalHandicapped());


        dto.setClassId(student.getClazz() != null ? student.getClazz().getId() : null);
        dto.setSubjectIds(student.getSubjects().stream()
                .map(Subject::getId)
                .collect(Collectors.toList()));
        return dto;
    }

    private ClassDto convertToClassDto(Class clazz) {
        ClassDto dto = new ClassDto();
        dto.setId(clazz.getId());
        dto.setClassName(clazz.getClassName());
        dto.setClassCode(clazz.getClassCode());
        dto.setDescription(clazz.getDescription());
        if (clazz.getEducators() != null && !clazz.getEducators().isEmpty()) {
            dto.setEducators(clazz.getEducators().stream()
                    .map(educator -> {
                        ClassDto.EducatorInfo educatorInfo = new ClassDto.EducatorInfo();
                        educatorInfo.setId(educator.getId());
                        educatorInfo.setFirstName(educator.getFirstName());
                        educatorInfo.setLastName(educator.getLastName());
                        if (educator.getUser() != null) {
                            educatorInfo.setEmail(educator.getUser().getEmail());
                        }
                        return educatorInfo;
                    })
                    .sorted(Comparator.comparing(ClassDto.EducatorInfo::getLastName))
                    .collect(Collectors.toList()));
        } else {
            dto.setEducators(Collections.emptyList());
        }

        if (clazz.getStudents() != null && !clazz.getStudents().isEmpty()) {
            dto.setStudents(clazz.getStudents().stream()
                    .map(student -> {
                        ClassDto.StudentInfo studentInfo = new ClassDto.StudentInfo();
                        studentInfo.setId(student.getId());
                        studentInfo.setFirstName(student.getFirstName());
                        studentInfo.setLastName(student.getLastName());
                        if (student.getUser() != null) {
                            studentInfo.setEmail(student.getUser().getEmail());
                        }
                        return studentInfo;
                    })
                    .sorted(Comparator.comparing(ClassDto.StudentInfo::getLastName))
                    .collect(Collectors.toList()));
        } else {
            dto.setStudents(Collections.emptyList());
        }
        return dto;
    }

    private FeedbackDto convertToFeedbackDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setEducatorId(feedback.getEducator().getId());
        dto.setEducatorFirstName(feedback.getEducator().getFirstName());
        dto.setEducatorLastName(feedback.getEducator().getLastName());
        dto.setStudentId(feedback.getStudent().getId());
        dto.setStudentFirstName(feedback.getStudent().getFirstName());
        dto.setStudentLastName(feedback.getStudent().getLastName());
        dto.setClassId(feedback.getClazz().getId());
        dto.setClassName(feedback.getClazz().getClassName());
        dto.setFeedbackText(feedback.getFeedbackText());
        dto.setRating(feedback.getRating());
        dto.setFeedbackDate(feedback.getFeedbackDate());
        return dto;
    }

    // --- NEW: Helper method to convert Subject entity to SubjectDto ---
    private SubjectDto convertToSubjectDto(Subject subject) {
        SubjectDto dto = new SubjectDto();
        dto.setId(subject.getId());
        dto.setSubjectName(subject.getSubjectName());
        dto.setDescription(subject.getDescription());
        // Populate educatorIds for SubjectDto
        dto.setEducatorIds(subject.getEducators().stream()
                .map(Educator::getId)
                .collect(Collectors.toList()));

        // Optionally, populate detailed educator info if needed in the DTO response
        dto.setEducators(subject.getEducators().stream()
                .map(educator -> {
                    SubjectDto.EducatorInfo info = new SubjectDto.EducatorInfo();
                    info.setId(educator.getId());
                    info.setFirstName(educator.getFirstName());
                    info.setLastName(educator.getLastName());
                    if (educator.getUser() != null) {
                        info.setEmail(educator.getUser().getEmail());
                    }
                    return info;
                })
                .sorted(Comparator.comparing(SubjectDto.EducatorInfo::getLastName))
                .collect(Collectors.toList()));

        dto.setStudentIds(subject.getStudents().stream()
                .map(Student::getId)
                .collect(Collectors.toList()));
        return dto;
    }

    // --- New methods for Student/Educator accessible lists ---
    public List<ClassDto> getAllClassesForStudent() {
        return classRepository.findAll().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
    }

    public List<SubjectDto> getAllSubjectsForStudent() {
        return subjectRepository.findAll().stream()
                .map(this::convertToSubjectDto)
                .collect(Collectors.toList());
    }
}