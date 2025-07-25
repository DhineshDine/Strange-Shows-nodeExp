import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MovieSlide = ({ movie, isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <div
            className="w-full h-full bg-cover bg-center flex flex-col justify-end"
            style={{ backgroundImage: `url(${movie.image})` }}
          >
            <div className="bg-gradient-to-t from-black via-black/50 to-transparent p-10">
              <h2 className="text-4xl text-white font-bold mb-4">{movie.title}</h2>
              <p className="text-white text-lg mb-6">{movie.description}</p>
              <a
                href={movie.link}
                className="bg-yellow-500 text-black font-bold px-6 py-3 rounded hover:bg-yellow-600 transition"
              >
                BUY TICKETS
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieSlide;
