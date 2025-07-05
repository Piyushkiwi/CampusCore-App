import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js'; // Import your configured Axios instance
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const NewsDetailPage = () => {
    const { id } = useParams(); // Get the news ID from the URL
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                // Use your configured 'api' instance
                const response = await api.get(`/public/news/${id}`); // Call your public endpoint
                setNews(response.data);
            } catch (err) {
                console.error("Error fetching news detail:", err);
                if (err.response && err.response.status === 404) {
                    setError("News not found or is no longer published.");
                } else {
                    setError("Failed to load news. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
                    <div className="flex items-center justify-center mb-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    </div>
                    <p className="text-xl text-gray-700 font-medium">Loading news article...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30 text-center max-w-2xl">
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 rounded-full w-20 h-20 mx-auto mb-8 shadow-lg">
                        <FontAwesomeIcon icon={faNewspaper} className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center mx-auto text-lg font-medium"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-3" /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!news) {
        // This case should ideally be covered by the error state if the ID doesn't exist
        // But as a fallback if 'news' somehow becomes null after loading
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30 text-center max-w-2xl">
                    <div className="bg-gradient-to-r from-gray-500 to-slate-500 p-6 rounded-full w-20 h-20 mx-auto mb-8 shadow-lg">
                        <FontAwesomeIcon icon={faNewspaper} className="text-white text-3xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Unavailable</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">News content is unavailable.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center mx-auto text-lg font-medium"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-3" /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Format the date for better readability
    const formattedPublishDate = news.publishDate
        ? new Date(news.publishDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'N/A';

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 bg-white/70 backdrop-blur-sm border border-white/30 text-gray-800 px-6 py-3 rounded-full hover:bg-white/80 hover:shadow-lg transition-all duration-300 flex items-center text-lg font-medium shadow-md group"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Home
                </button>

                {/* Main Content Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12">
                        <div className="flex items-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full mr-6 shadow-lg">
                                <FontAwesomeIcon icon={faNewspaper} className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                                    {news.title}
                                </h1>
                            </div>
                        </div>

                        {/* Date Badge */}
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-lg">
                            <FontAwesomeIcon icon={faCalendar} className="text-white mr-3" />
                            <span className="text-white font-medium text-lg">
                                Published on: {formattedPublishDate}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-12 lg:p-16">
                        <div className="prose lg:prose-xl max-w-none text-gray-800 leading-relaxed">
                            <div
                                className="text-lg sm:text-xl leading-relaxed text-gray-700 space-y-6"
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {news.content}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default NewsDetailPage;