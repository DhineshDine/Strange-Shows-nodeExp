import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ShowPreviewModal from './ShowPreviewModal';

const shows = [
  {
    id: 1,
    type: 'series',
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher turned methamphetamine producer.',
    thumbnail: '/images/breakingBad.jpeg',
    episodes: [
      {
        id: 'bb-s1e1',
        title: 'Episode 1: Pilot',
        video: '/videos/Breaking Bad Trailer First Season.mp4'
      },
      {
        id: 'bb-s1e2',
        title: 'Episode 2: Cat\'s in the Bag...',
        video: '/videos/BreakingBad.S01E02.mp4'
      }
      // Add more episodes if you have them
    ]
  },
  {
    id: 2,
    type: 'series',
    title: 'Better Call Saul',
    description: 'The trials and tribulations of criminal lawyer Jimmy McGill.',
    thumbnail: '/images/better-call-saul.webp',
    episodes: [
      {
        id: 'bcs-s1e1',
        title: 'Episode 1: Uno',
        video: '/videos/cinema-background.mp4'
      },
      {
        id: 'bcs-s1e2',
        title: 'Episode 2: Mijo',
        video: '/videos/Better.Call.Saul.S01E02.mp4'
      }
      // Add more episodes if you have them
    ]
  }
];

const TerraceShows = () => {
  const [selectedShow, setSelectedShow] = useState(null);
  const [expandedShowId, setExpandedShowId] = useState(null);
  const [playingEpisode, setPlayingEpisode] = useState(null);
  const navigate = useNavigate();
  const bgAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/audio/bgsound.mp3');
    audio.volume = 0.5;
    audio.loop = true;
    audio.play().catch(err => console.log('Autoplay error:', err));
    bgAudioRef.current = audio;

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const enterSecretHouse = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
    }

    const secretSound = new Audio('/audio/secretsound.mp3');
    secretSound.play().then(() => {
      navigate('/secret-house');
    }).catch(() => {
      navigate('/secret-house');
    });
  };

  const goBack = () => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
    }
    navigate('/dashboard'); // 🚀 Navigate directly to Dashboard
  };
  
  const toggleExpandShow = (showId) => {
    if (expandedShowId === showId) {
      setExpandedShowId(null);
      setPlayingEpisode(null);
    } else {
      setExpandedShowId(showId);
      setPlayingEpisode(null);
    }
  };

  const playEpisode = (episode) => {
    setPlayingEpisode(episode);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/cinema-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🎥 Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm z-10"></div>

      {/* 🖼️ Header */}
      <div className="relative z-20 flex flex-col items-center justify-start h-full pt-12 px-4">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="absolute top-6 left-6 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition z-30"
        >
          ← Back
        </button>

        {/* Strange-Shows Poster Title */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400 cursor-pointer hover:text-yellow-500"
          onClick={enterSecretHouse}
        >
          Strange-Shows
        </motion.h1>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {shows.map((show, index) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
            >
              <div
                className="bg-white bg-opacity-10 rounded-3xl overflow-hidden shadow-lg backdrop-blur-md border border-white border-opacity-20"
                onClick={() => toggleExpandShow(show.id)}
              >
                <img
                  src={show.thumbnail}
                  alt={show.title}
                  className="h-60 w-full object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
                    {show.title}
                  </h2>
                  <p className="text-sm text-gray-300">{show.description}</p>
                </div>
              </div>

              {/* Expanded Episodes */}
              {expandedShowId === show.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 bg-black bg-opacity-60 rounded-lg border border-yellow-400"
                >
                  <h3 className="text-lg font-semibold mb-4 text-yellow-300">Episodes</h3>
                  <ul className="space-y-2">
                    {show.episodes.map(episode => (
                      <li key={episode.id}>
                        <button
                          onClick={() => playEpisode(episode)}
                          className="text-left w-full text-white hover:text-yellow-400 transition"
                        >
                          ▶️ {episode.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Video Player */}
        {playingEpisode && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-11/12 md:w-3/4 lg:w-1/2">
              <button
                onClick={() => setPlayingEpisode(null)}
                className="absolute top-2 right-2 text-white bg-red-600 px-3 py-1 rounded-full hover:bg-red-700 z-50"
              >
                ✕ Close
              </button>
              <video
                controls
                autoPlay
                src={playingEpisode.video}
                className="w-full rounded-lg"
              />
              <p className="mt-2 text-center text-gray-300">{playingEpisode.title}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Optional Footer */}
      <motion.div
        className="absolute bottom-5 w-full text-center z-20 text-gray-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        Scroll or click to explore more
      </motion.div>

      {/* Modal Preview (still works for non-series if needed) */}
      <AnimatePresence>
        {selectedShow && (
          <ShowPreviewModal show={selectedShow} onClose={() => setSelectedShow(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TerraceShows;
