import React, { useEffect, useState } from "react";
import MovieToggle from "./MovieToggle";
const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/coming-soon`);
      if (!res.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 border-b-2 pb-5">
        COMING SOON
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={fetchMovies}
          className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Refresh Movies
        </button>
      </div>

      {loading && <p className="text-center text-lg">Loading movies...</p>}

      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div
                key={movie._id}
                className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-80 w-full object-cover"
                />
                <div className="p-4">
                  {/* Movie Title */}
                  <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
                  
                  {/* Release Date */}
                  <div className="text-yellow-400 text-sm mb-2">
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  
                  {/* Movie Description */}
                  <p className="text-gray-400 text-sm">{movie.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">
              No coming soon movies available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
