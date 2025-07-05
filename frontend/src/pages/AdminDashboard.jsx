import React, {useState, useEffect} from "react";
import StudentManagement from "../components/admin/StudentManagement";
import EducatorManagement from "../components/admin/EducatorManagement";
import ClassManagement from "../components/admin/ClassManagement";
import SubjectManagement from "../components/admin/SubjectManagement";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faChalkboardTeacher,
    faBook,
    faBuilding,
    faChartLine,
    faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import NewsManagement from "../components/admin/NewsManagment.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalEducators: 0,
        totalSubjects: 0,
        totalClasses: 0,
        totalPublishedNews: 0,
    });
    const [loadingOverview, setLoadingOverview] = useState(true);
    const [overviewError, setOverviewError] = useState('');

    // --- Fetch Dashboard Overview Data ---
    useEffect(() => {
        const fetchOverviewData = async () => {
            setLoadingOverview(true);
            setOverviewError('');
            try {
                const [
                    studentsCountResponse,
                    educatorsCountResponse,
                    subjectsCountResponse,
                    classesCountResponse,
                    publishedNewsCountResponse,
                ] = await Promise.all([
                    api.get("/admin/students/count"),
                    api.get("/admin/educators/count"),
                    api.get("/admin/subjects/count"),
                    api.get("/admin/classes/count"),
                    api.get("/admin/news/published/count"),
                ]);

                setDashboardData({
                    totalStudents: studentsCountResponse.data,
                    totalEducators: educatorsCountResponse.data,
                    totalSubjects: subjectsCountResponse.data,
                    totalClasses: classesCountResponse.data,
                    totalPublishedNews: publishedNewsCountResponse.data,
                });
            } catch (err) {
                console.error("Error fetching dashboard overview data:", err);
                setOverviewError("Failed to load overview data. Please check backend endpoints.");
                setDashboardData({
                    totalStudents: 'N/A',
                    totalEducators: 'N/A',
                    totalSubjects: 'N/A',
                    totalClasses: 'N/A',
                    totalPublishedNews: 'N/A',
                });
            } finally {
                setLoadingOverview(false);
            }
        };

        if (activeTab === "overview") {
            fetchOverviewData();
        }
    }, [activeTab]);

    // Dashboard Overview component that displays dynamic data
    const DashboardOverview = () => (
        <div className="space-y-8">
            {loadingOverview ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div
                        className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                    <div className="text-xl text-gray-600 font-medium">Loading overview data...</div>
                </div>
            ) : overviewError ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                        <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Data</div>
                        <div className="text-red-500">{overviewError}</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div
                        className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50">
                        <div className="flex items-center space-x-6">
                            <div
                                className="bg-blue-500 text-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faUsers} className="text-2xl"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Students</h3>
                                <p className="text-4xl font-bold text-blue-700">{dashboardData.totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50">
                        <div className="flex items-center space-x-6">
                            <div
                                className="bg-green-500 text-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Educators</h3>
                                <p className="text-4xl font-bold text-green-700">{dashboardData.totalEducators}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50">
                        <div className="flex items-center space-x-6">
                            <div
                                className="bg-purple-500 text-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faBook} className="text-2xl"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Subjects</h3>
                                <p className="text-4xl font-bold text-purple-700">{dashboardData.totalSubjects}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="group bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200/50">
                        <div className="flex items-center space-x-6">
                            <div
                                className="bg-yellow-500 text-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faBuilding} className="text-2xl"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Classes</h3>
                                <p className="text-4xl font-bold text-yellow-700">{dashboardData.totalClasses}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="group bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-200/50">
                        <div className="flex items-center space-x-6">
                            <div
                                className="bg-pink-500 text-white p-4 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={faNewspaper} className="text-2xl"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-1">Published News</h3>
                                <p className="text-4xl font-bold text-pink-700">{dashboardData.totalPublishedNews}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const navigationItems = [
        {id: "overview", label: "Overview", icon: faChartLine},
        {id: "students", label: "Manage Students", icon: faUsers},
        {id: "educators", label: "Manage Educators", icon: faChalkboardTeacher},
        {id: "subjects", label: "Manage Subjects", icon: faBook},
        {id: "classes", label: "Manage Classes", icon: faBuilding},
        {id: "news", label: "Manage News", icon: faNewspaper}
    ];

    const getPageTitle = () => {
        const titles = {
            overview: "Dashboard Overview",
            students: "Learner Console",
            educators: "Instructor Console",
            subjects: "Curriculum Console",
            classes: "ClassRoom Console",
            news: "Announcement Console"
        };
        return titles[activeTab] || "Dashboard";
    };

    return (
        <div
            className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                        Admin Panel
                    </h2>
                </div>
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-200 flex items-center space-x-3 group ${
                                activeTab === item.id
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                                    : "hover:bg-slate-700 text-gray-300 hover:text-white hover:transform hover:scale-105"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className={`text-lg transition-colors duration-200 ${
                                    activeTab === item.id ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                                }`}
                            />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 p-8 lg:p-12 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text mb-2">
                            {getPageTitle()}
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
                        {activeTab === "overview" && <DashboardOverview/>}
                        {activeTab === "students" && <StudentManagement/>}
                        {activeTab === "educators" && <EducatorManagement/>}
                        {activeTab === "subjects" && <SubjectManagement/>}
                        {activeTab === "classes" && <ClassManagement/>}
                        {activeTab === "news" && <NewsManagement/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;