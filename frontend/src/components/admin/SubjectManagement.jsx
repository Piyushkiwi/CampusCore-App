// src/components/admin/SubjectManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api"; // Your Axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modal"; // Reusing the Modal component

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // States for dynamic dropdowns (Educators and Students)
  const [allEducators, setAllEducators] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null); // Null for create, object for edit
  const [formData, setFormData] = useState({
    subjectName: "",
    description: "",
    educatorIds: [], // List of educator IDs
    studentIds: [], // List of student IDs
  });

  // State for View Details Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [subjectDetails, setSubjectDetails] = useState(null);

  // Helper to get educator names from IDs
  const getEducatorNames = useCallback((educatorIds) => {
    if (!educatorIds || educatorIds.length === 0) return "N/A";
    return educatorIds
      .map((id) => {
        const educator = allEducators.find((e) => e.id === id);
        return educator ? `${educator.firstName} ${educator.lastName}` : null;
      })
      .filter(Boolean) // Remove nulls
      .join(", ");
  }, [allEducators]);

  // Helper to get student names from IDs
  const getStudentNames = useCallback((studentIds) => {
    if (!studentIds || studentIds.length === 0) return "N/A";
    return studentIds
      .map((id) => {
        const student = allStudents.find((s) => s.id === id);
        return student ? `${student.firstName} ${student.lastName}` : null;
      })
      .filter(Boolean) // Remove nulls
      .join(", ");
  }, [allStudents]);

  // --- Fetch Subjects ---
  const fetchSubjects = async (currentPage = page) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/subjects`, {
        params: { page: currentPage, size },
      });
      setSubjects(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to fetch subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Educators and Students for dropdowns ---
  const fetchEducatorsAndStudents = async () => {
    try {
      const [educatorsResponse, studentsResponse] = await Promise.all([
        api.get("/admin/educators", { params: { page: 0, size: 1000 } }), // Fetch all educators
        api.get("/admin/students", { params: { page: 0, size: 1000 } }), // Fetch all students
      ]);
      setAllEducators(educatorsResponse.data.content);
      setAllStudents(studentsResponse.data.content);
    } catch (err) {
      console.error("Error fetching educators or students for dropdowns:", err);
      // Log the error but don't block the main component loading
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchEducatorsAndStudents(); // Fetch educators and students on component mount
  }, [page, size]); // Refetch subjects when page or size changes

  // --- Handle Form Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducatorIdsChange = (e) => {
    const { options } = e.target;
    const selectedEducators = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedEducators.push(Number(options[i].value)); // Convert to number
      }
    }
    setFormData((prev) => ({ ...prev, educatorIds: selectedEducators }));
  };

  const handleStudentIdsChange = (e) => {
    const { options } = e.target;
    const selectedStudents = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedStudents.push(Number(options[i].value)); // Convert to number
      }
    }
    setFormData((prev) => ({ ...prev, studentIds: selectedStudents }));
  };

  // --- Open Modals ---
  const handleAddSubject = () => {
    setCurrentSubject(null); // Clear for new subject
    setFormData({
      // Reset form data
      subjectName: "",
      description: "",
      educatorIds: [],
      studentIds: [],
    });
    setIsModalOpen(true);
  };

  const handleEditSubject = (subject) => {
    setCurrentSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      description: subject.description || "",
      educatorIds: subject.educatorIds || [],
      studentIds: subject.studentIds || [],
    });
    setIsModalOpen(true);
  };

  const handleViewSubject = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/admin/subjects/${id}`);
      setSubjectDetails(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error("Error fetching subject details:", err);
      setError("Failed to fetch subject details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Submit Create/Update ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isCreating = currentSubject === null;

    const subjectDto = { ...formData };
    // Ensure IDs are empty arrays if null
    if (subjectDto.educatorIds === null) {
      subjectDto.educatorIds = [];
    }
    if (subjectDto.studentIds === null) {
      subjectDto.studentIds = [];
    }

    try {
      if (isCreating) {
        await api.post("/admin/subjects", subjectDto); // SubjectDto is JSON, no multipart
        console.log("Subject created successfully");
      } else {
        await api.put(`/admin/subjects/${currentSubject.id}`, subjectDto); // SubjectDto is JSON, no multipart
        console.log("Subject updated successfully");
      }
      setIsModalOpen(false);
      fetchSubjects(); // Refresh list
    } catch (err) {
      console.error("Error saving subject:", err.response?.data || err.message);
      setError(
        "Failed to save subject: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Subject ---
  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setLoading(true);
      setError("");
      try {
        await api.delete(`/admin/subjects/${id}`);
        console.log("Subject deleted successfully");
        fetchSubjects(); // Refresh list
      } catch (err) {
        console.error("Error deleting subject:", err);
        setError("Failed to delete subject.");
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

  if (loading && subjects.length === 0) {
    return <div className="text-center py-8 text-blue-600 text-xl">Loading subjects...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Manage Subjects</h2>
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center shadow-md transition duration-200 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Subject
        </button>
      </div>

      {error && <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>}

      {subjects.length === 0 && !loading ? (
        <p className="text-center text-gray-600 py-4">No subjects found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Subject Name</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Educators</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Students</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6 whitespace-nowrap text-gray-800">{subject.subjectName}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-gray-800">{subject.description || "N/A"}</td>
                  <td className="py-4 px-6 text-gray-800">{getEducatorNames(subject.educatorIds)}</td>
                  <td className="py-4 px-6 text-gray-800">{getStudentNames(subject.studentIds)}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewSubject(subject.id)}
                      className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-200"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleEditSubject(subject)}
                      className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" />
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

      {/* Create/Edit Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSubject ? "Edit Subject" : "Add New Subject"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="subjectName"
              className="block text-sm font-medium text-gray-700"
            >
              Subject Name
            </label>
            <input
              type="text"
              id="subjectName"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="educatorIds"
              className="block text-sm font-medium text-gray-700"
            >
              Assigned Educators (Select multiple)
            </label>
            <select
              multiple={true}
              id="educatorIds"
              name="educatorIds"
              value={formData.educatorIds}
              onChange={handleEducatorIdsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 h-32 focus:ring-blue-500 focus:border-blue-500"
            >
              {allEducators.map((educator) => (
                <option key={educator.id} value={educator.id}>
                  {educator.firstName} {educator.lastName} ({educator.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="studentIds"
              className="block text-sm font-medium text-gray-700"
            >
              Enrolled Students (Select multiple)
            </label>
            <select
              multiple={true}
              id="studentIds"
              name="studentIds"
              value={formData.studentIds}
              onChange={handleStudentIdsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 h-32 focus:ring-blue-500 focus:border-blue-500"
            >
              {allStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Subject"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Subject Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Subject Details"
      >
        {subjectDetails ? (
          <div className="space-y-4 text-gray-700 text-base">
            <p>
              <strong>ID:</strong> {subjectDetails.id}
            </p>
            <p>
              <strong>Subject Name:</strong> {subjectDetails.subjectName}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {subjectDetails.description || "N/A"}
            </p>
            <h4 className="font-semibold mt-4 text-gray-800">Assigned Educators:</h4>
            {subjectDetails.educators && subjectDetails.educators.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {subjectDetails.educators.map((educator) => (
                  <li key={educator.id}>
                    {educator.firstName} {educator.lastName} ({educator.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-4 text-gray-600">No educators assigned.</p>
            )}
            <h4 className="font-semibold mt-4 text-gray-800">Enrolled Students:</h4>
            {subjectDetails.students && subjectDetails.students.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                {subjectDetails.students.map((student) => (
                  <li key={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ml-4 text-gray-600">No students enrolled.</p>
            )}
          </div>
        ) : (
          <p>Loading subject details...</p>
        )}
      </Modal>
    </div>
  );
};

export default SubjectManagement;
