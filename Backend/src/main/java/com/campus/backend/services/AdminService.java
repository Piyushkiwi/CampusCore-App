package com.campus.backend.services;

import com.campus.backend.dtos.ClassDto;
import com.campus.backend.dtos.EducatorDto;
import com.campus.backend.dtos.StudentDto;
import com.campus.backend.dtos.SubjectDto; // Import SubjectDto
import com.campus.backend.entity.Class;
import com.campus.backend.entity.Educator;
import com.campus.backend.entity.Student;
import com.campus.backend.entity.Subject; // Import Subject
import com.campus.backend.entity.User;
import com.campus.backend.entity.enums.Role;
import com.campus.backend.exceptions.ResourceNotFoundException;
import com.campus.backend.repositories.ClassRepository;
import com.campus.backend.repositories.EducatorRepository;
import com.campus.backend.repositories.StudentRepository;
import com.campus.backend.repositories.SubjectRepository; // Import SubjectRepository
import com.campus.backend.repositories.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EducatorRepository educatorRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageUploadService imageUploadService;
    private final ClassRepository classRepository;

    public AdminService(UserRepository userRepository, EducatorRepository educatorRepository,
                        StudentRepository studentRepository, SubjectRepository subjectRepository,
                        PasswordEncoder passwordEncoder, ImageUploadService imageUploadService,
                        ClassRepository classRepository) {
        this.userRepository = userRepository;
        this.educatorRepository = educatorRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
        this.imageUploadService = imageUploadService;
        this.classRepository = classRepository;
    }

    // --- Educator Management ---

    @Transactional
    public EducatorDto createEducator(EducatorDto educatorDto) {
        if (userRepository.existsByUsername(educatorDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(educatorDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(educatorDto.getUsername());
        user.setEmail(educatorDto.getEmail());
        user.setPassword(passwordEncoder.encode(educatorDto.getPassword()));
        user.setRole(Role.ROLE_EDUCATOR);
        User savedUser = userRepository.save(user);

        Educator educator = new Educator();
        educator.setUser(savedUser);
        educator.setFirstName(educatorDto.getFirstName());
        educator.setLastName(educatorDto.getLastName());
        educator.setEducatorHindiName(educatorDto.getEducatorHindiName()); // New Field
        educator.setDateOfBirth(educatorDto.getDateOfBirth());
        educator.setGender(educatorDto.getGender());
        educator.setPhoneNumber(educatorDto.getPhoneNumber());
        educator.setAlternatePhoneNumber(educatorDto.getAlternatePhoneNumber()); // New Field

        // New Address Fields
        educator.setAddressLine1(educatorDto.getAddressLine1());
        educator.setAddressLine2(educatorDto.getAddressLine2());
        educator.setCity(educatorDto.getCity());
        educator.setState(educatorDto.getState());
        educator.setPincode(educatorDto.getPincode());
        educator.setCountry(educatorDto.getCountry());

        educator.setNationality(educatorDto.getNationality()); // New Field

        educator.setHireDate(educatorDto.getHireDate());
        educator.setQualification(educatorDto.getQualification());
        educator.setExperienceYears(educatorDto.getExperienceYears());
        educator.setDesignation(educatorDto.getDesignation()); // New Field
        educator.setAadharNumber(educatorDto.getAadharNumber()); // New Field
        educator.setAccountNumber(educatorDto.getAccountNumber()); // New Field

        if (educatorDto.getProfileImageUrl() != null && !educatorDto.getProfileImageUrl().isEmpty()) {
            educator.setProfileImageUrl(educatorDto.getProfileImageUrl());
        }

        if (educatorDto.getClassIds() != null && !educatorDto.getClassIds().isEmpty()) {
            Set<Class> classes = new HashSet<>(classRepository.findAllById(educatorDto.getClassIds()));
            if (classes.size() != educatorDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }
            classes.forEach(educator::addClass);
        }

        // --- NEW LOGIC for Many-to-One Subject relationship for Educator ---
        if (educatorDto.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(educatorDto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + educatorDto.getSubjectId()));

            // Assign subject to educator (ManyToOne side)
            educator.setSubject(subject);
            // Add educator to subject's collection (OneToMany side)
            subject.getEducators().add(educator); // Ensure bidirectional link
        }

        Educator savedEducator = educatorRepository.save(educator);
        return convertToEducatorDto(savedEducator);
    }

    public EducatorDto getEducatorById(Long id) {
        Educator educator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));
        return convertToEducatorDto(educator);
    }

    public Page<EducatorDto> getAllEducators(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Educator> educatorsPage = educatorRepository.findAll(pageable);
        List<EducatorDto> dtoList = educatorsPage.getContent().stream()
                .map(this::convertToEducatorDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, educatorsPage.getTotalElements());
    }

    @Transactional
    public EducatorDto updateEducator(Long id, EducatorDto educatorDto) {
        Educator existingEducator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));

        User user = existingEducator.getUser();
        // Only update username/email if they are different and not taken by another user
        if (!user.getUsername().equals(educatorDto.getUsername())) {
            if (userRepository.existsByUsername(educatorDto.getUsername())) {
                throw new IllegalArgumentException("Username already exists!");
            }
            user.setUsername(educatorDto.getUsername());
        }
        if (!user.getEmail().equals(educatorDto.getEmail())) {
            if (userRepository.existsByEmail(educatorDto.getEmail())) {
                throw new IllegalArgumentException("Email already exists!");
            }
            user.setEmail(educatorDto.getEmail());
        }

        if (educatorDto.getPassword() != null && !educatorDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(educatorDto.getPassword()));
        }
        userRepository.save(user);

        existingEducator.setFirstName(educatorDto.getFirstName());
        existingEducator.setLastName(educatorDto.getLastName());
        existingEducator.setEducatorHindiName(educatorDto.getEducatorHindiName()); // New Field
        existingEducator.setDateOfBirth(educatorDto.getDateOfBirth());
        existingEducator.setGender(educatorDto.getGender());
        existingEducator.setPhoneNumber(educatorDto.getPhoneNumber());
        existingEducator.setAlternatePhoneNumber(educatorDto.getAlternatePhoneNumber()); // New Field

        // New Address Fields
        existingEducator.setAddressLine1(educatorDto.getAddressLine1());
        existingEducator.setAddressLine2(educatorDto.getAddressLine2());
        existingEducator.setCity(educatorDto.getCity());
        existingEducator.setState(educatorDto.getState());
        existingEducator.setPincode(educatorDto.getPincode());
        existingEducator.setCountry(educatorDto.getCountry());

        existingEducator.setNationality(educatorDto.getNationality()); // New Field

        existingEducator.setHireDate(educatorDto.getHireDate());
        existingEducator.setQualification(educatorDto.getQualification());
        existingEducator.setExperienceYears(educatorDto.getExperienceYears());
        existingEducator.setDesignation(educatorDto.getDesignation()); // New Field
        existingEducator.setAadharNumber(educatorDto.getAadharNumber()); // New Field
        existingEducator.setAccountNumber(educatorDto.getAccountNumber()); // New Field

        if (educatorDto.getProfileImageUrl() != null && !educatorDto.getProfileImageUrl().isEmpty()) {
            existingEducator.setProfileImageUrl(educatorDto.getProfileImageUrl());
        }

        if (educatorDto.getClassIds() != null) {
            Set<Class> newClasses = new HashSet<>(classRepository.findAllById(educatorDto.getClassIds()));
            if (newClasses.size() != educatorDto.getClassIds().size()) {
                throw new ResourceNotFoundException("One or more classes not found.");
            }

            // Remove classes that are no longer associated
            Set<Class> classesToRemove = new HashSet<>();
            for (Class clazz : existingEducator.getClasses()) {
                if (!newClasses.contains(clazz)) {
                    classesToRemove.add(clazz);
                }
            }
            classesToRemove.forEach(existingEducator::removeClass);

            // Add new classes
            newClasses.forEach(clazz -> {
                if (!existingEducator.getClasses().contains(clazz)) {
                    existingEducator.addClass(clazz);
                }
            });
        }

        // --- NEW LOGIC for Many-to-One Subject relationship for Educator update ---
        if (educatorDto.getSubjectId() != null) {
            Subject newSubject = subjectRepository.findById(educatorDto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + educatorDto.getSubjectId()));

            // If subject is changing, remove educator from old subject's list
            if (existingEducator.getSubject() != null && !existingEducator.getSubject().getId().equals(newSubject.getId())) {
                existingEducator.getSubject().getEducators().remove(existingEducator);
            }

            // Assign new subject to educator
            existingEducator.setSubject(newSubject);
            // Add educator to new subject's list
            newSubject.getEducators().add(existingEducator);
        } else { // If subjectId is null, disassociate educator from any subject
            if (existingEducator.getSubject() != null) {
                existingEducator.getSubject().getEducators().remove(existingEducator); // Remove from subject's list
                existingEducator.setSubject(null); // Disassociate subject from educator
            }
        }

        Educator updatedEducator = educatorRepository.save(existingEducator);
        return convertToEducatorDto(updatedEducator);
    }

    @Transactional
    public void deleteEducator(Long id) {
        Educator educator = educatorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Educator not found with id: " + id));
        User user = educator.getUser();

        // Remove from classes taught
        new HashSet<>(educator.getClasses()).forEach(educator::removeClass);

        // --- NEW LOGIC for Many-to-One Subject relationship when deleting educator ---
        if (educator.getSubject() != null) {
            educator.getSubject().getEducators().remove(educator); // Remove educator from subject's list
            educator.setSubject(null); // Disassociate
        }

        if (educator.getProfileImageUrl() != null && !educator.getProfileImageUrl().isEmpty()) {
            imageUploadService.deleteFile(educator.getProfileImageUrl());
        }

        educatorRepository.delete(educator);
        userRepository.delete(user);
    }

    // --- Student Management --- (No changes needed, already handled ManyToMany)

    @Transactional
    public StudentDto createStudent(StudentDto studentDto) {
        if (userRepository.existsByUsername(studentDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.existsByEmail(studentDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }

        User user = new User();
        user.setUsername(studentDto.getUsername());
        user.setEmail(studentDto.getEmail());
        user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        user.setRole(Role.ROLE_STUDENT);
        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        student.setGender(studentDto.getGender());
        student.setPhoneNumber(studentDto.getPhoneNumber());
        student.setAddressLine1(studentDto.getAddressLine1());
        student.setEnrollmentDate(studentDto.getEnrollmentDate());
        student.setGrade(studentDto.getGrade());
        student.setCity(studentDto.getCity());
        student.setState(studentDto.getState());
        student.setPincode(studentDto.getPincode());
        student.setCountry(studentDto.getCountry());

        student.setFatherName(studentDto.getFatherName());
        student.setMotherName(studentDto.getMotherName());
        student.setFatherMobileNumber(studentDto.getFatherMobileNumber());
        student.setMotherMobileNumber(studentDto.getMotherMobileNumber());
        student.setLocalMobileNumber(studentDto.getLocalMobileNumber());

        student.setStudentHindiName(studentDto.getStudentHindiName());
        student.setReligion(studentDto.getReligion());
        student.setNationality(studentDto.getNationality());
        student.setCategory(studentDto.getCategory());
        student.setPhysicalHandicapped(studentDto.getPhysicalHandicapped());
        student.setRollNumber(studentDto.getRollNumber());
        student.setGrade(studentDto.getGrade());


        if (studentDto.getProfileImageUrl() != null && !studentDto.getProfileImageUrl().isEmpty()) {
            student.setProfileImageUrl(studentDto.getProfileImageUrl());
        }

        if (studentDto.getClassId() != null) {
            Class clazz = classRepository.findById(studentDto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + studentDto.getClassId()));
            student.setClazz(clazz);
            clazz.addStudent(student);
        }

        if (studentDto.getSubjectIds() != null && !studentDto.getSubjectIds().isEmpty()) {
            Set<Subject> subjects = new HashSet<>(subjectRepository.findAllById(studentDto.getSubjectIds()));
            if (subjects.size() != studentDto.getSubjectIds().size()) {
                throw new ResourceNotFoundException("One or more subjects not found.");
            }
            subjects.forEach(student::addSubject);
        }

        Student savedStudent = studentRepository.save(student);
        return convertToStudentDto(savedStudent);
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return convertToStudentDto(student);
    }

    public Page<StudentDto> getAllStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentsPage = studentRepository.findAll(pageable);
        List<StudentDto> dtoList = studentsPage.getContent().stream()
                .map(this::convertToStudentDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, studentsPage.getTotalElements());
    }

    @Transactional
    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        User user = existingStudent.getUser();
        user.setUsername(studentDto.getUsername());
        user.setEmail(studentDto.getEmail());
        if (studentDto.getPassword() != null && !studentDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        }
        userRepository.save(user);

        existingStudent.setFirstName(studentDto.getFirstName());
        existingStudent.setLastName(studentDto.getLastName());
        existingStudent.setDateOfBirth(studentDto.getDateOfBirth());
        existingStudent.setGender(studentDto.getGender());
        existingStudent.setPhoneNumber(studentDto.getPhoneNumber());
        existingStudent.setAddressLine1(studentDto.getAddressLine1());
        existingStudent.setEnrollmentDate(studentDto.getEnrollmentDate());
        existingStudent.setCity(studentDto.getCity());
        existingStudent.setState(studentDto.getState());
        existingStudent.setPincode(studentDto.getPincode());
        existingStudent.setCountry(studentDto.getCountry());

        existingStudent.setFatherName(studentDto.getFatherName());
        existingStudent.setMotherName(studentDto.getMotherName());
        existingStudent.setFatherMobileNumber(studentDto.getFatherMobileNumber());
        existingStudent.setMotherMobileNumber(studentDto.getMotherMobileNumber());
        existingStudent.setLocalMobileNumber(studentDto.getLocalMobileNumber());

        existingStudent.setStudentHindiName(studentDto.getStudentHindiName());
        existingStudent.setReligion(studentDto.getReligion());
        existingStudent.setNationality(studentDto.getNationality());
        existingStudent.setCategory(studentDto.getCategory());
        existingStudent.setPhysicalHandicapped(studentDto.getPhysicalHandicapped());
        existingStudent.setRollNumber(studentDto.getRollNumber());

        existingStudent.setGrade(studentDto.getGrade());

        if (studentDto.getProfileImageUrl() != null && !studentDto.getProfileImageUrl().isEmpty()) {
            existingStudent.setProfileImageUrl(studentDto.getProfileImageUrl());
        }

        if (studentDto.getClassId() != null) {
            Class newClass = classRepository.findById(studentDto.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + studentDto.getClassId()));
            if (existingStudent.getClazz() != null && !existingStudent.getClazz().equals(newClass)) {
                existingStudent.getClazz().removeStudent(existingStudent);
            }
            newClass.addStudent(existingStudent);
            existingStudent.setClazz(newClass);
        } else {
            if (existingStudent.getClazz() != null) {
                existingStudent.getClazz().removeStudent(existingStudent);
            }
            existingStudent.setClazz(null);
        }

        if (studentDto.getSubjectIds() != null) {
            Set<Long> newSubjectIds = new HashSet<>(studentDto.getSubjectIds());
            Set<Subject> newSubjects = new HashSet<>(subjectRepository.findAllById(newSubjectIds));

            if (newSubjects.size() != newSubjectIds.size()) {
                throw new ResourceNotFoundException("One or more subjects not found.");
            }

            Set<Subject> subjectsToRemove = new HashSet<>();
            for (Subject subject : existingStudent.getSubjects()) {
                if (!newSubjects.contains(subject)) {
                    subjectsToRemove.add(subject);
                }
            }
            subjectsToRemove.forEach(existingStudent::removeSubject);

            for (Subject subject : newSubjects) {
                if (!existingStudent.getSubjects().contains(subject)) {
                    existingStudent.addSubject(subject);
                }
            }
        } else {
            new HashSet<>(existingStudent.getSubjects()).forEach(existingStudent::removeSubject);
        }

        Student updatedStudent = studentRepository.save(existingStudent);
        return convertToStudentDto(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        User user = student.getUser();

        if (student.getClazz() != null) {
            student.getClazz().removeStudent(student);
        }

        new HashSet<>(student.getSubjects()).forEach(student::removeSubject);

        if (student.getProfileImageUrl() != null && !student.getProfileImageUrl().isEmpty()) {
            imageUploadService.deleteFile(student.getProfileImageUrl());
        }

        studentRepository.delete(student);
        userRepository.delete(user);
    }


    // --- Class Management ---

    @Transactional
    public ClassDto createClass(ClassDto classDto) {
        if (classRepository.existsByClassCode(classDto.getClassCode())) {
            throw new IllegalArgumentException("Class with this code already exists!");
        }

        Class clazz = new Class();
        clazz.setClassName(classDto.getClassName());
        clazz.setClassCode(classDto.getClassCode());
        clazz.setDescription(classDto.getDescription());

        if (classDto.getEducators() != null && !classDto.getEducators().isEmpty()) {
            Set<Long> educatorIds = classDto.getEducators().stream()
                    .map(ClassDto.EducatorInfo::getId)
                    .collect(Collectors.toSet());
            Set<Educator> educators = new HashSet<>(educatorRepository.findAllById(educatorIds));

            if (educators.size() != educatorIds.size()) {
                throw new ResourceNotFoundException("One or more educators not found.");
            }
            educators.forEach(clazz::addEducator);
        }

        Class savedClass = classRepository.save(clazz);
        return convertToClassDto(savedClass);
    }

    public ClassDto getClassById(Long id) {
        Class clazz = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return convertToClassDto(clazz);
    }

    public Page<ClassDto> getAllClasses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Class> classesPage = classRepository.findAll(pageable);
        List<ClassDto> dtoList = classesPage.getContent().stream()
                .map(this::convertToClassDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, classesPage.getTotalElements());
    }

    @Transactional
    public ClassDto updateClass(Long id, ClassDto classDto) {
        Class existingClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        if (!existingClass.getClassCode().equals(classDto.getClassCode()) && classRepository.existsByClassCode(classDto.getClassCode())) {
            throw new IllegalArgumentException("Class with this code already exists!");
        }

        existingClass.setClassName(classDto.getClassName());
        existingClass.setClassCode(classDto.getClassCode());
        existingClass.setDescription(classDto.getDescription());

        if (classDto.getEducators() != null) {
            Set<Long> newEducatorIds = classDto.getEducators().stream()
                    .map(ClassDto.EducatorInfo::getId)
                    .collect(Collectors.toSet());
            Set<Educator> newEducators = new HashSet<>(educatorRepository.findAllById(newEducatorIds));

            if (newEducators.size() != newEducatorIds.size()) {
                throw new ResourceNotFoundException("One or more educators not found.");
            }

            Set<Educator> educatorsToRemove = new HashSet<>();
            for (Educator educator : existingClass.getEducators()) {
                if (!newEducators.contains(educator)) {
                    educatorsToRemove.add(educator);
                }
            }
            educatorsToRemove.forEach(existingClass::removeEducator);

            for (Educator educator : newEducators) {
                if (!existingClass.getEducators().contains(educator)) {
                    existingClass.addEducator(educator);
                }
            }
        } else {
            new HashSet<>(existingClass.getEducators()).forEach(existingClass::removeEducator);
        }

        Class updatedClass = classRepository.save(existingClass);
        return convertToClassDto(updatedClass);
    }

    @Transactional
    public void deleteClass(Long id) {
        Class clazz = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        new HashSet<>(clazz.getStudents()).forEach(clazz::removeStudent);
        new HashSet<>(clazz.getEducators()).forEach(clazz::removeEducator);

        classRepository.delete(clazz);
    }


    // --- Subject Management (ADJUSTED METHODS) ---

    @Transactional
    public SubjectDto createSubject(SubjectDto subjectDto) {
        if (subjectRepository.existsBySubjectName(subjectDto.getSubjectName())) {
            throw new IllegalArgumentException("Subject with this name already exists!");
        }

        Subject subject = new Subject();
        subject.setSubjectName(subjectDto.getSubjectName());
        subject.setDescription(subjectDto.getDescription());

        // --- NEW LOGIC for One-to-Many Educators ---
        if (subjectDto.getEducatorIds() != null && !subjectDto.getEducatorIds().isEmpty()) {
            Set<Educator> educators = new HashSet<>(educatorRepository.findAllById(subjectDto.getEducatorIds()));
            if (educators.size() != subjectDto.getEducatorIds().size()) {
                throw new ResourceNotFoundException("One or more educators not found for this subject.");
            }
            for (Educator educator : educators) {
                if (educator.getSubject() != null) {
                    throw new IllegalArgumentException("Educator " + educator.getFirstName() + " " + educator.getLastName() + " is already assigned to subject: " + educator.getSubject().getSubjectName());
                }
                subject.addEducator(educator); // Use helper method on Subject
            }
        }

        // Handle ManyToMany Student assignment (remains the same)
        if (subjectDto.getStudentIds() != null && !subjectDto.getStudentIds().isEmpty()) {
            Set<Student> students = new HashSet<>(studentRepository.findAllById(subjectDto.getStudentIds()));
            if (students.size() != subjectDto.getStudentIds().size()) {
                throw new ResourceNotFoundException("One or more students not found for subjects.");
            }
            for (Student student : students) {
                subject.addStudent(student);
            }
        }

        Subject savedSubject = subjectRepository.save(subject);
        return convertToSubjectDto(savedSubject);
    }

    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return convertToSubjectDto(subject);
    }

    public Page<SubjectDto> getAllSubjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Subject> subjectsPage = subjectRepository.findAll(pageable);
        List<SubjectDto> dtoList = subjectsPage.getContent().stream()
                .map(this::convertToSubjectDto)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, subjectsPage.getTotalElements());
    }

    @Transactional
    public SubjectDto updateSubject(Long id, SubjectDto subjectDto) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        if (!existingSubject.getSubjectName().equals(subjectDto.getSubjectName()) && subjectRepository.existsBySubjectName(subjectDto.getSubjectName())) {
            throw new IllegalArgumentException("Subject with this name already exists!");
        }

        existingSubject.setSubjectName(subjectDto.getSubjectName());
        existingSubject.setDescription(subjectDto.getDescription());

        // --- NEW LOGIC for One-to-Many Educator update ---
        if (subjectDto.getEducatorIds() != null) {
            Set<Long> newEducatorIds = new HashSet<>(subjectDto.getEducatorIds());
            Set<Educator> newEducators = new HashSet<>(educatorRepository.findAllById(newEducatorIds));

            if (newEducators.size() != newEducatorIds.size()) {
                throw new ResourceNotFoundException("One or more educators not found for this subject.");
            }

            // Check for educators already assigned to other subjects
            for (Educator newEducator : newEducators) {
                if (newEducator.getSubject() != null && !newEducator.getSubject().getId().equals(existingSubject.getId())) {
                    throw new IllegalArgumentException("Educator " + newEducator.getFirstName() + " " + newEducator.getLastName() + " is already assigned to subject: " + newEducator.getSubject().getSubjectName());
                }
            }

            // Remove educators no longer associated with this subject
            Set<Educator> educatorsToRemove = new HashSet<>();
            for (Educator educator : existingSubject.getEducators()) {
                if (!newEducators.contains(educator)) {
                    educatorsToRemove.add(educator);
                }
            }
            educatorsToRemove.forEach(existingSubject::removeEducator); // Use helper method

            // Add new educators to this subject
            for (Educator educator : newEducators) {
                if (!existingSubject.getEducators().contains(educator)) {
                    existingSubject.addEducator(educator); // Use helper method
                }
            }
        } else {
            // If educatorIds is null, clear all educators from this subject
            new HashSet<>(existingSubject.getEducators()).forEach(existingSubject::removeEducator);
        }

        // Handle ManyToMany Student update (remains the same)
        if (subjectDto.getStudentIds() != null) {
            Set<Long> newStudentIds = new HashSet<>(subjectDto.getStudentIds());
            Set<Student> newStudents = new HashSet<>(studentRepository.findAllById(newStudentIds));

            if (newStudents.size() != newStudentIds.size()) {
                throw new ResourceNotFoundException("One or more students not found for subjects.");
            }

            Set<Student> studentsToRemove = new HashSet<>();
            for (Student student : existingSubject.getStudents()) {
                if (!newStudents.contains(student)) {
                    studentsToRemove.add(student);
                }
            }
            studentsToRemove.forEach(existingSubject::removeStudent);

            for (Student student : newStudents) {
                if (!existingSubject.getStudents().contains(student)) {
                    existingSubject.addStudent(student);
                }
            }
        } else {
            new HashSet<>(existingSubject.getStudents()).forEach(existingSubject::removeStudent);
        }

        Subject updatedSubject = subjectRepository.save(existingSubject);
        return convertToSubjectDto(updatedSubject);
    }

    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        // --- NEW LOGIC: Remove association with all educators ---
        new HashSet<>(subject.getEducators()).forEach(subject::removeEducator);

        // Remove association with all students
        new HashSet<>(subject.getStudents()).forEach(subject::removeStudent);

        subjectRepository.delete(subject);
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
        dto.setClassIds(educator.getClasses().stream()
                .map(Class::getId)
                .collect(Collectors.toList()));
        // --- NEW: Populate subjectId and subjectName for EducatorDto ---
        if (educator.getSubject() != null) {
            dto.setSubjectId(educator.getSubject().getId());
            dto.setSubjectName(educator.getSubject().getSubjectName()); // Populate name for convenience
        }
        return dto;
    }

    private StudentDto convertToStudentDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setUsername(student.getUser().getUsername());
        dto.setEmail(student.getUser().getEmail());
        // Password is not typically returned in DTOs for security reasons
        // dto.setPassword(null); // Explicitly set to null or omit from conversion

        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setPhoneNumber(student.getPhoneNumber());

        // --- NEW/UPDATED: Address Details ---
        dto.setAddressLine1(student.getAddressLine1()); // Correctly map addressLine1
        dto.setCity(student.getCity());
        dto.setState(student.getState());
        dto.setPincode(student.getPincode());
        dto.setCountry(student.getCountry());

        dto.setProfileImageUrl(student.getProfileImageUrl());
        dto.setEnrollmentDate(student.getEnrollmentDate());
        dto.setGrade(student.getGrade());
        dto.setRole(student.getUser().getRole()); // Get role from User entity

        if (student.getClazz() != null) {
            dto.setClassId(student.getClazz().getId());
        }

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
        dto.setRollNumber(student.getRollNumber()); // Map the generated roll number

        dto.setSubjectIds(student.getSubjects().stream()
                .map(Subject::getId)
                .collect(Collectors.toList()));

        // Age will be calculated by the DTO's getter method, no need to set here
        return dto;
    }

    private ClassDto convertToClassDto(Class clazz) {
        ClassDto dto = new ClassDto();
        dto.setId(clazz.getId());
        dto.setClassName(clazz.getClassName());
        dto.setClassCode(clazz.getClassCode());
        dto.setDescription(clazz.getDescription());

        if (clazz.getEducators() != null) {
            dto.setEducators(clazz.getEducators().stream()
                    .map(educator -> {
                        ClassDto.EducatorInfo info = new ClassDto.EducatorInfo();
                        info.setId(educator.getId());
                        info.setFirstName(educator.getFirstName());
                        info.setLastName(educator.getLastName());
                        if (educator.getUser() != null) {
                            info.setEmail(educator.getUser().getEmail());
                        }
                        return info;
                    })
                    .sorted(Comparator.comparing(ClassDto.EducatorInfo::getLastName))
                    .collect(Collectors.toList()));
        }

        if (clazz.getStudents() != null) {
            dto.setStudents(clazz.getStudents().stream()
                    .map(student -> {
                        ClassDto.StudentInfo info = new ClassDto.StudentInfo();
                        info.setId(student.getId());
                        info.setFirstName(student.getFirstName());
                        info.setLastName(student.getLastName());
                        if (student.getUser() != null) {
                            info.setEmail(student.getUser().getEmail());
                        }
                        return info;
                    })
                    .sorted(Comparator.comparing(ClassDto.StudentInfo::getLastName))
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    // --- NEW: Helper method to convert Subject entity to SubjectDto ---
    private SubjectDto convertToSubjectDto(Subject subject) {
        SubjectDto dto = new SubjectDto();
        dto.setId(subject.getId());
        dto.setSubjectName(subject.getSubjectName());
        dto.setDescription(subject.getDescription());
        // --- NEW: Populate educatorIds and EducatorInfo for SubjectDto ---
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

    // --- Dashboard Count Methods ---
    public long getStudentsCount() {
        return studentRepository.count();
    }

    public long getEducatorsCount() {
        return educatorRepository.count();
    }

    public long getSubjectsCount() {
        return subjectRepository.count();
    }

    public long getClassesCount() {
        return classRepository.count();
    }

}