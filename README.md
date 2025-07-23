# CampusCore 🎓

A comprehensive full-stack web application designed to facilitate remote tracking of student activity and academic progress, enabling seamless communication between educators, students, and parents.

## 📋 Table of Contents

- [📂 Folder Structure](./folder-structure.md)
- [🖼 Screenshots](./screenshots.md)
- [🎥 Demo Video](https://youtu.be/9H3C7isvIME)

## 🎯 Project Goal

CampusCore bridges the gap between classroom learning and home monitoring by providing a centralized platform where educators can provide detailed feedback on student performance, students can track their academic journey, and parents can stay informed about their child's educational progress remotely.

## ✨ Features

### 👨‍💼 Admin Features
- **Class Registration**: Create and organize classes across different grade levels
- **Subject Management**: Add, update, and remove subjects for each class
- **Student Management**: Register new students, update student information, and manage student records
- **Educator Management**: Add new educators, assign them to classes, and manage educator profiles
- **System Overview**: Monitor overall platform activity and user statistics

### 👩‍🏫 Educator Features
- **Class Overview**: View complete list of students assigned to their classes
- **Subject-wise Feedback**: Provide detailed feedback for each subject taught
- **Progress Tracking**: Monitor and document student progress over time
- **Performance Analytics**: View student performance trends and patterns
- **Communication Hub**: Direct feedback delivery to students and parents

### 👨‍🎓 Student Features
- **Personal Dashboard**: View personal academic information and profile details
- **Feedback Portal**: Access all feedback received from educators across subjects
- **Progress Monitoring**: Track academic progress and performance metrics
- **Subject-wise Reports**: View detailed feedback organized by subject areas
- **Parent Communication**: Enable parents to view progress through shared access

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Spring Boot |
| **Database** | MySQL |
| **Frontend** | React.js |
| **Authentication** | Spring Security |
| **API Architecture** | RESTful APIs |
| **Build Tool** | Maven (Backend), npm (Frontend) | |


## 🚀 How to Run

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campuscore.git
   cd campuscore
   ```

2. **Configure Database**
   - Create a MySQL database named `campuscore`
   - Update `application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campuscore
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5174`

## 📋 Sample Use Case

### Scenario: Mathematics Progress Tracking

1. **Admin Setup**
   - Admin creates "Grade 10A" class
   - Adds "Mathematics" as a subject
   - Registers student "John Doe" and educator "Mrs. Smith"

2. **Educator Workflow**
   - Mrs. Smith logs in and views her assigned class
   - Selects John Doe from the student list
   - Provides feedback: "Excellent progress in algebra. Needs improvement in geometry problem-solving."

3. **Student Access**
   - John logs in to view his dashboard
   - Sees the mathematics feedback from Mrs. Smith
   - Tracks his progress over time

4. **Parent Monitoring**
   - John's parents can remotely access his feedback
   - Monitor his academic progress without visiting the campus
   - Stay informed about areas needing attention

## 📝 Important Note

CampusCore is designed as a **student activity and progress tracking platform**, not a traditional management system. 
The focus is on enhancing communication, monitoring academic growth, and facilitating remote oversight of student development rather than administrative management tasks.

## 📸 Screenshots

*For detailed screenshots of the application interface, please visit: [🖼 Screenshots](./screenshots.md)*

## 🎥 Demo Video

*Watch our complete demo video: [🎥 Demo Video](https://www.youtube.com/watch?v=your_video_id)*

## 🤝 Contributing

We welcome contributions to CampusCore! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Standards
- Follow Java naming conventions for backend code
- Use ESLint and Prettier for frontend code formatting
- Write meaningful commit messages
- Include unit tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📣 About
**CampusCore** – Empowering education through seamless progress tracking and communication 🌟  
For support or queries, please [create an issue](https://github.com/Piyushkiwi/CampusCore/issues) in the GitHub repository.

---

> Developed with ❤️ by **Piyush Kumar** and **Roushan Kumar**

