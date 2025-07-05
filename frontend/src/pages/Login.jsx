import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import api from "../services/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faLock, faEnvelope} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {username, password});
            const {jwtToken, role} = response.data;

            localStorage.setItem("jwtToken", jwtToken);
            localStorage.setItem("userRole", role);

            console.log("Login successful:", response.data);

            switch (role) {
                case "ROLE_ADMIN":
                    navigate("/admin/dashboard");
                    break;
                case "ROLE_EDUCATOR":
                    navigate("/educator/dashboard");
                    break;
                case "ROLE_STUDENT":
                    navigate("/student/dashboard");
                    break;
                default:
                    navigate("/dashboard");
                    break;
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid username or password.");
            } else if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            await api.post("/auth/forgot-password/request", {email: email});

            setSuccessMessage(
                "If an account with that email exists, a password reset link has been sent to your inbox."
            );
            setEmail("");
            setIsForgotPasswordMode(false);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError(
                    "An error occurred while trying to send the reset link. Please try again."
                );
            }
            console.error("Forgot password error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // The main container now has an animated gradient background
        <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
            {/* Background with animated gradient */}
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradient-move"></div>

            {/* Tailwind CSS for the animation (add to your CSS file, e.g., index.css or global.css) */}
            <style>
                {`
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-move {
          background-size: 400% 400%; /* Make the gradient large enough to move */
          animation: gradient-move 15s ease infinite;
        }
        `}
            </style>

            <div
                className="relative z-10 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-blue-200 transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                    {isForgotPasswordMode ? "Forgot Password?" : "Login to CampusCore"}
                </h2>

                {successMessage && (
                    <p className="text-green-600 text-sm font-medium text-center mb-4">
                        {successMessage}
                    </p>
                )}
                {error && (
                    <p className="text-red-600 text-sm font-medium text-center mb-4">
                        {error}
                    </p>
                )}

                {!isForgotPasswordMode ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-semibold mb-2"
                                htmlFor="username"
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500"/>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-semibold mb-2"
                                htmlFor="password"
                            >
                                <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500"/>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                                disabled={loading}
                            >
                                {loading ? "Logging In..." : "Sign In"}
                            </button>
                        </div>
                        <p className="text-center text-sm mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPasswordMode(true);
                                    setError("");
                                    setSuccessMessage("");
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-200"
                            >
                                Forgot Password?
                            </button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                        <div>
                            <label
                                className="block text-gray-700 text-sm font-semibold mb-2"
                                htmlFor="email"
                            >
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="mr-2 text-blue-500"
                                />
                                Enter your email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </div>
                        <p className="text-center text-sm mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotPasswordMode(false);
                                    setError("");
                                    setSuccessMessage("");
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-200"
                            >
                                Back to Login
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;