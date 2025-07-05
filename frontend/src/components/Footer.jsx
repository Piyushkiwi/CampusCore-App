import React from 'react';
import {Link} from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Home, // Added Home icon
    Info, // Added Info icon for About Us
    HelpCircle, // Added HelpCircle icon for Contact & Support
    FileText, // Added FileText icon for Terms of Service
    Shield, // Added Shield icon for Privacy Policy
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Campus Core
                            </h3>
                            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                                Empowering education through innovative technology and seamless digital experiences.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#"
                               className="text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform">
                                <Facebook size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform">
                                <Twitter size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-pink-400 transition-colors duration-300 hover:scale-110 transform">
                                <Instagram size={20}/>
                            </a>
                            <a href="#"
                               className="text-slate-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110 transform">
                                <Linkedin size={20}/>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-flex items-center space-x-2"> {/* Added inline-flex items-center space-x-2 */}
                                    <Info size={16} className="text-blue-400"/> {/* Icon added */}
                                    <span>About Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-flex items-center space-x-2"> {/* Added inline-flex items-center space-x-2 */}
                                    <Home size={16} className="text-blue-400"/> {/* Icon added */}
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-flex items-center space-x-2"> {/* Added inline-flex items-center space-x-2 */}
                                    <HelpCircle size={16} className="text-blue-400"/> {/* Icon added */}
                                    <span>Contact & Support</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/privacy-policy"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-flex items-center space-x-2"> {/* Added inline-flex items-center space-x-2 */}
                                    <Shield size={16} className="text-blue-400"/> {/* Icon added */}
                                    <span>Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service"
                                      className="text-slate-300 hover:text-blue-400 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-flex items-center space-x-2"> {/* Added inline-flex items-center space-x-2 */}
                                    <FileText size={16} className="text-blue-400"/> {/* Icon added */}
                                    <span>Terms of Service</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Contact</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-slate-300">
                                <Mail size={16} className="text-blue-400"/>
                                <span className="text-sm">rk04393@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-300">
                                <Phone size={16} className="text-blue-400"/>
                                <span className="text-sm">+91 9523394131</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-300">
                                <MapPin size={16} className="text-blue-400"/>
                                <span className="text-sm">Raipur Chhattisgarh,492010, India</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700 bg-slate-900/50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-slate-400 text-sm">
                            &copy; {currentYear} Campus Core. All rights reserved.
                        </p>
                        <p className="text-slate-500 text-xs">
                            Made with ❤️ for modern education
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
