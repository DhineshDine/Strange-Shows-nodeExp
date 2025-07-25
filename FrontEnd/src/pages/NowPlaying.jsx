import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // ✅ Init navigate
  const API_BASE_URL = 'http://localhost:5000'; // Update to env variables later

  // Fetch locations on mount
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const res = await axios.get(`${API_BASE_URL}/api/locations`);
      setLocations(res.data);

      if (res.data.length > 0) {
        setSelectedLocation(res.data[0].name);
        setError('');
      } else {
        setError('No locations available.');
      }
    } catch (err) {
      console.error('Failed to fetch locations', err);
      setError('Failed to load locations.');
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch movies when selectedLocation changes
// Fetch movies when selectedLocation is set
useEffect(() => {
  const fetchMovies = async () => {
    if (!selectedLocation) return; // Don’t fetch until a location is selected

    try {
      setLoadingMovies(true);
      const response = await axios.get(`${API_BASE_URL}/api/nowplaying/all?location=${selectedLocation}`);
      console.log('Fetched movies:', response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        setMovies(response.data.data);
        setError('');
      } else {
        setMovies([]);
        setError(response.data.message || 'No movies found for this location.');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Error fetching movies for this location.');
    } finally {
      setLoadingMovies(false);
    }
  };

  fetchMovies();
}, [selectedLocation]);


  // ✅ Handle the Book Now button click
  const handleBookNow = (movie) => {
    navigate("/nov-booking", { state: { movie } });

    
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8">🎬 Now Playing Movies</h1>

      {/* Location Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-12">
        <label htmlFor="location" className="text-lg text-gray-300">
          Select Location:
        </label>

        {loadingLocations ? (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        ) : locations.length > 0 ? (
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring focus:ring-blue-500 shadow-sm"
          >
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-400">No locations found.</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-400 text-center font-medium mb-8">
          {error}
        </div>
      )}

      {/* Movies Loader */}
      {loadingMovies && (
        <div className="flex justify-center items-center text-gray-300 mb-8">
          <LoaderCircle className="animate-spin mr-2" /> Loading movies...
        </div>
      )}

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loadingMovies && Array.isArray(movies) && movies.length === 0 && !error && (
          <p className="text-gray-400 col-span-full text-center italic">
            No movies playing in <span className="text-white font-semibold">{selectedLocation}</span>.
          </p>
        )}

        {Array.isArray(movies) && movies.map((movie) => (
          <div
            key={movie._id}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group"
          >
            {/* Movie Poster */}
            <img
  src={`http://localhost:5000/uploads/${movie.poster}`}
  alt={movie.movieTitle}
  className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-300"
/>


            {/* Movie Details */}
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-bold">{movie.movieTitle}</h2>
              <p className="text-sm text-gray-400">
                {new Date(movie.releaseDate).toLocaleDateString()} | {movie.showTime}
              </p>
              <p className="text-gray-300 text-sm line-clamp-3">{movie.description}</p>

              <div className="flex flex-col text-sm text-gray-400 space-y-1">
                <p>
                  <span className="font-semibold text-white">Director:</span> {movie.directorName}
                </p>
                <p>
                  <span className="font-semibold text-white">Cast:</span>{' '}
                  {Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}
                </p>
                
                  {movie.duration && (
                  <p>
                  <span className="font-semibold text-white">Duration:</span> {movie.duration} min
                  </p>
                   )}
                   
              </div>

              <p className="font-semibold text-green-400 mt-2">₹ {movie.ticketPrice}</p>

              {/* ✅ Book Now Button with navigate */}
              <button
                 className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                 onClick={() => handleBookNow(movie)}
                 >🎟️ Book Now
                 </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NowPlaying;
