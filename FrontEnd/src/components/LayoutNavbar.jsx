import React from 'react';
import { Link } from 'react-router-dom';

const LayoutNavbar = () => {
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-yellow-400 hover:text-yellow-500 transition duration-300"
            aria-label="Go to homepage"
          >
            Strange Shows
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/reviews"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              Reviews
            </Link>
            <Link
              to="/movies"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              Movies
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-400 transition duration-300"
            >
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LayoutNavbar;
