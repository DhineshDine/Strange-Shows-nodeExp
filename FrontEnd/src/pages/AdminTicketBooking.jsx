import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiLogOut,
    FiSettings,
    FiFilm,
    FiCoffee,
    FiBarChart,
    FiMapPin,
} from "react-icons/fi";

// Import your components here
import MoviesManagement from "./MoviesManagement"; // New Movies Controller Page
import FoodManagement from "./FoodManagement";
import InsightsTracker from "./InsightsTracker";
import LocationManagement from "./LocationManagement"; // New component

const AdminTicketBooking = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("movies");
    const [showSettings, setShowSettings] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="relative">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        <FiSettings className="text-xl" />
                        <span>Settings</span>
                    </button>
                    {showSettings && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-gray-700 rounded-lg"
                            >
                                <FiLogOut className="text-xl" />
                                <span className="ml-2">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar & Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 p-4 space-y-4">
                    <button
                        onClick={() => setActiveTab("movies")}
                        className={`flex items-center space-x-2 w-full p-2 rounded-lg ${activeTab === "movies" ? "bg-blue-600" : "hover:bg-gray-700"
                            }`}
                    >
                        <FiFilm className="text-xl" /> <span>Movies Controller</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("food")}
                        className={`flex items-center space-x-2 w-full p-2 rounded-lg ${activeTab === "food" ? "bg-blue-600" : "hover:bg-gray-700"
                            }`}
                    >
                        <FiCoffee className="text-xl" /> <span>Food Management</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("insights")}
                        className={`flex items-center space-x-2 w-full p-2 rounded-lg ${activeTab === "insights" ? "bg-blue-600" : "hover:bg-gray-700"
                            }`}
                    >
                        <FiBarChart className="text-xl" /> <span>Insights Tracker</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("locations")}
                        className={`flex items-center space-x-2 w-full p-2 rounded-lg ${activeTab === "locations" ? "bg-blue-600" : "hover:bg-gray-700"
                            }`}
                    >
                        <FiMapPin className="text-xl" /> <span>Location Management</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {activeTab === "movies" && <MoviesManagement />} {/* New Movies Controller Page */}
                    {activeTab === "food" && <FoodManagement />}
                    {activeTab === "insights" && <InsightsTracker />}
                    {activeTab === "locations" && <LocationManagement />}
                </div>
            </div>
        </div>
    );
};

export default AdminTicketBooking;
