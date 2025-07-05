// src/components/admin/NewsManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Your Axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faTimes, faSave, faCalendarAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable NewsCard component for better readability (Optional)
const NewsCard = ({ newsItem, onEdit, onDelete, onView }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{newsItem.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
            {new Date(newsItem.publishDate).toLocaleDateString()}
        </p>
        <p className={`text-sm font-medium ${newsItem.published ? 'text-green-600' : 'text-yellow-600'}`}>
            {newsItem.published ? 'Published' : 'Draft'}
        </p>
        <div className="mt-4 flex justify-end space-x-2">
            <button
                onClick={() => onView(newsItem.id)}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                title="View Details"
            >
                <FontAwesomeIcon icon={faEye} />
            </button>
            <button
                onClick={() => onEdit(newsItem)}
                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                title="Edit News"
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
                onClick={() => onDelete(newsItem.id)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                title="Delete News"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    </div>
);


const NewsManagement = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(10); // Items per page
    const [totalPages, setTotalPages] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null); // null for create, object for edit
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        publishDate: '',
        published: false
    });
    const [formErrors, setFormErrors] = useState({});
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedNewsDetail, setSelectedNewsDetail] = useState(null);


    const fetchNews = async (pageNumber = page) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get(`/admin/news?page=${pageNumber}&size=${size}`);
            setNewsList(response.data.content);
            setTotalPages(response.data.totalPages);
            setPage(pageNumber);
        } catch (err) {
            console.error("Error fetching news:", err);
            setError("Failed to fetch news. Please try again.");
            toast.error("Failed to fetch news.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []); // Fetch news on component mount

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = "Title is required.";
        if (!formData.content.trim()) errors.content = "Content is required.";
        if (!formData.publishDate) errors.publishDate = "Publish date is required.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        if (!validateForm()) {
            toast.error("Please correct the form errors.");
            return;
        }

        try {
            const newsData = {
                ...formData,
                // Ensure publishDate is in ISO format for backend
                publishDate: formData.publishDate.endsWith('Z')
                    ? formData.publishDate
                    : `${formData.publishDate}:00` // Add seconds if not already present
            };

            if (editingNews) {
                await api.put(`/admin/news/${editingNews.id}`, newsData);
                toast.success("News updated successfully!");
            } else {
                await api.post("/admin/news", newsData);
                toast.success("News created successfully!");
            }
            setShowForm(false);
            setEditingNews(null);
            setFormData({ title: '', content: '', publishDate: '', published: false });
            fetchNews(); // Re-fetch to update the list
        } catch (err) {
            console.error("Error saving news:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to save news.";
            setFormErrors(err.response?.data || {}); // Set backend validation errors
            toast.error(errorMessage);
        }
    };

    const handleEditClick = (newsItem) => {
        setEditingNews(newsItem);
        // Format LocalDateTime to YYYY-MM-DDTHH:MM for datetime-local input
        const formattedDate = newsItem.publishDate ? newsItem.publishDate.substring(0, 16) : '';
        setFormData({
            title: newsItem.title,
            content: newsItem.content,
            publishDate: formattedDate,
            published: newsItem.published
        });
        setShowForm(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this news article?")) {
            try {
                await api.delete(`/admin/news/${id}`);
                toast.success("News deleted successfully!");
                fetchNews(); // Re-fetch to update the list
            } catch (err) {
                console.error("Error deleting news:", err);
                const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to delete news.";
                toast.error(errorMessage);
            }
        }
    };

    const handleViewClick = async (id) => {
        try {
            const response = await api.get(`/admin/news/${id}`);
            setSelectedNewsDetail(response.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching news detail:", err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to fetch news details.";
            toast.error(errorMessage);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingNews(null);
        setFormData({ title: '', content: '', publishDate: '', published: false });
        setFormErrors({});
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedNewsDetail(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">News Articles</h2>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingNews(null); // Reset for new creation
                        setFormData({ title: '', content: '', publishDate: '', published: false });
                        setFormErrors({});
                    }}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New News
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
                        <button
                            onClick={handleCancelForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingNews ? 'Edit News Article' : 'Create New News Article'}</h3>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-200 ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter news title"
                                />
                                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                            </div>
                            <div>
                                <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows="8"
                                    className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-200 ${formErrors.content ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter news content"
                                ></textarea>
                                {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                            </div>
                            <div>
                                <label htmlFor="publishDate" className="block text-gray-700 font-semibold mb-2">Publish Date</label>
                                <input
                                    type="datetime-local"
                                    id="publishDate"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleInputChange}
                                    className={`w-full p-3 border rounded-md focus:ring focus:ring-blue-200 ${formErrors.publishDate ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {formErrors.publishDate && <p className="text-red-500 text-sm mt-1">{formErrors.publishDate}</p>}
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="published"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="published" className="ml-2 block text-gray-700 font-semibold">Published</label>
                            </div>
                            {formErrors.error && <p className="text-red-500 text-sm mt-1 flex items-center"><FontAwesomeIcon icon={faInfoCircle} className="mr-2" />{formErrors.error}</p>}
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancelForm}
                                    className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" /> {editingNews ? 'Update News' : 'Create News'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showViewModal && selectedNewsDetail && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={handleCloseViewModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">{selectedNewsDetail.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 border-b pb-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                            Published On: {new Date(selectedNewsDetail.publishDate).toLocaleString()} | {' '}
                            Status: <span className={`font-semibold ${selectedNewsDetail.published ? 'text-green-600' : 'text-yellow-600'}`}>
                                {selectedNewsDetail.published ? 'Published' : 'Draft'}
                            </span>
                        </p>
                        <div className="prose max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedNewsDetail.content }}>
                            {/* Content is set via dangerouslySetInnerHTML to allow for rich text if needed later */}
                        </div>
                        <p className="text-xs text-gray-500 mt-6">Created At: {new Date(selectedNewsDetail.createdAt).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Last Updated: {new Date(selectedNewsDetail.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}


            {loading ? (
                <div className="text-center py-8 text-blue-600 text-xl">Loading news...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-600 text-xl font-semibold">Error: {error}</div>
            ) : (
                <>
                    {newsList.length === 0 ? (
                        <div className="text-center py-8 text-gray-600 text-lg">No news articles found. Start by adding a new one!</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newsList.map((newsItem) => (
                                <NewsCard
                                    key={newsItem.id}
                                    newsItem={newsItem}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                    onView={handleViewClick}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-2">
                            <button
                                onClick={() => fetchNews(page - 1)}
                                disabled={page === 0}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages).keys()].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => fetchNews(p)}
                                    className={`px-4 py-2 rounded-md ${page === p ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {p + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => fetchNews(page + 1)}
                                disabled={page === totalPages - 1}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NewsManagement;