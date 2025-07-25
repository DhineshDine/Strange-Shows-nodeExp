import React, { useState } from "react";

// Import your admin pages
import NowPlayingAdmin from "./NowPlayingAdmin";
import AdminComingSoon from "./AdminComingSoon";
import OnlyAtStrangeAdmin from "./OnlyAtStrangeAdmin";
import AdminMovieCalendar from "./Calender/AdminMovieCalendar";
const MoviesManagement = () => {
    const [activeSection, setActiveSection] = useState("nowPlaying");

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveSection("nowPlaying")}
                    className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "nowPlaying" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                >
                    Now Playing
                </button>
                <button
                    onClick={() => setActiveSection("comingSoon")}
                    className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "comingSoon" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                >
                    Coming Soon
                </button>
                <button
                    onClick={() => setActiveSection("admin-calender")}
                    className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "monthlyCalendar" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                >
                    Monthly Calendar
                </button>
                <button
                    onClick={() => setActiveSection("onlyAtStrange")}
                    className={`px-4 py-2 rounded-lg font-semibold ${activeSection === "onlyAtStrange" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                >
                    Only at Strange
                </button>
            </div>

            {/* Sections Rendering */}
            {activeSection === "nowPlaying" && <NowPlayingAdmin />}
            {activeSection === "comingSoon" && <AdminComingSoon />}
            {activeSection === "admin-calender" && <AdminMovieCalendar />}
            {activeSection === "onlyAtStrange" && <OnlyAtStrangeAdmin />}
        </div>
    );
};

export default MoviesManagement;
