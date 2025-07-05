// src/pages/StudentDashboard.jsx
import React, {useState, useEffect, useCallback} from "react";
import api from "../services/api"; // Your Axios instance
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faUserCircle,
    faGraduationCap,
    faBookOpen,
    faComments,
    faCalendarAlt,
    faPhone,
    faMapMarkerAlt,
    faVenusMars,
    faBirthdayCake,
    faChild,
    faHandsHelping,
    faGlobe,
    faTags,
    faPray,
    faWheelchair,
    faIdBadge,
    faHome,
    faEnvelope,
    faEdit,
    faUser,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [enrolledClass, setEnrolledClass] = useState(null);
    const [enrolledSubjects, setEnrolledSubjects] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // States for dynamic dropdowns (to resolve IDs to names)
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    // Helper to get educator names from a list of educator objects (SubjectDto.EducatorInfo)
    const getEducatorNames = useCallback((educators) => {
        if (!educators || educators.length === 0) return "N/A";
        return educators
            .map((educator) => `${educator.firstName} ${educator.lastName}`)
            .join(", ");
    }, []);

    // Helper to get class name from ID (if not directly provided in profile DTO)
    const getClassName = useCallback(
        (classId) => {
            const clazz = allClasses.find((c) => c.id === classId);
            return clazz ? `${clazz.className} (${clazz.classCode})` : "N/A";
        },
        [allClasses]
    );

    // Helper to get subject names from IDs (if not directly provided in profile DTO)
    const getSubjectNames = useCallback(
        (subjectIds) => {
            if (!subjectIds || subjectIds.length === 0) return "N/A";
            return subjectIds
                .map((id) => {
                    const subject = allSubjects.find((s) => s.id === id);
                    return subject ? subject.subjectName : null;
                })
                .filter(Boolean)
                .join(", ");
        },
        [allSubjects]
    );

    useEffect(() => {
        const fetchStudentData = async () => {
            setLoading(true);
            setError("");
            try {
                // Fetch all classes and subjects first for lookup (using student-accessible endpoints)
                const [classesResponse, subjectsResponse] = await Promise.all([
                    api.get("/student/classes/all"),
                    api.get("/student/subjects/all"),
                ]);
                setAllClasses(classesResponse.data);
                setAllSubjects(subjectsResponse.data);

                // Fetch Student Profile
                const profileResponse = await api.get("/student/profile");
                setProfile(profileResponse.data);

                // Fetch Enrolled Class
                try {
                    const classResponse = await api.get("/student/enrolled-class");
                    setEnrolledClass(classResponse.data);
                } catch (classErr) {
                    if (
                        classErr.response &&
                        (classErr.response.status === 404 ||
                            classErr.response.status === 204)
                    ) {
                        setEnrolledClass(null);
                        console.warn("No enrolled class found for this student.");
                    } else {
                        console.error("Error fetching enrolled class:", classErr);
                        setError("Failed to fetch enrolled class data.");
                    }
                }

                // Fetch Enrolled Subjects (assuming the profile DTO contains subjectIds)
                if (profileResponse.data.subjectIds && subjectsResponse.data) {
                    const subjectsForStudent = subjectsResponse.data.filter((subject) =>
                        profileResponse.data.subjectIds.includes(subject.id)
                    );
                    setEnrolledSubjects(subjectsForStudent);
                }

                // Fetch Feedback
                const feedbackResponse = await api.get("/student/feedback");
                setFeedback(feedbackResponse.data);
            } catch (err) {
                console.error("Error fetching student dashboard data:", err);
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 text-xl font-semibold">Loading student dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-red-600 text-6xl mb-4">⚠️</div>
                    <p className="text-red-600 text-xl font-semibold">Error: {error}</p>
                </div>
            </div>
        );
    }

    // Enhanced DetailItem component with better styling
    const DetailItem = ({icon, label, value, className = ""}) => (
        <div
            className={`bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} className="text-blue-600 text-sm"/>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-sm text-gray-900 font-semibold break-words">{value || "Not provided"}</p>
                </div>
            </div>
        </div>
    );

    // Section Header component
    const SectionHeader = ({icon, title, subtitle, color = "blue"}) => (
        <div className={`mb-6 pb-4 border-b-2 border-${color}-200`}>
            <h3 className={`text-2xl font-bold text-${color}-800 flex items-center gap-3 mb-1`}>
                <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} className={`text-${color}-600`}/>
                </div>
                {title}
            </h3>
            {subtitle && <p className="text-gray-600 ml-13">{subtitle}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Student Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Welcome back! Here's your complete academic profile</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-blue-100">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <FontAwesomeIcon icon={faUserCircle} className="text-blue-200"/>
                                My Profile
                            </h2>
                        </div>
                    </div>

                    {profile ? (
                        <div className="p-8">
                            {/* Profile Header Section */}
                            <div className="flex flex-col lg:flex-row gap-8 mb-10">
                                {/* Profile Image */}
                                <div className="flex-shrink-0 flex justify-center lg:justify-start">
                                    <div className="relative">
                                        {profile.profileImageUrl ? (
                                            <img
                                                src={`${api.defaults.baseURL}${profile.profileImageUrl}`}
                                                alt="Profile"
                                                className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full shadow-xl border-4 border-white ring-4 ring-blue-200"
                                            />
                                        ) : (
                                            <div
                                                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold shadow-xl border-4 border-white ring-4 ring-blue-200">
                                                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "S"}
                                            </div>
                                        )}
                                        <div
                                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info Card */}
                                <div className="flex-1">
                                    <div
                                        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                                        <div className="mb-4">
                                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                                                {profile.firstName} {profile.lastName}
                                                {profile.studentHindiName && (
                                                    <span className="text-lg text-gray-600 font-normal ml-2">
                                                        ({profile.studentHindiName})
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-blue-600 font-semibold text-lg">
                                                Roll No: {profile.rollNumber}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faEnvelope} className="text-blue-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-semibold text-gray-800">{profile.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faPhone} className="text-blue-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-semibold text-gray-800">{profile.phoneNumber || "Not provided"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Grade</p>
                                                    <p className="font-semibold text-gray-800">{profile.grade}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Enrolled</p>
                                                    <p className="font-semibold text-gray-800">{profile.enrollmentDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Information Sections */}
                            <div className="space-y-10">
                                {/* Personal Information */}
                                <div>
                                    <SectionHeader
                                        icon={faUser}
                                        title="Personal Information"
                                        subtitle="Basic personal details and demographics"
                                        color="blue"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DetailItem icon={faUserCircle} label="Username" value={profile.username}/>
                                        <DetailItem icon={faBirthdayCake} label="Date of Birth"
                                                    value={profile.dateOfBirth}/>
                                        <DetailItem icon={faVenusMars} label="Gender" value={profile.gender}/>
                                        <DetailItem icon={faPray} label="Religion" value={profile.religion}/>
                                        <DetailItem icon={faGlobe} label="Nationality" value={profile.nationality}/>
                                        <DetailItem icon={faTags} label="Category" value={profile.category}/>
                                        <DetailItem
                                            icon={faWheelchair}
                                            label="Physical Handicapped"
                                            value={profile.physicalHandicapped ? "Yes" : "No"}
                                            className={profile.physicalHandicapped ? "bg-yellow-50 border-yellow-200" : ""}
                                        />
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div>
                                    <SectionHeader
                                        icon={faGraduationCap}
                                        title="Academic Information"
                                        subtitle="Current class and subject enrollment details"
                                        color="green"
                                    />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faGraduationCap}/>
                                                Current Class
                                            </h4>
                                            <p className="text-green-700 text-lg font-semibold">
                                                {getClassName(profile.classId)}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                                            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faBookOpen}/>
                                                Enrolled Subjects
                                            </h4>
                                            <p className="text-purple-700 font-semibold">
                                                {getSubjectNames(profile.subjectIds)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <SectionHeader
                                        icon={faHome}
                                        title="Contact Information"
                                        subtitle="Address and location details"
                                        color="indigo"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DetailItem
                                            icon={faMapMarkerAlt}
                                            label="Address"
                                            value={profile.addressLine1}
                                            className="md:col-span-2"
                                        />
                                        <DetailItem icon={faMapMarkerAlt} label="City" value={profile.city}/>
                                        <DetailItem icon={faMapMarkerAlt} label="State" value={profile.state}/>
                                        <DetailItem icon={faMapMarkerAlt} label="Pincode" value={profile.pincode}/>
                                        <DetailItem icon={faMapMarkerAlt} label="Country" value={profile.country}/>
                                    </div>
                                </div>

                                {/* Parent/Guardian Information */}
                                <div>
                                    <SectionHeader
                                        icon={faUsers}
                                        title="Parent & Guardian Information"
                                        subtitle="Family contact details and emergency contacts"
                                        color="orange"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Father's Details */}
                                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                                            <h4 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faUser}/>
                                                Father's Details
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-orange-600">Name</p>
                                                    <p className="font-semibold text-orange-800">{profile.fatherName || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-orange-600">Phone</p>
                                                    <p className="font-semibold text-orange-800">{profile.fatherMobileNumber || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mother's Details */}
                                        <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                                            <h4 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faUser}/>
                                                Mother's Details
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-pink-600">Name</p>
                                                    <p className="font-semibold text-pink-800">{profile.motherName || "Not provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-pink-600">Phone</p>
                                                    <p className="font-semibold text-pink-800">{profile.motherMobileNumber || "Not provided"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Local Contact */}
                                        {profile.localMobileNumber && (
                                            <div
                                                className="bg-teal-50 p-6 rounded-xl border border-teal-200 md:col-span-2">
                                                <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faPhone}/>
                                                    Local Emergency Contact
                                                </h4>
                                                <p className="font-semibold text-teal-800">{profile.localMobileNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-6xl mb-4">👤</div>
                            <p className="text-gray-600 text-lg">Profile information not available.</p>
                        </div>
                    )}
                </div>

                {/* Enrolled Class Section */}
                <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-green-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
                        <FontAwesomeIcon icon={faGraduationCap} className="mr-3 text-green-600"/>
                        My Enrolled Class
                    </h2>
                    {enrolledClass ? (
                        <div className="space-y-3 text-gray-700">
                            <p>
                                <strong className="text-green-700">Class Name:</strong>{" "}
                                {enrolledClass.className}
                            </p>
                            <p>
                                <strong className="text-green-700">Class Code:</strong>{" "}
                                {enrolledClass.classCode}
                            </p>
                            <p>
                                <strong className="text-green-700">Description:</strong>{" "}
                                {enrolledClass.description || "N/A"}
                            </p>
                            <h4 className="font-semibold mt-4 text-green-700">
                                Class Educators:
                            </h4>
                            {enrolledClass.educators && enrolledClass.educators.length > 0 ? (
                                <ul className="list-disc list-inside ml-6 space-y-1">
                                    {enrolledClass.educators.map((educator) => (
                                        <li key={educator.id}>
                                            {educator.firstName} {educator.lastName} ({educator.email})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 ml-6">
                                    No educators assigned to this class.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            You are not currently enrolled in a class.
                        </p>
                    )}
                </div>

                {/* Enrolled Subjects Section */}
                <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-purple-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
                        <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-purple-600"/>
                        My Enrolled Subjects
                    </h2>
                    {enrolledSubjects && enrolledSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledSubjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="border border-purple-200 p-5 rounded-lg shadow-sm bg-purple-50 hover:shadow-md transition-shadow duration-200"
                                >
                                    <h3 className="text-xl font-semibold text-purple-800 mb-2">
                                        {subject.subjectName}
                                    </h3>
                                    <p className="text-gray-700 text-sm">
                                        {subject.description || "No description available."}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        <strong className="text-purple-700">Educators:</strong>{" "}
                                        {getEducatorNames(subject.educators)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            You are not currently enrolled in any subjects.
                        </p>
                    )}
                </div>

                {/* Feedback Section */}
                <div className="bg-white p-8 rounded-xl shadow-2xl border border-yellow-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center">
                        <FontAwesomeIcon icon={faComments} className="mr-3 text-yellow-600"/>
                        My Feedback
                    </h2>
                    {feedback && feedback.length > 0 ? (
                        <div className="space-y-6">
                            {feedback.map((item) => (
                                <div
                                    key={item.id}
                                    className="border border-yellow-200 p-5 rounded-lg shadow-sm bg-yellow-50 hover:shadow-md transition-shadow duration-200"
                                >
                                    <p className="mb-1">
                                        <strong className="text-yellow-700">From Educator:</strong>{" "}
                                        {item.educatorFirstName} {item.educatorLastName}
                                    </p>
                                    <p className="mb-1">
                                        <strong className="text-yellow-700">Class:</strong>{" "}
                                        {item.className}
                                    </p>
                                    <p className="mb-1">
                                        <strong className="text-yellow-700">Rating:</strong>{" "}
                                        {item.rating}/5
                                    </p>
                                    <p className="mt-3 text-gray-800 italic">
                                        "{item.feedbackText}"
                                    </p>
                                    <p className="text-xs text-gray-500 mt-3 text-right">
                                        Date: {new Date(item.feedbackDate).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            No feedback available yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;