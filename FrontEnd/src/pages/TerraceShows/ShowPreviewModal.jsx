import React from 'react';
import { motion } from 'framer-motion';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const modal = {
  hidden: { opacity: 0, y: '-100vh' },
  visible: { opacity: 1, y: '0', transition: { delay: 0.3 } }
};

const ShowPreviewModal = ({ show, onClose }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-black rounded-xl overflow-hidden max-w-5xl w-full"
        variants={modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl z-10"
        >
          &times;
        </button>

        {/* Show Video */}
        <video
          controls
          autoPlay
          className="w-full h-96 object-cover"
        >
          <source src={show.trailer} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Show Details */}
        <div className="p-6">
          <h2 className="text-3xl text-yellow-400 font-bold mb-2">
            {show.title}
          </h2>
          <p className="text-gray-300">{show.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShowPreviewModal;
