import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, Settings, User, Menu } from "lucide-react";
import axios from "axios";

const Navigation = ({ isAdmin, selectedLocation, setSelectedLocation }) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(null); // null, 'movies', 'mobile'
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Fetch locations from backend on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/locations");
        setLocations(res.data);
        console.log("Fetched Locations:", res.data);

        if (!selectedLocation && res.data.length > 0) {
          const defaultLocation = res.data[0]._id;
          setSelectedLocation(defaultLocation);
          localStorage.setItem("selectedLocation", defaultLocation);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
        setLocationError("Unable to fetch locations.");
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [selectedLocation, setSelectedLocation]);

  const handleLocationChange = (e) => {
    const selectedId = e.target.value;
    setSelectedLocation(selectedId);
    localStorage.setItem("selectedLocation", selectedId);
  };

  const toggleMenu = (menuName) => {
    setMenuOpen(menuOpen === menuName ? null : menuName);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md sticky top-0 z-50">
      {/* Left: Brand + Location Selector */}
      <div className="flex items-center space-x-6">
        {/* 🔥 Update: Navigate to Terrace-Shows on click! */}
        <h1
          onClick={() => navigate("/terrace-shows")}
          className="text-2xl font-extrabold cursor-pointer text-purple-500 hover:text-purple-400 transition"
        >
          Strange-Shows
        </h1>

        {/* Location Dropdown */}
        {loadingLocations ? (
          <span>Loading locations...</span>
        ) : locationError ? (
          <span className="text-red-400">{locationError}</span>
        ) : (
          <select
            value={selectedLocation || ""}
            onChange={handleLocationChange}
            className="bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
          >
            <option value="">Select Location</option>
            {locations.length > 0 ? (
              locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.name}
                  {location.comingSoon ? " (Coming Soon)" : ""}
                </option>
              ))
            ) : (
              <option disabled>No Locations Available</option>
            )}
          </select>
        )}
      </div>

      {/* Right: Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <button
          onClick={() => navigate("/food")}
          className="hover:text-purple-400 transition"
        >
          Food
        </button>

        <button
          onClick={() => navigate("/reviews")}
          className="hover:text-purple-400 transition"
        >
          Reviews
        </button>

        <button
          onClick={() => navigate("/seasonpass")}
          className="hover:text-purple-400 transition"
        >
          Season Pass
        </button>

        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="text-purple-400 hover:text-purple-600 transition"
          >
            Admin
          </button>
        )}

        {/* Movies Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("movies")}
            className="flex items-center space-x-2 hover:text-purple-400 font-semibold"
          >
            <span>MOVIES</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen === "movies" && (
            <div className="absolute left-0 mt-2 w-56 bg-white text-black rounded-md shadow-lg py-2 z-20">
              <button
                onClick={() => navigate("/now-playing")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Now Playing
              </button>
              <button
                onClick={() => navigate("/coming-soon")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Coming Soon
              </button>
              <button
                onClick={() => navigate("/monthly-calendar")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Monthly Calendar
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={() => navigate("/only-at-the-alamo")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Only At The Alamo
              </button>
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center space-x-2 hover:text-purple-400"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2 z-20">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
              >
                <User className="w-4 h-4 mr-2" /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden relative">
        <button onClick={() => toggleMenu("mobile")}>
          <Menu className="w-6 h-6" />
        </button>

        {menuOpen === "mobile" && (
          <div className="absolute top-16 right-0 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2 z-20">
            <button
              onClick={() => navigate("/food")}
              className="block w-full px-4 py-2 hover:bg-gray-700"
            >
              Food
            </button>
            <button
              onClick={() => navigate("/reviews")}
              className="block w-full px-4 py-2 hover:bg-gray-700"
            >
              Reviews
            </button>
            <button
              onClick={() => navigate("/seasonpass")}
              className="block w-full px-4 py-2 hover:bg-gray-700"
            >
              Season Pass
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="block w-full px-4 py-2 hover:bg-gray-700 text-purple-400"
              >
                Admin
              </button>
            )}

            <hr className="border-gray-700 my-2" />

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
            >
              <User className="w-4 h-4 mr-2" /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
