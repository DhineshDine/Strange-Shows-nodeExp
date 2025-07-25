import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navigation from "./Navigation";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    // Load from localStorage initially
    return localStorage.getItem("selectedLocation") || "Select Location";
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken || !decodedToken.role || decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setIsAdmin(decodedToken.role === "Admin");
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Persist selectedLocation when it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem("selectedLocation", selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ✅ Navigation Bar */}
      <Navigation
        isAdmin={isAdmin}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* ✅ Main Content */}
      <div className="flex flex-col items-center py-12 px-4 space-y-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-white tracking-wide text-center">
          Welcome to Strange-Shows Cinemas
        </h2>

        
        {/* ✅ Area for Big Posters / News / Popular Foods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl pt-10">
          {/* Running Show Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <img
              src="/images/anorA.webp"
              alt="Running Show"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-2xl font-semibold mb-2">Current Blockbuster</h3>
              <p className="text-gray-400">Watch the latest hit in theaters near you!</p>
            </div>
          </div>

          {/* Popular Food Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <img
              src="/images/blueberry.webp"
              alt="Popular Food"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-2xl font-semibold mb-2">Top Food Item</h3>
              <p className="text-gray-400">Grab our most loved snack with your movie!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm border-t border-gray-800">
        &copy; 2025 Strange-Shows Cinemas. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
