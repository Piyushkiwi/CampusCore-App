package com.campus.backend.services;

import com.campus.backend.dtos.FeedbackDto;
import com.campus.backend.entity.*;
import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.entity.Class;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class EducatorService {

    private final EducatorRepository educatorRepository;
    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public EducatorService(EducatorRepository educatorRepository, ClassRepository classRepository,
                           StudentRepository studentRepository, FeedbackRepository feedbackRepository,
                           UserRepository userRepository) {
        this.educatorRepository = educatorRepository;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

// Assuming this is part of an EducatorService class

    public EducatorDto getEducatorProfile(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Educator educator = educatorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));
        return convertToEducatorDto(educator);
    }

    public List<ClassDto> getClassesTaughtByEducator(UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Educator educator = educatorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        return educator.getClasses().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
    }

    public Page<StudentDto> getStudentsInClass(Long classId, int page, int size) {
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        List<StudentDto> studentDtos = clazz.getStudents().stream()
                .map(this::convertToStudentDto)
                .sorted(Comparator.comparing(StudentDto::getLastName)) // Optional: sort for consistent output
                .collect(Collectors.toList());

        int start = Math.min(page * size, studentDtos.size());
        int end = Math.min((start + size), studentDtos.size());
        List<StudentDto> paginatedStudents = studentDtos.subList(start, end);

        return new PageImpl<>(paginatedStudents, PageRequest.of(page, size), studentDtos.size());
    }


    public StudentDto getStudentDetailForEducator(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return convertToStudentDto(student);
    }

    @Transactional
    public FeedbackDto createOrUpdateFeedback(Long studentId, Long classId, FeedbackDto feedbackDto, UserDetails userDetails) {
        User educatorUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Educator user not found"));
        Educator educator = educatorRepository.findByUser(educatorUser)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // Check if the educator actually teaches this class using the ManyToMany relationship
        boolean educatorTeachesClass = clazz.getEducators().stream()
                .anyMatch(e -> e.getId().equals(educator.getId()));
        if (!educatorTeachesClass) {
            throw new IllegalArgumentException("Educator does not teach this class.");
        }

        if (student.getClazz() == null || !student.getClazz().getId().equals(clazz.getId())) {
            throw new IllegalArgumentException("Student is not enrolled in this class.");
        }
        // --- END MODIFIED ---

        Optional<Feedback> existingFeedback = feedbackRepository.findByEducatorAndStudentAndClazz(educator, student, clazz);
        Feedback feedback;

        if (existingFeedback.isPresent()) {
            feedback = existingFeedback.get();
            feedback.setFeedbackText(feedbackDto.getFeedbackText());
            feedback.setRating(feedbackDto.getRating());
        } else {
            feedback = new Feedback();
            feedback.setEducator(educator);
            feedback.setStudent(student);
            feedback.setClazz(clazz);
            feedback.setFeedbackText(feedbackDto.getFeedbackText());
            feedback.setRating(feedbackDto.getRating());
        }

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToFeedbackDto(savedFeedback);
    }

    public List<FeedbackDto> getFeedbackForStudentByEducatorAndClass(Long studentId, Long classId, UserDetails userDetails) {
        User educatorUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Educator user not found"));
        Educator educator = educatorRepository.findByUser(educatorUser)
                .orElseThrow(() -> new ResourceNotFoundException("Educator profile not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));

        // Ensure the educator teaches the class
        boolean educatorTeachesClass = clazz.getEducators().stream()
                .anyMatch(e -> e.getId().equals(educator.getId()));
        if (!educatorTeachesClass) {
            throw new IllegalArgumentException("Educator does not teach this class.");
        }

        // --- MODIFIED: Check if the student is actually in this class (ManyToOne relationship) ---
        if (student.getClazz() == null || !student.getClazz().getId().equals(clazz.getId())) {
            throw new IllegalArgumentException("Student is not enrolled in this class.");
        }
        // --- END MODIFIED ---

        return feedbackRepository.findByEducatorAndStudentAndClazz(educator, student, clazz)
                .map(List::of)
                .orElse(List.of())
                .stream()
                .map(this::convertToFeedbackDto)
                .collect(Collectors.toList());
    }

    // --- Helper methods to convert Entity to DTO ---
    private EducatorDto convertToEducatorDto(Educator educator) {
        EducatorDto dto = new EducatorDto();
        dto.setId(educator.getId());
        dto.setUsername(educator.getUser().getUsername());
        dto.setEmail(educator.getUser().getEmail());
        dto.setFirstName(educator.getFirstName());
        dto.setLastName(educator.getLastName());
        dto.setEducatorHindiName(educator.getEducatorHindiName()); // New Field
        dto.setDateOfBirth(educator.getDateOfBirth());
        dto.setGender(educator.getGender());
        dto.setPhoneNumber(educator.getPhoneNumber());
        dto.setAlternatePhoneNumber(educator.getAlternatePhoneNumber()); // New Field

        // New Address Fields
        dto.setAddressLine1(educator.getAddressLine1());
        dto.setAddressLine2(educator.getAddressLine2());
        dto.setCity(educator.getCity());
        dto.setState(educator.getState());
        dto.setPincode(educator.getPincode());
        dto.setCountry(educator.getCountry());

        dto.setNationality(educator.getNationality()); // New Field

        dto.setProfileImageUrl(educator.getProfileImageUrl());
        dto.setHireDate(educator.getHireDate());
        dto.setQualification(educator.getQualification());
        dto.setExperienceYears(educator.getExperienceYears());
        dto.setDesignation(educator.getDesignation()); // New Field
        dto.setAadharNumber(educator.getAadharNumber()); // New Field
        dto.setAccountNumber(educator.getAccountNumber()); // New Field

        dto.setRole(educator.getUser().getRole());
        // Populate classIds for the EducatorDto (Many-to-Many is still valid for educators)
        dto.setClassIds(educator.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));

        // --- Populate subjectId and subjectName for EducatorDto ---
        if (educator.getSubject() != null) {
            dto.setSubjectId(educator.getSubject().getId());
            dto.setSubjectName(educator.getSubject().getSubjectName());
        }
        // --- END FIX ---
        return dto;
    }

    private ClassDto convertToClassDto(Class clazz) {
        ClassDto dto = new ClassDto();
        dto.setId(clazz.getId());
        dto.setClassName(clazz.getClassName());
        dto.setClassCode(clazz.getClassCode());
        dto.setDescription(clazz.getDescription());

        // Populate educators in ClassDto
        if (clazz.getEducators() != null && !clazz.getEducators().isEmpty()) {
            dto.setEducators(clazz.getEducators().stream()
                    .sorted(Comparator.comparing(Educator::getLastName)) // Sort by last name
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
                    .collect(Collectors.toList()));
        } else {
            dto.setEducators(Collections.emptyList());
        }

        // --- NEW: Populate students in ClassDto ---
        if (clazz.getStudents() != null && !clazz.getStudents().isEmpty()) {
            dto.setStudents(clazz.getStudents().stream()
                    .sorted(Comparator.comparing(Student::getLastName)) // Sort by last name
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
                    .collect(Collectors.toList()));
        } else {
            dto.setStudents(Collections.emptyList());
        }
        // --- END NEW ---

        return dto;
    }

    private StudentDto convertToStudentDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        // User details
        if (student.getUser() != null) { // Defensive check, though User is not-nullable
            dto.setUsername(student.getUser().getUsername());
            dto.setEmail(student.getUser().getEmail());
            dto.setRole(student.getUser().getRole());
        }

        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setPhoneNumber(student.getPhoneNumber());

        // --- FIX START: Map all granular address fields ---
        dto.setAddressLine1(student.getAddressLine1());
        dto.setCity(student.getCity());
        dto.setState(student.getState());
        dto.setPincode(student.getPincode());
        dto.setCountry(student.getCountry());
        // --- FIX END ---

        dto.setProfileImageUrl(student.getProfileImageUrl());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        dto.setGrade(student.getGrade());
        dto.setRollNumber(student.getRollNumber()); // Added from previous StudentDto conversion

        // --- FIX START: Map Parent Details ---
        dto.setFatherName(student.getFatherName());
        dto.setMotherName(student.getMotherName());
        dto.setFatherMobileNumber(student.getFatherMobileNumber());
        dto.setMotherMobileNumber(student.getMotherMobileNumber());
        dto.setLocalMobileNumber(student.getLocalMobileNumber());
        // --- FIX END ---

        // --- FIX START: Map More Student Details ---
        dto.setStudentHindiName(student.getStudentHindiName());
        dto.setReligion(student.getReligion());
        dto.setNationality(student.getNationality());
        dto.setCategory(student.getCategory());
        dto.setPhysicalHandicapped(student.getPhysicalHandicapped());
        // --- FIX END ---


        dto.setClassId(student.getClazz() != null ? student.getClazz().getId() : null);
        dto.setSubjectIds(student.getSubjects().stream()
                .map(Subject::getId)
                .collect(Collectors.toList()));
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
}