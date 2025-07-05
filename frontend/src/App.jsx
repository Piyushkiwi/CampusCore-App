// src/App.jsx
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ResetPassword from "./pages/ResetPassword";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"; // <--- IMPORT THIS LINE

// A more robust private route component with role checking
const PrivateRoute = ({children, allowedRoles}) => {
    const isAuthenticated = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace/>;
    }

    return children;
};

const App = () => {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar/>
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/news/:id" element={<NewsDetailPage/>}/>
                        <Route path="/terms-of-service" element={<TermsOfService/>}/>
                        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                        {/* <--- ADD THIS ROUTE */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                                    <AdminDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/educator/dashboard"
                            element={
                                <PrivateRoute allowedRoles={["ROLE_EDUCATOR"]}>
                                    <EducatorDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/student/dashboard"
                            element={
                                <PrivateRoute allowedRoles={["ROLE_STUDENT"]}>
                                    <StudentDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/privacy-policy"
                            element={<div className="p-8">Privacy Policy Content</div>}
                        />
                        <Route
                            path="/terms-of-service"
                            element={<div className="p-8">Terms of Service Content</div>}
                        />
                        <Route
                            path="/sitemap"
                            element={<div className="p-8">Sitemap Content</div>}
                        />
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
};

export default App;
