import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MovieToggle = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
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

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute mt-2 w-56 bg-white text-black rounded-md shadow-lg z-50">
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
  );
};

export default MovieToggle;
