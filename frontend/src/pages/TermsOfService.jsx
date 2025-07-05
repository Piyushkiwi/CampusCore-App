import React from 'react';
import {useEffect} from "react";

const TermsOfService = () => {
    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 font-['Playfair_Display']">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Last Updated: July 5, 2025
                    </p>
                </header>

                <section className="space-y-8 text-gray-700 leading-relaxed">
                    <p>
                        Welcome to Campus App! These Terms of Service ("Terms") govern your use of the Campus App
                        website and services (collectively, the "Service"). By accessing or using the Service, you agree
                        to be bound by these Terms. If you disagree with any part of the terms, then you may not access
                        the Service.
                    </p>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            1. Use of Service
                        </h2>
                        <p>
                            The Campus App Service is provided for educational and administrative purposes within a
                            school or university environment. You agree to use the Service only for lawful purposes and
                            in a way that does not infringe the rights of, restrict or inhibit anyone else's use and
                            enjoyment of the Service. Prohibited behavior includes harassing or causing distress or
                            inconvenience to any other user, transmitting obscene or offensive content, or disrupting
                            the normal flow of dialogue within the Service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            2. User Accounts
                        </h2>
                        <p>
                            To access certain features of the Service, you may be required to create an account. You are
                            responsible for maintaining the confidentiality of your account password and for all
                            activities that occur under your account. You agree to notify us immediately of any
                            unauthorized use of your account. Campus App cannot and will not be liable for any loss or
                            damage arising from your failure to comply with this security obligation.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            3. Content
                        </h2>
                        <p>
                            You are solely responsible for any content you upload, post, or otherwise transmit through
                            the Service. You agree not to upload, post, or transmit any content that is illegal,
                            harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of
                            another's privacy, hateful, or racially, ethnically, or otherwise objectionable.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            4. Termination
                        </h2>
                        <p>
                            We may terminate or suspend your access to the Service immediately, without prior notice or
                            liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            5. Disclaimer of Warranties
                        </h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Campus App makes no
                            warranties, expressed or implied, and hereby disclaims and negates all other warranties,
                            including without limitation, implied warranties or conditions of merchantability, fitness
                            for a particular purpose, or non-infringement of intellectual property or other violation of
                            rights.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                            6. Governing Law
                        </h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of [Your
                            State/Country], without regard to its conflict of law provisions.
                        </p>
                    </div>

                    <p>
                        By continuing to access or use our Service after those revisions become effective, you agree to
                        be bound by the revised terms. If you do not agree to the new terms, please stop using the
                        Service.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
