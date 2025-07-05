import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom'; // <--- ADD Link HERE
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true); // State to check if token exists initially

    // On component mount, extract the token from the URL
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            setIsTokenValid(false);
            setError('Password reset link is missing a token.');
        }
    }, [searchParams]);

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm password do not match.');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('No reset token found. Please request a new password reset link.');
            setLoading(false);
            return;
        }

        try {
            // Your backend expects a JSON object with token and newPassword
            await api.post('/auth/forgot-password/reset', { token, newPassword });
            setSuccessMessage('Your password has been reset successfully. You can now login with your new password.');
            setNewPassword('');
            setConfirmNewPassword('');
            // Optionally, redirect to login page after a delay or on user click
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to reset password. The link might be invalid or expired. Please try again.');
            }
            console.error('Password reset error:', err);
            setIsTokenValid(false); // Mark token as invalid if reset failed
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-blue-200 transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Reset Your Password</h2>

                {successMessage && (
                    <p className="text-green-600 text-sm font-medium text-center mb-4">{successMessage}</p>
                )}
                {error && (
                    <p className="text-red-600 text-sm font-medium text-center mb-4">{error}</p>
                )}

                {isTokenValid && !successMessage ? ( // Only show form if token seems valid and no success message
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPassword">
                                <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" /> New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter your new password"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmNewPassword">
                                <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" /> Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                placeholder="Confirm your new password"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Display message if token is invalid or password has been reset
                    !successMessage && (
                        <p className="text-center text-gray-700">
                            {error || "Please return to the login page and request a new password reset link."}
                        </p>
                    )
                )}

                <p className="text-center text-sm mt-6">
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-200"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;