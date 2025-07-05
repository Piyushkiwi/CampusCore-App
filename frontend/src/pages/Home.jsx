import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import g1 from "../assets/images/g1.jpg";
import g2 from "../assets/images/g2.jpg";
import g3 from "../assets/images/g3.jpg";
import g4 from "../assets/images/g4.jpg";
import g5 from "../assets/images/g5.jpg";
import g6 from "../assets/images/g6.jpg";
import g7 from "../assets/images/g7.jpg";
import g8 from "../assets/images/g8.jpg";
import h6 from "../assets/images/h6.jpg";
import h4 from "../assets/images/h4.jpg";
import h5 from "../assets/images/h5.jpg";
import h7 from "../assets/images/h7.jpg";
import h8 from "../assets/images/h8.jpg";

import {
    faGraduationCap,
    faChalkboardTeacher,
    faUserShield,
    faNewspaper,
    faImages,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

// Dummy data for image carousel (replace with real image URLs from backend if available)
const carouselImages = [
    h4,
    h5,
    h6,
    h7,
    h8
];

// Dummy data for gallery (replace with real image URLs from backend if available)
const galleryImages = [
    g1,
    g2,
    g3,
    g4,
    g5,
    g6,
    g7,
    g8
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsTitles, setNewsTitles] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [newsError, setNewsError] = useState(null);
    const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);
    const [isHoveringNews, setIsHoveringNews] = useState(false);

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    // Effect for Image Carousel auto-slide
    useEffect(() => {
        if (isHoveringCarousel) return;

        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isHoveringCarousel]);

    // Effect for fetching news titles
    useEffect(() => {
        const fetchNewsTitles = async () => {
            try {
                setNewsLoading(true);
                const response = await api.get("/public/news/titles");
                setNewsTitles(response.data);
            } catch (err) {
                console.error("Error fetching news titles:", err);
                setNewsError("Failed to load news. Please try again later.");
            } finally {
                setNewsLoading(false);
            }
        };

        fetchNewsTitles();
    }, []);

    // Navigation functions for carousel
    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
        );
    };

    // Duplicate news titles for infinite scroll effect
    const duplicatedNewsTitles = newsTitles.length > 0
        ? Array(20).fill(newsTitles).flat()
        : [];

    return (
        <div
            className="flex flex-col items-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Enhanced Top Section with Image Carousel */}
            <div
                className="relative w-full h-[350px] sm:h-[450px] lg:h-[650px] overflow-hidden shadow-2xl"
                onMouseEnter={() => setIsHoveringCarousel(true)}
                onMouseLeave={() => setIsHoveringCarousel(false)}
            >
                {carouselImages.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Campus Life ${index + 1}`}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${ // Changed object-contain to object-cover
                            index === currentSlide
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-105"
                        }`}
                    />
                ))}

                <div
                    // Option 1: Remove gradient or make it almost invisible
                    // If you want *no* darkening effect from the overlay itself, just remove bg-gradient-to-t
                    // or use a very very faint black like black/0.1 if that's supported or transparent colors.
                    // For practical purposes, removing it makes it most transparent.
                    className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <div
                        // Keep bg-white/1 for the blur effect but adjust its opacity if needed
                        // Consider increasing backdrop-blur for more separation if removing gradient
                        className="bg-white/1 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/5 shadow-2xl max-w-4xl w-full mx-4 hover:bg-white/3 transition-all duration-500">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent leading-tight">
                            Empowering Future Leaders
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 drop-shadow-lg text-white/90 leading-relaxed">
                            A vibrant community dedicated to academic excellence and personal growth through innovation
                            and collaboration.
                        </p>

                        {/* Enhanced Slide Indicators */}
                        <div className="flex justify-center space-x-3">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide
                                            ? "bg-white scale-125 shadow-lg"
                                            : "bg-white/40 hover:bg-white/70 hover:scale-110"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Also, consider making navigation arrows slightly more transparent */}
                <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full p-4 text-white transition-all duration-300 hover:scale-110 border border-white/10"
                    aria-label="Previous slide"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xl"/>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full p-4 text-white transition-all duration-300 hover:scale-110 border border-white/10"
                    aria-label="Next slide"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xl"/>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Welcome Section */}
                <section className="text-center mb-16">
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
                        Welcome to <span
                        className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Campus Core!</span>
                    </h2>
                    <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Your comprehensive platform for seamless academic management, communication, and growth.
                        Connect, learn, and excel with cutting-edge tools designed for modern education.
                    </p>
                </section>

                {/* Enhanced Feature Cards Section */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
                        {/* Educators Card */}
                        <div
                            className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-white/30 hover:border-blue-200/50 transform hover:-translate-y-3 hover:scale-105">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-full w-20 h-20 mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                                    <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-3xl"/>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">For Educators</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Manage classes, track student progress, and provide valuable feedback with our
                                    intuitive and powerful teaching tools.
                                </p>
                            </div>
                        </div>

                        {/* Students Card */}
                        <div
                            className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-white/30 hover:border-green-200/50 transform hover:-translate-y-3 hover:scale-105">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 p-5 rounded-full w-20 h-20 mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                                    <FontAwesomeIcon icon={faGraduationCap} className="text-white text-3xl"/>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">For Students</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Access courses, view grades, and stay informed about campus activities in one
                                    convenient and user-friendly platform.
                                </p>
                            </div>
                        </div>

                        {/* Administrators Card */}
                        <div
                            className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-white/30 hover:border-purple-200/50 transform hover:-translate-y-3 hover:scale-105">
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 rounded-full w-20 h-20 mx-auto mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                                    <FontAwesomeIcon icon={faUserShield} className="text-white text-3xl"/>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">For Administrators</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Effortlessly manage users, classes, subjects, and overall system settings with
                                    comprehensive admin tools.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced News Section */}
                <section
                    className="mb-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-12 border border-white/30 hover:shadow-2xl transition-all duration-500 hover:bg-white/70">
                    <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full mr-6 shadow-lg">
                            <FontAwesomeIcon icon={faNewspaper} className="text-white text-2xl"/>
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Latest Campus News
                        </span>
                    </h2>
                    <div
                        className="relative overflow-hidden h-20 sm:h-24 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-inner border border-blue-100/50"
                        onMouseEnter={() => setIsHoveringNews(true)}
                        onMouseLeave={() => setIsHoveringNews(false)}
                    >
                        {newsLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div
                                    className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-4"></div>
                                <p className="text-gray-600 text-lg">Loading latest news...</p>
                            </div>
                        ) : newsError ? (
                            <p className="text-center text-red-600 flex items-center justify-center h-full text-lg">
                                {newsError}
                            </p>
                        ) : newsTitles.length > 0 ? (
                            <div
                                className={`flex whitespace-nowrap news-ticker-animate ${isHoveringNews ? 'paused' : ''}`}>
                                {duplicatedNewsTitles.map((news, index) => (
                                    <Link
                                        to={`/news/${news.id}`}
                                        key={`${news.id}-${index}`}
                                        className="inline-block px-8 py-3 text-blue-800 hover:text-blue-600 hover:underline transition-all duration-300 text-lg sm:text-xl font-medium hover:bg-blue-100/70 rounded-xl mx-2 hover:shadow-md"
                                    >
                                        {news.title}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600 flex items-center justify-center h-full text-lg">
                                No news available at the moment.
                            </p>
                        )}
                    </div>
                </section>

                {/* Enhanced Gallery Section */}
                <section
                    className="mb-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-12 border border-white/30 hover:shadow-2xl transition-all duration-500 hover:bg-white/70">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full mr-6 shadow-lg">
                            <FontAwesomeIcon icon={faImages} className="text-white text-2xl"/>
                        </div>
                        <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                            Campus Gallery
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer"
                            >
                                <img
                                    src={image}
                                    alt={`Gallery Image ${index + 1}`}
                                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-110" // Changed object-contain to object-cover
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                                    <div
                                        className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                        <span className="text-white font-medium text-sm">Campus Life</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Custom CSS for news ticker animation */}
            <style jsx>{`
                .news-ticker-animate {
                    animation: scroll 10s linear infinite; /* Adjusted to 50s for slightly faster speed */
                }

                .news-ticker-animate.paused {
                    animation-play-state: paused;
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0%); /* Starts immediately visible on screen */
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
