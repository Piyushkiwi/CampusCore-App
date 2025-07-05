import React, {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faEnvelope,
    faPhoneAlt,
    faClock,
} from "@fortawesome/free-solid-svg-icons";

import "../styles/ContactPage.css";


const Contact = () => {

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-300 text-gray-900">
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact CampusCore</h2>
                    <p className="text-lg text-gray-700">
                        We'd love to hear from you. Reach out to us about your educational journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        {/* Contact Info */}
                        <div className="bg-gray-100 p-6 rounded-xl shadow">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h3>

                            {/* Location */}
                            <div className="flex items-start mb-4">
                                <div
                                    className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full mr-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Our Location</h4>
                                    <p className="text-gray-600 text-sm">
                                        CampusCore<br/>
                                        Raipur<br/>
                                        Chhattisgarh 492010<br/>
                                        India
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start mb-4">
                                <div
                                    className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full mr-4">
                                    <FontAwesomeIcon icon={faEnvelope}/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Email Us</h4>
                                    <a href="mailto:rk04393@gmail.com" className="text-indigo-600 text-sm">
                                        rk04393@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start mb-4">
                                <div
                                    className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full mr-4">
                                    <FontAwesomeIcon icon={faPhoneAlt}/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Call Us</h4>
                                    <a href="tel:+919523394131" className="text-indigo-600 text-sm">
                                        +91 9523394131
                                    </a>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="flex items-start">
                                <div
                                    className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full mr-4">
                                    <FontAwesomeIcon icon={faClock}/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg">Office Hours</h4>
                                    <p className="text-gray-600 text-sm">
                                        Mon – Fri: 8:00 AM – 4:00 PM<br/>
                                        <span className="text-xs text-gray-400">
                      Weekend appointments available on request
                    </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-slate-100 p-6 rounded-xl shadow">
                            <h4 className="text-xl font-semibold mb-4">Send us a Message</h4>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full border rounded-md px-4 py-2 text-sm"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    className="w-full border rounded-md px-4 py-2 text-sm"
                                />
                                <textarea
                                    rows="4"
                                    placeholder="Your Message"
                                    className="w-full border rounded-md px-4 py-2 text-sm resize-none"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-slate-100 p-6 rounded-xl shadow h-full">
                        <h3 className="text-4xl font-semibold mb-4">Find Us on the Map</h3>
                        <p className="text-xl text-gray-700 mb-4 py-4">
                            Visit our campus located in the heart of Knowledge City.
                        </p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.07720977232!2d81.60265737497148!3d22.312952879679937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28c3a1f81d113d%3A0x7d2e0b5f5d6e2e!2sNational%20Institute%20of%20Technology%20Raipur!5e0!3m2!1sen!2sin!4v1719947879684!5m2!1sen!2sin"
                            width="100%"
                            height="400"
                            style={{border: 0}}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="CampusCore Location"
                            className="rounded-md"
                        ></iframe>
                        <p className="text-xs text-gray-800 mt-3 text-center italic">
                            *Demo location: NIT Raipur. Replace with your actual location.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
