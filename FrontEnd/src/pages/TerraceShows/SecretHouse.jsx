import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const directors = [
  {
    id: 1,
    name: 'Wes Anderson',
    description: 'Wesley Wales Anderson (born May 1, 1969) is an American filmmaker. His films are known for themes of grief, loss of innocence, and dysfunctional families.',
    image: '/images/Wes-World-Wes+Anderson-01.webp',
    trivia: 'He often uses rain as a metaphor for isolation in his films.',
    films: ['The Grand Journey', 'Midnight Forest', 'Moonrise Whimsy'],
    awards: ['Best ScreenPlay - British Academy Film Awards', 'New Generation Award,	Best Picture,Best Director-Los Angeles Film Critics Association Awards']
  },
  {
    id: 2,
    name: 'Paul Thomas Anderson',
    description: ' PTA, is an American filmmaker. Often described as one of the most preeminent talents of his generation',
    image: '/images/pta2.jpeg',
    trivia: 'Her film "The Lantern’s Dream" won 7 international awards in one year.',
    films: ['Hard Eight', 'Boogie Nights','Magnolia','Punch-Drunk Love','There Will Be Blood','The Master','Inherent Vice','Phantom Thread','Licorice Pizza','	One Battle After Another'],
    awards: ['Best ScreenPlay - British Academy Film Awards', 'New Generation Award,	Best Picture,Best Director-Los Angeles Film Critics Association Awards']
  },
  {
    id: 1,
    name: 'Kamal Hasan',
    description: 'Kamal Haasan, is an Indian actor, film director, film producer, screenwriter, choreographer, playback singer, lyricist, television presenter, social activist and politician ',
    image: '/images/kamal.jpeg',
    trivia: 'He often uses rain as a metaphor for isolation in his films.',
    films: ['The Grand Journey', 'Midnight Forest', 'Moonrise Whimsy'],
    awards: ['Best Director - Cannes 2015', 'Golden Globe Nominee 2018']
  },
  {
    id: 1,
    name: 'Thagaraja Kumaraja',
    description: 'Thiagarajan Kumararaja is an Indian film director and screenwriter. He made his feature film debut with the critically acclaimed neo-noir gangster film Aaranya Kaandam (2011)',
    image: '/images/tk.webp',
    trivia: 'In 2015, he was involved as a script consultant for the Tamil film Yennai Arindhaal, which was co-written and directed by Gautham Vasudev Menon.',
    films: ['Becky','Aaranya Kaandam', 'Super Deluxe', 'Modern Love Chennai'],
    awards: ['Best Director - 59th National Film Awards', 'South Indian International Movie Awards','Indian Film Festival of Melbourne','Critics Choice Film Awards']
  },

  {
    id: 1,
    name: 'Quentin Jerome Tarantino ',
    description: 'Quentin Jerome Tarantino is an American filmmaker, actor, and author.His films are characterized by graphic violence, extended dialogue often featuring much profanity, and references to popular culture. ',
    image: '/images/qt.jpg',
    trivia: 'He delayed production of Kill Bill: Vol. 1 (2003) for several months when Uma Thurman became pregnant. ',
    films: ['Reservoir Dogs','Pulp Fiction', 'Jackie Brown', 'Kill Bill: Volume 1&2','Death Proof','Inglourious Basterds','Django Unchained','	The Hateful Eight','Once Upon a Time in Hollywood'],
    awards: ['Academy Awards  ', 'Golden Globe Awards','BAFTA Awards']
  },
  
  {
    id: 1,
    name: 'Once UpOn A Time In Hollywood',
    description: 'Once Upon a Time... in Hollywood: Directed by Quentin Tarantino. With Leonardo DiCaprio, Brad Pitt, Margot Robbie, Emile Hirsch.  ',
    image: '/images/holly.jpg',
    trivia: 'He delayed production of Kill Bill: Vol. 1 (2003) for several months when Uma Thurman became pregnant. ',
    films: ['Reservoir Dogs','Pulp Fiction', 'Jackie Brown', 'Kill Bill: Volume 1&2','Death Proof','Inglourious Basterds','Django Unchained','	The Hateful Eight','Once Upon a Time in Hollywood'],
    awards: ['Academy Awards  ', 'Golden Globe Awards','BAFTA Awards']
  },
  
  
  // ... (Add films and awards for each director similarly)
];

const SecretHouse = () => {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!audioPlayed) {
      const audio = new Audio('/audio/secret-house.mp3');
      audio.volume = 0.5;
      audio.play().catch((err) => console.log('Autoplay error:', err));
      setAudioPlayed(true);
    }
  }, [audioPlayed]);

  const goBackToTerraceShows = () => {
    const soundEffect = new Audio('/audio/back-sound.mp3');
    soundEffect.play().then(() => {
      navigate('/terrace-shows');
    }).catch(() => {
      navigate('/terrace-shows');
    });
  };

  const handleCardClick = (director) => {
    setSelectedDirector(director);
  };

  const closeModal = () => {
    setSelectedDirector(null);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-white font-sans">
      {/* 🎬 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/secret-house-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🎥 Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-md z-10"></div>

      {/* 🖼️ Content */}
      <div className="relative z-20 flex flex-col justify-start items-center pt-24 pb-16 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold mb-8 text-pink-400 cursor-pointer hover:text-pink-500"
          onClick={goBackToTerraceShows}
        >
          Secret House
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg text-center text-gray-300 max-w-3xl mb-12"
        >
          Explore the minds and works of legendary directors from around the world. Dive into their cinema, discover their stories, and uncover trivia that shaped the movies we love.
        </motion.p>

        {/* 🎞️ Directors Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
          {directors.map((director, index) => (
            <motion.div
              key={director.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white bg-opacity-10 rounded-3xl overflow-hidden shadow-lg backdrop-blur-md border border-white border-opacity-20 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleCardClick(director)}
            >
              <img
                src={director.image}
                alt={director.name}
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-pink-300 mb-2">
                  {director.name}
                </h2>
                <p className="text-sm text-gray-300 mb-4">{director.description}</p>
                <div className="text-xs text-gray-400 italic">🎬 Trivia: {director.trivia}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optional Footer */}
      <motion.div
        className="absolute bottom-5 w-full text-center z-20 text-gray-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        Click a director to explore their journey ✨
      </motion.div>

      {/* Modal Overlay for Selected Director */}
      <AnimatePresence>
        {selectedDirector && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-2xl hover:text-pink-400 transition"
              >
                &times;
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedDirector.image}
                  alt={selectedDirector.name}
                  className="w-full md:w-1/2 rounded-2xl object-cover"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h2 className="text-3xl font-bold text-pink-400 mb-2">{selectedDirector.name}</h2>
                    <p className="text-gray-300 mb-4">{selectedDirector.description}</p>
                    <p className="text-sm text-gray-400 italic mb-4">🎬 Trivia: {selectedDirector.trivia}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-pink-300 mb-2">Films</h3>
                    <ul className="list-disc list-inside text-gray-200 space-y-1">
                      {selectedDirector.films.map((film, idx) => (
                        <li key={idx}>{film}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-pink-300 mb-2">Awards</h3>
                    <ul className="list-disc list-inside text-gray-200 space-y-1">
                      {selectedDirector.awards.map((award, idx) => (
                        <li key={idx}>{award}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecretHouse;
