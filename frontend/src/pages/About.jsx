import React from "react";
import {useEffect} from "react";

const About = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-6 px-2 md:px-4 lg:px-6 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                {/* Header */}
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 font-['Playfair_Display']">
                        Discover Campus
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your gateway to a connected and enriched academic experience.
                    </p>
                </header>

                {/* Mission */}
                <section className="mb-10 md:mb-16">
                    <div className="flex flex-col md:flex-row items-center bg-blue-50 rounded-xl p-6 shadow-md">
                        <div className="md:w-1/3 flex justify-center mb-6 md:mb-0 md:mr-8">
                            <svg
                                className="w-24 h-24 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 10.998c0 5.517 4.383 10.075 9.083 11.015 4.7-1.002 9.083-5.517 9.083-11.015A12.001 12.001 0 0021.08 7.982z"
                                />
                            </svg>
                        </div>
                        <div className="md:w-2/3 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-blue-800 mb-4 font-['Playfair_Display']">
                                Our Mission
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                To empower students, educators, and administrators with intuitive tools and resources
                                that foster seamless communication, efficient management, and a vibrant learning
                                community. We aim to simplify campus life and enhance educational outcomes for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision */}
                <section className="mb-10 md:mb-16">
                    <div
                        className="flex flex-col md:flex-row-reverse items-center bg-purple-50 rounded-xl p-6 shadow-md">
                        <div className="md:w-1/3 flex justify-center mb-6 md:mb-0 md:ml-8">
                            <svg
                                className="w-24 h-24 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M18 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-9-9a2 2 0 110 4 2 2 0 010-4zm0 0V3m0 0V2h2M9 12h6"
                                />
                            </svg>
                        </div>
                        <div className="md:w-2/3 text-center md:text-right">
                            <h3 className="text-2xl font-bold text-purple-800 mb-4 font-['Playfair_Display']">
                                Our Vision
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                To be the leading digital platform for educational institutions, recognized for our
                                innovation, reliability, and commitment to creating an inclusive and dynamic learning
                                ecosystem that prepares individuals for future success.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mb-10 md:mb-16">
                    <h3 className="text-3xl font-bold text-center text-gray-900 mb-8 font-['Playfair_Display']">
                        Our Core Values
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Innovation */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-blue-500">
                            <svg
                                className="w-12 h-12 text-blue-500 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
                            <p className="text-gray-600 text-sm">
                                Continuously evolving to meet the changing needs of education.
                            </p>
                        </div>

                        {/* Collaboration */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-purple-500">
                            <svg
                                className="w-12 h-12 text-purple-500 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                            </svg>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Collaboration</h4>
                            <p className="text-gray-600 text-sm">
                                Fostering a connected environment for all stakeholders.
                            </p>
                        </div>

                        {/* Excellence */}
                        <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-pink-500">
                            <svg
                                className="w-12 h-12 text-pink-500 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L3 12l5.714-2.143L11 3z"
                                />
                            </svg>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h4>
                            <p className="text-gray-600 text-sm">
                                Committed to delivering high-quality, reliable solutions.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Call to Action */}
            <section className="max-w-4xl mx-auto text-center bg-gray-50 rounded-xl p-8 shadow-inner mt-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">
                    Join the Campus Core Community!
                </h3>
                <p className="text-gray-700 mb-6">
                    Explore how Campus Core can transform your academic journey.
                </p>
                <a
                    href="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Get Started Today
                </a>
            </section>
        </div>
    );
};

export default About;
