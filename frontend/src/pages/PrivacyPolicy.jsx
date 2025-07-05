import React from 'react';
import {useEffect} from "react";

const PrivacyPolicy = () => {

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 font-['Playfair_Display']">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Last Updated: July 5, 2025
                    </p>
                </header>

                <section className="space-y-8 text-gray-700 leading-relaxed">
                    <p>
                        Your privacy is important to us. This Privacy Policy describes how Campus App ("we," "us," or "our") collects, uses, and discloses your information when you use our website and services (the "Service").
                    </p>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect information to provide and improve our Service to you.
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>
                                <strong>Personal Information:</strong> When you register for an account, we may ask for your name, email address, student ID, and other relevant academic information.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> We automatically collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                            </li>
                            <li>
                                <strong>Cookies:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            2. How We Use Your Information
                        </h2>
                        <p>
                            Campus App uses the collected data for various purposes:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>To provide and maintain the Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information so that we can improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            3. Disclosure of Data
                        </h2>
                        <p>
                            We may disclose your Personal Information in the good faith belief that such action is necessary to:
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li>To comply with a legal obligation</li>
                            <li>To protect and defend the rights or property of Campus App</li>
                            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                            <li>To protect the personal safety of users of the Service or the public</li>
                            <li>To protect against legal liability</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            4. Security of Data
                        </h2>
                        <p>
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            5. Changes to This Privacy Policy
                        </h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                        </p>
                    </div>

                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>By email: contact@campusapp.edu</li>
                        <li>By visiting this page on our website: /contact</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
