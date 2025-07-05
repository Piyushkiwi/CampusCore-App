import React, {useState, useEffect, useCallback} from "react";
import api from "../services/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEye,
    faCommentMedical,
    faStar,
    faUserCircle,
    faChalkboardTeacher,
    faCalendarAlt,
    faPhone,
    faMapMarkerAlt,
    faVenusMars,
    faBook,
    faGraduationCap,
    faBuilding,
    faMapPin,
    faGlobe,
    faBriefcase,
    faIdCard,
    faCreditCard,
    faHome,
    faEnvelope,
    faUsers, // For Parent/Guardian
    faBirthdayCake, // For DOB
    faTags, // For category
    faPray, // For Religion
    faWheelchair, // For physical handicapped
    faIdBadge, faComments, // For Roll Number (student)
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/common/Modal"; // Reusing the Modal component

const EducatorDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [classesTaught, setClassesTaught] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [studentsInClass, setStudentsInClass] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination for students in class
    const [studentPage, setStudentPage] = useState(0);
    const [studentSize] = useState(10); // Changed to a fixed size
    const [studentTotalPages, setStudentTotalPages] = useState(0);

    // State for Student Details Modal
    const [isStudentDetailModalOpen, setIsStudentDetailModalOpen] =
        useState(false);
    const [currentStudentDetail, setCurrentStudentDetail] = useState(null);

    // State for Feedback Modal
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedbackStudent, setFeedbackStudent] = useState(null); // Student for whom feedback is being given
    const [feedbackFormData, setFeedbackFormData] = useState({
        feedbackText: "",
        rating: 0,
    });
    const [existingFeedback, setExistingFeedback] = useState([]); // Feedback given by this educator to this student in this class

    // Helper to get class name from ID (for student detail modal)
    const getClassName = useCallback(
        (classId) => {
            const clazz = classesTaught.find((c) => c.id === classId);
            return clazz ? `${clazz.className} (${clazz.classCode})` : "N/A";
        },
        [classesTaught]
    );

    // Helper to get subject names from IDs (for student detail modal)
    // NOTE: This will only work if currentStudentDetail.subjectIds can be resolved
    // to actual names. You might need a way to fetch all subjects for this to work accurately.
    const getSubjectNames = useCallback((subjectIds) => {
        if (!subjectIds || subjectIds.length === 0) return "N/A";
        // Assuming subjectIds are just names for now, or if you have a way to resolve them.
        // If you need to fetch all subjects like in StudentDashboard, add that logic.
        return subjectIds.join(", "); // Currently just joins IDs
    }, []);

    // --- Components for consistent styling ---

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

    // --- Fetch Educator Data (Profile and Classes) ---
    const fetchEducatorData = async () => {
        setLoading(true);
        setError("");
        try {
            const [profileResponse, classesResponse] = await Promise.all([
                api.get("/educator/profile"),
                api.get("/educator/classes"),
            ]);
            setProfile(profileResponse.data);
            setClassesTaught(classesResponse.data);
            if (classesResponse.data.length > 0) {
                setSelectedClassId(classesResponse.data[0].id); // Automatically select the first class
            }
        } catch (err) {
            console.error("Error fetching educator dashboard data:", err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Fetch Students in Selected Class ---
    const fetchStudentsInClass = useCallback(
        async (classId, pageNum = studentPage) => {
            if (!classId) {
                setStudentsInClass([]);
                setStudentTotalPages(0);
                return;
            }
            setLoading(true);
            setError("");
            try {
                const response = await api.get(
                    `/educator/classes/${classId}/students`,
                    {
                        params: {page: pageNum, size: studentSize},
                    }
                );
                setStudentsInClass(response.data.content);
                setStudentTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(`Error fetching students for class ${classId}:`, err);
                setError("Failed to fetch students for the selected class.");
                setStudentsInClass([]);
            } finally {
                setLoading(false);
            }
        },
        [studentPage, studentSize]
    );

    useEffect(() => {
        fetchEducatorData();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudentsInClass(selectedClassId);
        }
    }, [selectedClassId, fetchStudentsInClass]);

    // --- Handlers ---
    const handleClassChange = (e) => {
        setSelectedClassId(Number(e.target.value));
        setStudentPage(0); // Reset student pagination when class changes
    };

    const handleStudentPageChange = (newPage) => {
        if (newPage >= 0 && newPage < studentTotalPages) {
            setStudentPage(newPage);
        }
    };

    const handleViewStudentDetail = async (studentId) => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/educator/students/${studentId}`);
            setCurrentStudentDetail(response.data);
            setIsStudentDetailModalOpen(true);
        } catch (err) {
            console.error("Error fetching student detail:", err);
            setError("Failed to fetch student details.");
        } finally {
            setLoading(false);
        }
    };

    const handleGiveFeedback = async (student) => {
        setFeedbackStudent(student);
        setFeedbackFormData({feedbackText: "", rating: 0});
        setExistingFeedback([]); // Clear previous feedback

        if (selectedClassId && student.id) {
            try {
                const response = await api.get(
                    `/educator/students/${student.id}/classes/${selectedClassId}/feedback`
                );
                setExistingFeedback(response.data);
                // If there's existing feedback, pre-fill the form with the most recent one
                if (response.data.length > 0) {
                    const latestFeedback = response.data[0]; // Assuming latest is first or you sort
                    setFeedbackFormData({
                        feedbackText: latestFeedback.feedbackText,
                        rating: latestFeedback.rating,
                    });
                }
            } catch (err) {
                console.error("Error fetching existing feedback:", err);
                setError("Failed to load existing feedback.");
            }
        }
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackFormChange = (e) => {
        const {name, value} = e.target;
        setFeedbackFormData((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!feedbackStudent || !selectedClassId || !profile) {
            setError("Student, Class, or Educator profile not loaded for feedback.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...feedbackFormData,
                studentId: feedbackStudent.id,
                classId: selectedClassId,
                educatorId: profile.id, // Ensure educatorId is sent
            };
            await api.post(
                `/educator/students/${feedbackStudent.id}/classes/${selectedClassId}/feedback`,
                payload
            );
            console.log("Feedback submitted successfully");
            setIsFeedbackModalOpen(false);
            // Optionally, re-fetch students for the class or update the state if feedback count needs to reflect
            fetchStudentsInClass(selectedClassId, studentPage); // Re-fetch to update student data
        } catch (err) {
            console.error(
                "Error submitting feedback:",
                err.response?.data || err.message
            );
            setError(
                "Failed to submit feedback: " +
                (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 text-xl font-semibold">Loading educator dashboard...</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-4">
                        Educator Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your classes and students</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-xl mb-10 overflow-hidden border border-green-100">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <FontAwesomeIcon icon={faUserCircle} className="text-green-200"/>
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
                                                className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-full shadow-xl border-4 border-white ring-4 ring-green-200"
                                            />
                                        ) : (
                                            <div
                                                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold shadow-xl border-4 border-white ring-4 ring-green-200">
                                                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "E"}
                                            </div>
                                        )}
                                        <div
                                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-3 border-white flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info Card */}
                                <div className="flex-1">
                                    <div
                                        className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
                                        <div className="mb-4">
                                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                                                {profile.firstName} {profile.lastName}
                                                {profile.educatorHindiName && (
                                                    <span className="text-lg text-gray-600 font-normal ml-2">
                                                        ({profile.educatorHindiName})
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-teal-600 font-semibold text-lg">
                                                Designation: {profile.designation}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faEnvelope} className="text-teal-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Username</p>
                                                    <p className="font-semibold text-gray-800">{profile.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faPhone} className="text-teal-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Phone</p>
                                                    <p className="font-semibold text-gray-800">{profile.phoneNumber || "Not provided"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faBook} className="text-teal-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Subject Taught</p>
                                                    <p className="font-semibold text-gray-800">{profile.subjectName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="text-teal-600"/>
                                                <div>
                                                    <p className="text-sm text-gray-600">Hire Date</p>
                                                    <p className="font-semibold text-gray-800">{profile.hireDate}</p>
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
                                        icon={faUserCircle}
                                        title="Personal Information"
                                        subtitle="Basic personal details and demographics"
                                        color="green"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DetailItem icon={faBirthdayCake} label="Date of Birth"
                                                    value={profile.dateOfBirth}/>
                                        <DetailItem icon={faVenusMars} label="Gender" value={profile.gender}/>
                                        <DetailItem icon={faPhone} label="Alternate Phone"
                                                    value={profile.alternatePhoneNumber}/>
                                        <DetailItem icon={faGlobe} label="Nationality" value={profile.nationality}/>
                                        <DetailItem icon={faGraduationCap} label="Qualification"
                                                    value={profile.qualification}/>
                                        <DetailItem icon={faCalendarAlt} label="Experience Years"
                                                    value={profile.experienceYears}/>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <SectionHeader
                                        icon={faHome}
                                        title="Contact Information"
                                        subtitle="Address and location details"
                                        color="blue"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DetailItem
                                            icon={faMapMarkerAlt}
                                            label="Address Line 1"
                                            value={profile.addressLine1}
                                            className="md:col-span-2"
                                        />
                                        <DetailItem icon={faBuilding} label="Address Line 2"
                                                    value={profile.addressLine2}/>
                                        <DetailItem icon={faMapMarkerAlt} label="City" value={profile.city}/>
                                        <DetailItem icon={faMapMarkerAlt} label="State" value={profile.state}/>
                                        <DetailItem icon={faMapPin} label="Pincode" value={profile.pincode}/>
                                        <DetailItem icon={faGlobe} label="Country" value={profile.country}/>
                                    </div>
                                </div>

                                {/* Financial & Identification Details */}
                                <div>
                                    <SectionHeader
                                        icon={faCreditCard}
                                        title="Financial & Identification Details"
                                        subtitle="Bank and identification information"
                                        color="purple"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DetailItem icon={faIdCard} label="Aadhar Number"
                                                    value={profile.aadharNumber}/>
                                        <DetailItem icon={faCreditCard} label="Account Number"
                                                    value={profile.accountNumber}/>
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

                {/* Classes Taught Section */}
                <div className="bg-white p-8 rounded-xl shadow-2xl mb-10 border border-indigo-100">
                    <SectionHeader
                        icon={faChalkboardTeacher}
                        title="My Classes"
                        subtitle="View and manage students in your assigned classes"
                        color="indigo"
                    />
                    {classesTaught.length > 0 ? (
                        <div>
                            <label
                                htmlFor="selectClass"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Select a Class:
                            </label>
                            <select
                                id="selectClass"
                                value={selectedClassId}
                                onChange={handleClassChange}
                                className="mt-1 block w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-md shadow-sm p-2.5 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            >
                                {classesTaught.map((clazz) => (
                                    <option key={clazz.id} value={clazz.id}>
                                        {clazz.className} ({clazz.classCode})
                                    </option>
                                ))}
                            </select>

                            {selectedClassId && (
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                        <FontAwesomeIcon icon={faUsers} className="text-indigo-600"/>
                                        Students in{" "}
                                        <span className="text-indigo-700">
                                            {
                                                classesTaught.find((c) => c.id === selectedClassId)
                                                    ?.className
                                            }
                                        </span>
                                    </h3>
                                    {loading && studentsInClass.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div
                                                className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                                            <p className="text-indigo-600 text-lg">Loading students...</p>
                                        </div>
                                    ) : studentsInClass.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {studentsInClass.map((student) => (
                                                    <div
                                                        key={student.id}
                                                        className="border border-indigo-200 p-5 rounded-lg shadow-sm bg-indigo-50 hover:shadow-md transition-shadow duration-200 flex flex-col"
                                                    >
                                                        <h4 className="text-xl font-semibold text-indigo-800 mb-2">
                                                            {`${student.firstName} ${student.lastName}`}
                                                            {student.studentHindiName && (
                                                                <span
                                                                    className="text-base text-gray-600 font-normal ml-2">
                                                                    ({student.studentHindiName})
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className="text-gray-700 text-sm mb-1">
                                                            <strong className="text-indigo-700">Roll No:</strong>{" "}
                                                            {student.rollNumber || "N/A"}
                                                        </p>
                                                        <p className="text-gray-700 text-sm mb-1">
                                                            <strong className="text-indigo-700">Email:</strong>{" "}
                                                            {student.email}
                                                        </p>
                                                        <p className="text-gray-700 text-sm mb-3">
                                                            <strong className="text-indigo-700">Grade:</strong>{" "}
                                                            {student.grade || "N/A"}
                                                        </p>
                                                        <div
                                                            className="mt-auto flex justify-end space-x-3 pt-3 border-t border-indigo-100">
                                                            <button
                                                                onClick={() =>
                                                                    handleViewStudentDetail(student.id)
                                                                }
                                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md flex items-center gap-2 text-sm"
                                                                title="View Student Details"
                                                            >
                                                                <FontAwesomeIcon icon={faEye}/> View
                                                            </button>
                                                            <button
                                                                onClick={() => handleGiveFeedback(student)}
                                                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center gap-2 text-sm"
                                                                title="Give/Edit Feedback"
                                                            >
                                                                <FontAwesomeIcon icon={faCommentMedical}/> Feedback
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Student Pagination Controls */}
                                            {studentTotalPages > 1 && (
                                                <div className="flex justify-center items-center mt-8 space-x-4">
                                                    <button
                                                        onClick={() =>
                                                            handleStudentPageChange(studentPage - 1)
                                                        }
                                                        disabled={studentPage === 0 || loading}
                                                        className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg font-semibold"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-gray-700 font-medium text-lg">
                                                        Page {studentPage + 1} of {studentTotalPages}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleStudentPageChange(studentPage + 1)
                                                        }
                                                        disabled={
                                                            studentPage === studentTotalPages - 1 || loading
                                                        }
                                                        className="px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg font-semibold"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-600 text-center py-4">
                                            No students found in this class.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">
                            You are not currently assigned to any classes.
                        </p>
                    )}
                </div>

                {/* Student Detail Modal */}
                <Modal
                    isOpen={isStudentDetailModalOpen}
                    onClose={() => setIsStudentDetailModalOpen(false)}
                    title="Student Details"
                >
                    {currentStudentDetail ? (
                        <div className="p-4 space-y-6"> {/* Added padding to modal content */}
                            {/* Student Profile Image */}
                            {currentStudentDetail.profileImageUrl && (
                                <div className="flex justify-center mb-6">
                                    <img
                                        src={`${api.defaults.baseURL}${currentStudentDetail.profileImageUrl}`}
                                        alt="Student Profile"
                                        className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-blue-200"
                                    />
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={faUserCircle} label="Full Name"
                                            value={`${currentStudentDetail.firstName} ${currentStudentDetail.lastName} ${
                                                currentStudentDetail.studentHindiName ? `(${currentStudentDetail.studentHindiName})` : ""
                                            }`}/>
                                <DetailItem icon={faIdBadge} label="Roll Number"
                                            value={currentStudentDetail.rollNumber}/>
                                <DetailItem icon={faEnvelope} label="Email" value={currentStudentDetail.email}/>
                                <DetailItem icon={faPhone} label="Phone" value={currentStudentDetail.phoneNumber}/>
                            </div>

                            {/* Personal Information */}
                            <div>
                                <SectionHeader icon={faUserCircle} title="Personal Info" color="blue" subtitle=""/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem icon={faBirthdayCake} label="Date of Birth"
                                                value={currentStudentDetail.dateOfBirth}/>
                                    <DetailItem icon={faVenusMars} label="Gender" value={currentStudentDetail.gender}/>
                                    <DetailItem icon={faTags} label="Category" value={currentStudentDetail.category}/>
                                    <DetailItem icon={faPray} label="Religion" value={currentStudentDetail.religion}/>
                                    <DetailItem icon={faGlobe} label="Nationality"
                                                value={currentStudentDetail.nationality}/>
                                    <DetailItem icon={faWheelchair} label="Handicapped"
                                                value={currentStudentDetail.physicalHandicapped ? "Yes" : "No"}/>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div>
                                <SectionHeader icon={faGraduationCap} title="Academic Info" color="green" subtitle=""/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem icon={faGraduationCap} label="Grade"
                                                value={currentStudentDetail.grade}/>
                                    <DetailItem icon={faCalendarAlt} label="Enrollment Date"
                                                value={currentStudentDetail.enrollmentDate}/>
                                    <DetailItem icon={faChalkboardTeacher} label="Class"
                                                value={getClassName(currentStudentDetail.classId)}/>
                                    <DetailItem icon={faBook} label="Subjects"
                                                value={getSubjectNames(currentStudentDetail.subjectIds)}/>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <SectionHeader icon={faHome} title="Contact Info" color="indigo" subtitle=""/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem icon={faMapMarkerAlt} label="Address Line 1"
                                                value={currentStudentDetail.addressLine1}/>
                                    <DetailItem icon={faBuilding} label="Address Line 2"
                                                value={currentStudentDetail.addressLine2}/>
                                    <DetailItem icon={faMapMarkerAlt} label="City" value={currentStudentDetail.city}/>
                                    <DetailItem icon={faMapMarkerAlt} label="State"
                                                value={currentStudentDetail.state}/>
                                    <DetailItem icon={faMapPin} label="Pincode"
                                                value={currentStudentDetail.pincode}/>
                                    <DetailItem icon={faGlobe} label="Country"
                                                value={currentStudentDetail.country}/>
                                </div>
                            </div>

                            {/* Parent/Guardian Information */}
                            <div>
                                <SectionHeader icon={faUsers} title="Parent/Guardian Info" color="orange" subtitle=""/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DetailItem icon={faUserCircle} label="Father's Name"
                                                value={currentStudentDetail.fatherName}/>
                                    <DetailItem icon={faPhone} label="Father's Phone"
                                                value={currentStudentDetail.fatherMobileNumber}/>
                                    <DetailItem icon={faUserCircle} label="Mother's Name"
                                                value={currentStudentDetail.motherName}/>
                                    <DetailItem icon={faPhone} label="Mother's Phone"
                                                value={currentStudentDetail.motherMobileNumber}/>
                                    <DetailItem icon={faPhone} label="Local Contact"
                                                value={currentStudentDetail.localMobileNumber}/>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">Loading student details...</p>
                    )}
                </Modal>

                {/* Feedback Modal */}
                <Modal
                    isOpen={isFeedbackModalOpen}
                    onClose={() => setIsFeedbackModalOpen(false)}
                    title={`Feedback for ${feedbackStudent?.firstName} ${feedbackStudent?.lastName}`}
                >
                    <form onSubmit={handleFeedbackSubmit} className="space-y-6 p-4"> {/* Added padding to modal form */}
                        <div>
                            <label
                                htmlFor="feedbackText"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Feedback Text
                            </label>
                            <textarea
                                id="feedbackText"
                                name="feedbackText"
                                value={feedbackFormData.feedbackText}
                                onChange={handleFeedbackFormChange}
                                rows="5"
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter your feedback here..."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label
                                htmlFor="rating"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Rating (1-5)
                            </label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={`cursor-pointer text-3xl transition-colors duration-200 ${
                                            feedbackFormData.rating >= star
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                        onClick={() =>
                                            setFeedbackFormData((prev) => ({...prev, rating: star}))
                                        }
                                    />
                                ))}
                                <span className="ml-3 text-lg font-semibold text-gray-800">
                                    {feedbackFormData.rating} / 5
                                </span>
                            </div>
                        </div>
                        {error && <p className="text-red-600 text-sm italic mb-2 text-center">{error}</p>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsFeedbackModalOpen(false)}
                                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md font-semibold"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </div>
                    </form>

                    {existingFeedback.length > 0 && (
                        <div className="mt-8 border-t pt-6">
                            <SectionHeader icon={faComments} title="Previous Feedback" color="yellow" subtitle=""/>
                            <div className="space-y-4">
                                {existingFeedback.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-yellow-200 p-5 rounded-lg shadow-sm bg-yellow-50 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <p className="mb-2">
                                            <strong className="text-yellow-700">Rating:</strong>{" "}
                                            {item.rating}/5{" "}
                                            {[...Array(item.rating)].map((_, i) => (
                                                <FontAwesomeIcon
                                                    key={i}
                                                    icon={faStar}
                                                    className="text-yellow-500 ml-1"
                                                />
                                            ))}
                                        </p>
                                        <p className="mt-2 text-gray-800 italic">"{item.feedbackText}"</p>
                                        <p className="text-xs text-gray-500 mt-3 text-right">
                                            Date: {new Date(item.feedbackDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default EducatorDashboard;