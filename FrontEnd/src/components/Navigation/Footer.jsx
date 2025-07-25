import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Strange Shows. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-yellow-400 transition duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
