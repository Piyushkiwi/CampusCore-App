## 🏗️ Project Architecture Overview
```
CampusCore/
├── 🔧 Backend/                     # Spring Boot Application
├── 🎨 frontend/                    # React Application  
├── 📁 uploads/                     # File Storage Directory
└── 📋 CampusCore.iml              # IntelliJ IDEA Module File
```

## 🔧 Backend Structure  
**📁 Complete Backend Directory Tree**
```
Backend/
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── campus/
│   │   │           └── backend/
│   │   │               ├── 🔐 config/
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── 🎮 controller/
│   │   │               │   ├── AdminController.java
│   │   │               │   ├── AdminNewsController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── EducatorController.java
│   │   │               │   ├── ImageUploadController.java
│   │   │               │   ├── PublicNewsController.java
│   │   │               │   └── StudentController.java
│   │   │               ├── 📦 dtos/
│   │   │               │   ├── AuthRequest.java
│   │   │               │   ├── AuthResponse.java
│   │   │               │   ├── ClassDto.java
│   │   │               │   ├── EducatorDto.java
│   │   │               │   ├── FeedbackDto.java
│   │   │               │   ├── ForgotPasswordRequest.java
│   │   │               │   ├── NewsRequest.java
│   │   │               │   ├── NewsResponse.java
│   │   │               │   ├── NewsTitleResponse.java
│   │   │               │   ├── StudentDto.java
│   │   │               │   ├── SubjectDto.java
│   │   │               │   └── UserDto.java
│   │   │               ├── 🏢 entity/
│   │   │               │   ├── enums/
│   │   │               │   │   └── Role.java
│   │   │               │   ├── Class.java
│   │   │               │   ├── Educator.java
│   │   │               │   ├── Feedback.java
│   │   │               │   ├── News.java
│   │   │               │   ├── PasswordResetToken.java
│   │   │               │   ├── Student.java
│   │   │               │   ├── Subject.java
│   │   │               │   └── User.java
│   │   │               ├── ⚠️ exceptions/
│   │   │               │   ├── MyGlobalExceptionHandler.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── 🗃️ repositories/
│   │   │               │   ├── ClassRepository.java
│   │   │               │   ├── EducatorRepository.java
│   │   │               │   ├── FeedbackRepository.java
│   │   │               │   ├── NewsRepository.java
│   │   │               │   ├── PasswordResetTokenRepository.java
│   │   │               │   ├── StudentRepository.java
│   │   │               │   ├── SubjectRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── 🔒 security/
│   │   │               │   └── jwt/
│   │   │               │       ├── JwtAuthEntryPoint.java
│   │   │               │       ├── JwtAuthFilter.java
│   │   │               │       └── JwtHelper.java
│   │   │               ├── 🔧 services/
│   │   │               │   ├── AdminService.java
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── EducatorService.java
│   │   │               │   ├── EmailService.java
│   │   │               │   ├── ImageUploadService.java
│   │   │               │   ├── NewsService.java
│   │   │               │   └── StudentService.java
│   │   │               └── BackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── campus/
│                   └── backend/
│                       └── BackendApplicationTests.java
├── .gitattributes
├── .gitignore
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## 🎨 Frontend Structure
**📁 Complete Frontend Directory Tree**
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── 🖼️ assets/
│   │   ├── images/
│   │   │   ├── g1.jpg → g8.jpg        # Gallery images
│   │   │   ├── h1.jpg → h3.jpg        # Header images
│   │   │   └── react.svg
│   │   └── react.svg
│   ├── 🧩 components/
│   │   ├── admin/
│   │   │   ├── ClassManagement.jsx
│   │   │   ├── EducatorManagement.jsx
│   │   │   ├── NewsManagment.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   └── SubjectManagement.jsx
│   │   ├── common/
│   │   │   └── Modal.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── 📄 pages/
│   │   ├── About.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EducatorDashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NewsDetailPage.jsx
│   │   ├── ResetPassword.jsx
│   │   └── StudentDashboard.jsx
│   ├── 🌐 services/
│   │   └── api.js
│   ├── 🎨 styles/
│   │   └── ContactPage.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── frontend.iml
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## 📁 File Storage
```
uploads/
├── 8e9d2a91-8d0b-48f4-9dc9-e7fcc7f5136a.jpg    # User uploaded images
└── ff147fc7-e03e-481b-a2c5-09ca8d7d6e9c.jpg    # Profile pictures, etc.
```
