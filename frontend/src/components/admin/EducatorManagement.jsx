// src/components/admin/EducatorManagement.jsx
import React, {useState, useEffect, useCallback} from "react";
import api from "../../services/api"; // Your Axios instance
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faTrash,
    faPlus,
    faEye,
    faEraser, // Added for "Clear Image"
    faUserCircle,
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
    faChalkboardTeacher, faEnvelope, // For classes in view modal
} from "@fortawesome/free-solid-svg-icons"; // Added more icons
import Modal from "../common/Modal"; // Reusing the Modal component

const EducatorManagement = () => {
    const [educators, setEducators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // States for dynamic dropdowns (Classes and Subjects)
    const [allClasses, setAllClasses] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);

    // State for Create/Edit Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEducator, setCurrentEducator] = useState(null); // Null for create, object for edit
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        educatorHindiName: "", // New Field
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        alternatePhoneNumber: "", // New Field
        addressLine1: "", // New Field
        addressLine2: "", // New Field
        city: "", // New Field
        state: "", // New Field
        pincode: "", // New Field
        country: "", // New Field
        nationality: "", // New Field
        hireDate: "",
        qualification: "",
        experienceYears: "",
        designation: "", // New Field
        aadharNumber: "", // New Field
        accountNumber: "", // New Field
        classIds: [], // List of class IDs
        subjectId: "", // Single subject ID
    });
    const [profileImage, setProfileImage] = useState(null); // File object for upload
    const [profileImageUrlPreview, setProfileImageUrlPreview] = useState(""); // For displaying current/new image
    const [clearProfileImage, setClearProfileImage] = useState(false); // New state to explicitly clear image

    // State for View Details Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [educatorDetails, setEducatorDetails] = useState(null);

    // Helper for consistent detail display in modals
    const DetailItem = ({icon, label, value}) => (
        <p className="flex items-center text-gray-700">
            <strong className="text-blue-700 flex-shrink-0 mr-2">
                <FontAwesomeIcon icon={icon}/> {label}:
            </strong>{" "}
            <span className="flex-grow">{value || "N/A"}</span>
        </p>
    );

    // Helper to get subject name from ID
    const getSubjectName = useCallback((subjectId) => {
        const subject = allSubjects.find((s) => s.id === subjectId);
        return subject ? subject.subjectName : "N/A";
    }, [allSubjects]);

    // Helper to get class names from IDs
    const getClassNames = useCallback((classIds) => {
        if (!classIds || classIds.length === 0) return "N/A";
        return classIds
            .map((id) => {
                const clazz = allClasses.find((c) => c.id === id);
                return clazz ? `${clazz.className} (${clazz.classCode})` : null;
            })
            .filter(Boolean) // Remove nulls
            .join(", ");
    }, [allClasses]);

    // --- Fetch Educators ---
    const fetchEducators = async (currentPage = page) => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/admin/educators`, {
                params: {page: currentPage, size},
            });
            setEducators(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("Error fetching educators:", err);
            setError("Failed to fetch educators. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Fetch Classes and Subjects for dropdowns ---
    const fetchClassesAndSubjects = async () => {
        try {
            const [classesResponse, subjectsResponse] = await Promise.all([
                api.get("/admin/classes", {params: {page: 0, size: 1000}}), // Fetch all classes
                api.get("/admin/subjects", {params: {page: 0, size: 1000}}), // Fetch all subjects
            ]);
            setAllClasses(classesResponse.data.content);
            setAllSubjects(subjectsResponse.data.content);
        } catch (err) {
            console.error("Error fetching classes or subjects for dropdowns:", err);
            // Log the error but don't block the main component loading
        }
    };

    useEffect(() => {
        fetchEducators();
        fetchClassesAndSubjects(); // Fetch classes and subjects on component mount
    }, [page, size]); // Refetch educators when page or size changes

    // --- Handle Form Changes ---
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            setProfileImageUrlPreview(URL.createObjectURL(file));
            setClearProfileImage(false); // If new image selected, don't clear
        } else {
            setProfileImageUrlPreview(currentEducator?.profileImageUrl || "");
        }
    };

    const handleClearImageCheckboxChange = (e) => {
        setClearProfileImage(e.target.checked);
        if (e.target.checked) {
            setProfileImage(null); // Clear file input if checkbox is checked
            setProfileImageUrlPreview(""); // Clear preview
        } else {
            // If unchecking, restore original preview if in edit mode
            setProfileImageUrlPreview(currentEducator?.profileImageUrl || "");
        }
    };

    const handleClassIdsChange = (e) => {
        const {options} = e.target;
        const selectedClasses = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedClasses.push(Number(options[i].value)); // Convert to number
            }
        }
        setFormData((prev) => ({...prev, classIds: selectedClasses}));
    };

    // --- Open Modals ---
    const handleAddEducator = () => {
        setCurrentEducator(null); // Clear for new educator
        setFormData({
            // Reset form data to initial empty/default values
            username: "",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            educatorHindiName: "",
            dateOfBirth: "",
            gender: "",
            phoneNumber: "",
            alternatePhoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            nationality: "",
            hireDate: "",
            qualification: "",
            experienceYears: "",
            designation: "",
            aadharNumber: "",
            accountNumber: "",
            classIds: [],
            subjectId: "",
        });
        setProfileImage(null);
        setProfileImageUrlPreview("");
        setClearProfileImage(false); // Reset clear image state
        setIsModalOpen(true);
    };

    const handleEditEducator = (educator) => {
        setCurrentEducator(educator);
        setFormData({
            username: educator.username,
            email: educator.email,
            password: "", // Don't pre-fill password for security
            firstName: educator.firstName,
            lastName: educator.lastName,
            educatorHindiName: educator.educatorHindiName || "", // New Field
            dateOfBirth: educator.dateOfBirth || "",
            gender: educator.gender || "",
            phoneNumber: educator.phoneNumber || "",
            alternatePhoneNumber: educator.alternatePhoneNumber || "", // New Field
            addressLine1: educator.addressLine1 || "", // New Field
            addressLine2: educator.addressLine2 || "", // New Field
            city: educator.city || "", // New Field
            state: educator.state || "", // New Field
            pincode: educator.pincode || "", // New Field
            country: educator.country || "", // New Field
            nationality: educator.nationality || "", // New Field
            hireDate: educator.hireDate || "",
            qualification: educator.qualification || "",
            experienceYears: educator.experienceYears || "",
            designation: educator.designation || "", // New Field
            aadharNumber: educator.aadharNumber || "", // New Field
            accountNumber: educator.accountNumber || "", // New Field
            classIds: educator.classIds || [],
            subjectId: educator.subjectId || "",
        });
        setProfileImage(null); // Clear file input
        setProfileImageUrlPreview(educator.profileImageUrl || ""); // Show existing image
        setClearProfileImage(false); // Reset clear image state
        setIsModalOpen(true);
    };

    const handleViewEducator = async (id) => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(`/admin/educators/${id}`);
            setEducatorDetails(response.data);
            setIsViewModalOpen(true);
        } catch (err) {
            console.error("Error fetching educator details:", err);
            setError("Failed to fetch educator details.");
        } finally {
            setLoading(false);
        }
    };

    // --- Submit Create/Update ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const isCreating = currentEducator === null;
        const formDataToSend = new FormData();

        // Prepare educator DTO
        const educatorDto = {...formData};
        if (!isCreating) {
            delete educatorDto.password; // Don't send empty password on update
        }
        // Ensure subjectId is null if empty string
        if (educatorDto.subjectId === "") {
            educatorDto.subjectId = null;
        }
        // Ensure classIds is an empty array if null
        if (educatorDto.classIds === null) {
            educatorDto.classIds = [];
        }

        // Handle profile image logic for DTO
        if (clearProfileImage) {
            // If user explicitly wants to clear image, set URL to null in DTO
            educatorDto.profileImageUrl = null;
        } else if (!profileImage && currentEducator && currentEducator.profileImageUrl) {
            // If no new image selected AND not clearing AND there was an existing image,
            // retain the existing image URL in the DTO.
            educatorDto.profileImageUrl = currentEducator.profileImageUrl;
        } else if (!profileImage && !currentEducator) {
            // If creating and no image selected, ensure it's null
            educatorDto.profileImageUrl = null;
        }
        // If profileImage is set (new file selected), it will be handled by MultipartFile on backend
        // and the profileImageUrl in DTO will be ignored or overwritten by the backend.

        formDataToSend.append(
            "educator",
            new Blob([JSON.stringify(educatorDto)], {type: "application/json"})
        );

        // Append profile image file if selected
        if (profileImage) {
            formDataToSend.append("profileImage", profileImage);
        }

        try {
            if (isCreating) {
                await api.post("/admin/educators", formDataToSend, {
                    headers: {"Content-Type": "multipart/form-data"},
                });
                console.log("Educator created successfully");
            } else {
                await api.put(
                    `/admin/educators/${currentEducator.id}`,
                    formDataToSend,
                    {
                        headers: {"Content-Type": "multipart/form-data"},
                    }
                );
                console.log("Educator updated successfully");
            }
            setIsModalOpen(false);
            fetchEducators(); // Refresh list
        } catch (err) {
            console.error(
                "Error saving educator:",
                err.response?.data || err.message
            );
            setError(
                "Failed to save educator: " +
                (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // --- Delete Educator ---
    const handleDeleteEducator = async (id) => {
        if (window.confirm("Are you sure you want to delete this educator?")) {
            setLoading(true);
            setError("");
            try {
                await api.delete(`/admin/educators/${id}`);
                console.log("Educator deleted successfully");
                fetchEducators(); // Refresh list
            } catch (err) {
                console.error("Error deleting educator:", err);
                setError("Failed to delete educator.");
            } finally {
                setLoading(false);
            }
        }
    };

    // --- Pagination Handlers ---
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (loading && educators.length === 0) {
        return <div className="text-center py-8 text-blue-600 text-xl">Loading educators...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Manage Educators</h2>
                <button
                    onClick={handleAddEducator}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md transition duration-200 transform hover:scale-105"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2"/> Add New Educator
                </button>
            </div>

            {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}

            {educators.length === 0 && !loading ? (
                <p className="text-center text-gray-600 py-4">No educators found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Image</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Username</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Subject</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Designation</th>
                            {/* Added */}
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Classes</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {educators.map((educator) => (
                            <tr key={educator.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="py-4 px-6 whitespace-nowrap">
                                    {educator.profileImageUrl ? (
                                        <img
                                            src={`${api.defaults.baseURL}${educator.profileImageUrl}`}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
                                            N/A
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{educator.username}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{`${educator.firstName} ${educator.lastName}`}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{educator.email}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{getSubjectName(educator.subjectId)}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{educator.designation || 'N/A'}</td>
                                {/* Added */}
                                <td className="py-4 px-6 whitespace-nowrap text-gray-800">{getClassNames(educator.classIds)}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleViewEducator(educator.id)}
                                        className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-200"
                                        title="View Details"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="text-lg"/>
                                    </button>
                                    <button
                                        onClick={() => handleEditEducator(educator)}
                                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                                        title="Edit"
                                    >
                                        <FontAwesomeIcon icon={faEdit} className="text-lg"/>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEducator(educator.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                        title="Delete"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-lg"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-3">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0 || loading}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
            Page {page + 1} of {totalPages}
          </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1 || loading}
                        className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 shadow-md"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Create/Edit Educator Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentEducator ? "Edit Educator" : "Add New Educator"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Account Details */}
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username"
                                   className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text" id="username" name="username" value={formData.username}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {!currentEducator && ( // Password field only for new educator creation
                            <div>
                                <label htmlFor="password"
                                       className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password" id="password" name="password" value={formData.password}
                                    onChange={handleChange}
                                    required={!currentEducator}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Personal Details */}
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First
                                Name</label>
                            <input
                                type="text" id="firstName" name="firstName" value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last
                                Name</label>
                            <input
                                type="text" id="lastName" name="lastName" value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="educatorHindiName" className="block text-sm font-medium text-gray-700">Hindi
                                Name</label>
                            <input
                                type="text" id="educatorHindiName" name="educatorHindiName"
                                value={formData.educatorHindiName} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of
                                Birth</label>
                            <input
                                type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select
                                id="gender" name="gender" value={formData.gender} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone
                                Number</label>
                            <input
                                type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="alternatePhoneNumber" className="block text-sm font-medium text-gray-700">Alternate
                                Phone Number</label>
                            <input
                                type="text" id="alternatePhoneNumber" name="alternatePhoneNumber"
                                value={formData.alternatePhoneNumber} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality"
                                   className="block text-sm font-medium text-gray-700">Nationality</label>
                            <input
                                type="text" id="nationality" name="nationality" value={formData.nationality}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Address Details */}
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address
                                Line 1</label>
                            <input
                                type="text" id="addressLine1" name="addressLine1" value={formData.addressLine1}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address
                                Line 2</label>
                            <input
                                type="text" id="addressLine2" name="addressLine2" value={formData.addressLine2}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text" id="city" name="city" value={formData.city} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text" id="state" name="state" value={formData.state} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                            <input
                                type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text" id="country" name="country" value={formData.country} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Professional Details */}
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Professional
                        Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire
                                Date</label>
                            <input
                                type="date" id="hireDate" name="hireDate" value={formData.hireDate}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="qualification"
                                   className="block text-sm font-medium text-gray-700">Qualification</label>
                            <input
                                type="text" id="qualification" name="qualification" value={formData.qualification}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">Experience
                                (Years)</label>
                            <input
                                type="number" id="experienceYears" name="experienceYears"
                                value={formData.experienceYears} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="designation"
                                   className="block text-sm font-medium text-gray-700">Designation</label>
                            <input
                                type="text" id="designation" name="designation" value={formData.designation}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Subject
                                Taught</label>
                            <select
                                id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Subject</option>
                                {allSubjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.subjectName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="classIds" className="block text-sm font-medium text-gray-700">Classes
                                (Select multiple)</label>
                            <select
                                multiple={true} id="classIds" name="classIds" value={formData.classIds}
                                onChange={handleClassIdsChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 h-32 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {allClasses.map((clazz) => (
                                    <option key={clazz.id} value={clazz.id}>
                                        {clazz.className} ({clazz.classCode})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Identification & Bank Details */}
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Identification & Bank
                        Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700">Aadhar
                                Number</label>
                            <input
                                type="text" id="aadharNumber" name="aadharNumber" value={formData.aadharNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account
                                Number</label>
                            <input
                                type="text" id="accountNumber" name="accountNumber" value={formData.accountNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Profile Image Section */}
                    <div className="border-t pt-4 mt-4">
                        <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">Profile
                            Image</label>
                        <input
                            type="file" id="profileImage" name="profileImage" accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            disabled={clearProfileImage} // Disable if clear image is checked
                        />
                        {(profileImageUrlPreview || (currentEducator && currentEducator.profileImageUrl && !clearProfileImage)) && (
                            <img
                                src={
                                    profileImageUrlPreview.startsWith("blob:")
                                        ? profileImageUrlPreview
                                        : `${api.defaults.baseURL}${profileImageUrlPreview}`
                                }
                                alt="Profile Preview"
                                className="mt-3 w-28 h-28 object-cover rounded-full border-2 border-gray-300 shadow-sm"
                            />
                        )}
                        {currentEducator && currentEducator.profileImageUrl && (
                            <div className="mt-3 flex items-center">
                                <input
                                    type="checkbox" id="clearProfileImage" checked={clearProfileImage}
                                    onChange={handleClearImageCheckboxChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="clearProfileImage"
                                       className="ml-2 text-sm text-gray-700 flex items-center">
                                    <FontAwesomeIcon icon={faEraser} className="mr-1 text-red-500"/> Clear existing
                                    image
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button" onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Educator"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Educator Details"
            >
                {educatorDetails ? (
                    <div className="space-y-6 text-gray-800 text-base font-sans">
                        {educatorDetails.profileImageUrl && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={`${api.defaults.baseURL}${educatorDetails.profileImageUrl}`}
                                    alt="Profile"
                                    className="w-36 h-36 rounded-full object-cover border-4 border-emerald-400 shadow-lg transform transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        )}

                        {/* Personal Details Section */}
                        <div className="bg-emerald-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-700 mb-3 border-b pb-2 border-emerald-200">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">ID:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.id || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Username:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.username || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Name:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {`${educatorDetails.firstName} ${educatorDetails.lastName}` || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Hindi Name:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.educatorHindiName || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Email:</strong>
                                    <a href={`mailto:${educatorDetails.email}`}
                                       className="text-blue-600 hover:underline text-base break-words">
                                        {educatorDetails.email || "N/A"}
                                    </a>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Date of Birth:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.dateOfBirth || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Gender:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.gender || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Phone Number:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.phoneNumber || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Alternate Phone:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.alternatePhoneNumber || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Nationality:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.nationality || "N/A"}
                        </span>
                                </p>
                            </div>
                        </div>

                        {/* Address Details Section */}
                        <div className="bg-orange-50 p-4 rounded-lg shadow-sm mt-6">
                            <h3 className="text-lg font-bold text-orange-700 mb-3 border-b pb-2 border-orange-200">
                                Address Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Address Line 1:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.addressLine1 || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Address Line 2:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.addressLine2 || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">City:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.city || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">State:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.state || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Pincode:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.pincode || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Country:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.country || "N/A"}
                        </span>
                                </p>
                            </div>
                        </div>

                        {/* Professional Details Section */}
                        <div className="bg-blue-50 p-4 rounded-lg shadow-sm mt-6">
                            <h3 className="text-lg font-bold text-blue-700 mb-3 border-b pb-2 border-blue-200">
                                Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Hire Date:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.hireDate || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Qualification:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.qualification || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Experience (Years):</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.experienceYears || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Designation:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.designation || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Subject Taught:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {getSubjectName(educatorDetails.subjectId) || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Classes:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {getClassNames(educatorDetails.classIds) || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Role:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.role || "N/A"}
                        </span>
                                </p>
                            </div>
                        </div>

                        {/* Identification & Bank Details Section */}
                        <div className="bg-purple-50 p-4 rounded-lg shadow-sm mt-6">
                            <h3 className="text-lg font-bold text-purple-700 mb-3 border-b pb-2 border-purple-200">
                                Identification & Bank
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Aadhar Number:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.aadharNumber || "N/A"}
                        </span>
                                </p>
                                <p className="flex flex-col">
                                    <strong className="text-gray-600 text-sm mb-0.5">Account Number:</strong>
                                    <span className="text-gray-900 text-base break-words">
                            {educatorDetails.accountNumber || "N/A"}
                        </span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 py-8">Loading educator details...</p>
                )}
            </Modal>
        </div>
    );
};

export default EducatorManagement;