package com.campus.backend.controller;

import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.SubjectDto;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.services.AdminService;
import com.campus.backend.services.ImageUploadService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException; // Import IOException
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')") // Only accessible by ADMIN role
public class AdminController {

    private final AdminService adminService;
    private final ImageUploadService imageUploadService;

    public AdminController(AdminService adminService, ImageUploadService imageUploadService) {
        this.adminService = adminService;
        this.imageUploadService = imageUploadService;
    }

    // --- Global Exception Handler for Validation ---
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    // --- Exception Handler for Resource Not Found ---
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return error;
    }

    // --- Exception Handler for Illegal Arguments (e.g., duplicate username/email, invalid data) ---
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return error;
    }

    // --- Exception Handler for IO Exceptions during file upload/delete ---
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(IOException.class)
    public Map<String, String> handleIOException(IOException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "File operation failed: " + ex.getMessage());
        return error;
    }


    // --- Educator Management ---

    @PostMapping(value = "/educators", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createEducator(
            @RequestPart("educator") @Valid EducatorDto educatorDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = imageUploadService.uploadFile(profileImage); // Potential IOException
                educatorDto.setProfileImageUrl(imageUrl);
            }
            EducatorDto createdEducator = adminService.createEducator(educatorDto);
            return new ResponseEntity<>(createdEducator, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (IOException e) { // Catch IOException here
            return new ResponseEntity<>(Map.of("error", "Image upload failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/educators/{id}")
    public ResponseEntity<EducatorDto> getEducatorById(@PathVariable Long id) {
        EducatorDto educator = adminService.getEducatorById(id);
        return ResponseEntity.ok(educator);
    }

    @GetMapping("/educators")
    public ResponseEntity<Page<EducatorDto>> getAllEducators(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EducatorDto> educators = adminService.getAllEducators(page, size);
        return ResponseEntity.ok(educators);
    }

    @PutMapping(value = "/educators/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateEducator(
            @PathVariable Long id,
            @RequestPart("educator") @Valid EducatorDto educatorDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            EducatorDto existingEducator = null; // Declare outside try for scope if needed elsewhere

            if (profileImage != null && !profileImage.isEmpty()) {
                existingEducator = adminService.getEducatorById(id);
                if (existingEducator.getProfileImageUrl() != null && !existingEducator.getProfileImageUrl().isEmpty()) {
                    imageUploadService.deleteFile(existingEducator.getProfileImageUrl());
                }
                String imageUrl = imageUploadService.uploadFile(profileImage); // Potential IOException
                educatorDto.setProfileImageUrl(imageUrl);
            } else if (educatorDto.getProfileImageUrl() == null) {
                existingEducator = adminService.getEducatorById(id);
                if (existingEducator.getProfileImageUrl() != null && !existingEducator.getProfileImageUrl().isEmpty()) {
                    imageUploadService.deleteFile(existingEducator.getProfileImageUrl());
                }
                educatorDto.setProfileImageUrl(null);
            }

            EducatorDto updatedEducator = adminService.updateEducator(id, educatorDto);
            return ResponseEntity.ok(updatedEducator);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (IOException e) { // Catch IOException here
            return new ResponseEntity<>(Map.of("error", "Image upload/delete failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/educators/{id}")
    public ResponseEntity<Void> deleteEducator(@PathVariable Long id) {
        adminService.deleteEducator(id);
        return ResponseEntity.noContent().build();
    }

    // --- Student Management ---

    @PostMapping(value = "/students", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createStudent(
            @RequestPart("student") @Valid StudentDto studentDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String imageUrl = imageUploadService.uploadFile(profileImage); // Potential IOException
                studentDto.setProfileImageUrl(imageUrl);
            }
            StudentDto createdStudent = adminService.createStudent(studentDto);
            return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (IOException e) { // Catch IOException here
            return new ResponseEntity<>(Map.of("error", "Image upload failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        StudentDto student = adminService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/students")
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<StudentDto> students = adminService.getAllStudents(page, size);
        return ResponseEntity.ok(students);
    }

    @PutMapping(value = "/students/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestPart("student") @Valid StudentDto studentDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            StudentDto existingStudent = null; // Declare outside try for scope if needed elsewhere

            if (profileImage != null && !profileImage.isEmpty()) {
                existingStudent = adminService.getStudentById(id);
                if (existingStudent.getProfileImageUrl() != null && !existingStudent.getProfileImageUrl().isEmpty()) {
                    imageUploadService.deleteFile(existingStudent.getProfileImageUrl());
                }
                String imageUrl = imageUploadService.uploadFile(profileImage); // Potential IOException
                studentDto.setProfileImageUrl(imageUrl);
            } else if (studentDto.getProfileImageUrl() == null) {
                existingStudent = adminService.getStudentById(id);
                if (existingStudent.getProfileImageUrl() != null && !existingStudent.getProfileImageUrl().isEmpty()) {
                    imageUploadService.deleteFile(existingStudent.getProfileImageUrl());
                }
                studentDto.setProfileImageUrl(null);
            }

            StudentDto updatedStudent = adminService.updateStudent(id, studentDto);
            return ResponseEntity.ok(updatedStudent);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (IOException e) { // Catch IOException here
            return new ResponseEntity<>(Map.of("error", "Image upload/delete failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // --- Class Management ---

    @PostMapping("/classes")
    public ResponseEntity<?> createClass(@Valid @RequestBody ClassDto classDto) {
        try {
            ClassDto createdClass = adminService.createClass(classDto);
            return new ResponseEntity<>(createdClass, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/classes/{id}")
    public ResponseEntity<ClassDto> getClassById(@PathVariable Long id) {
        ClassDto classDto = adminService.getClassById(id);
        return ResponseEntity.ok(classDto);
    }

    @GetMapping("/classes")
    public ResponseEntity<Page<ClassDto>> getAllClasses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ClassDto> classes = adminService.getAllClasses(page, size);
        return ResponseEntity.ok(classes);
    }

    @PutMapping("/classes/{id}")
    public ResponseEntity<?> updateClass(@PathVariable Long id, @Valid @RequestBody ClassDto classDto) {
        try {
            ClassDto updatedClass = adminService.updateClass(id, classDto);
            return ResponseEntity.ok(updatedClass);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        adminService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }


    // --- Subject Management ---

    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@Valid @RequestBody SubjectDto subjectDto) {
        SubjectDto createdSubject = adminService.createSubject(subjectDto);
        return new ResponseEntity<>(createdSubject, HttpStatus.CREATED);
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<SubjectDto> getSubjectById(@PathVariable Long id) {
        SubjectDto subjectDto = adminService.getSubjectById(id);
        return ResponseEntity.ok(subjectDto);
    }

    @GetMapping("/subjects")
    public ResponseEntity<Page<SubjectDto>> getAllSubjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SubjectDto> subjects = adminService.getAllSubjects(page, size);
        return ResponseEntity.ok(subjects);
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectDto subjectDto) {
        SubjectDto updatedSubject = adminService.updateSubject(id, subjectDto);
        return ResponseEntity.ok(updatedSubject);
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        adminService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    // --- Dashboard Count Endpoints ---
    @GetMapping("/students/count")
    public ResponseEntity<Long> getStudentsCount() {
        long count = adminService.getStudentsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/educators/count")
    public ResponseEntity<Long> getEducatorsCount() {
        long count = adminService.getEducatorsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/subjects/count")
    public ResponseEntity<Long> getSubjectsCount() {
        long count = adminService.getSubjectsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/classes/count")
    public ResponseEntity<Long> getClassesCount() {
        long count = adminService.getClassesCount();
        return ResponseEntity.ok(count);
    }
}