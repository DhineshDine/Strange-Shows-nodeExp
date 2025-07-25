  import React, { useEffect, useState } from 'react';
  import axios from 'axios';

  const NowPlayingAdmin = () => {
    const [movies, setMovies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
      movieTitle: '',
      description: '',
      releaseDate: '',
      showTime: '',
      ticketPrice: '',
      directorName: '',
      cast: '',
      location: '',
      duration: '', 
      poster: null,
    });
    const [editingId, setEditingId] = useState(null);
    const [existingPoster, setExistingPoster] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api';

    // ✅ Fetch all movies (no location filter)
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/nowplaying/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Fetched movies:', data);
    
        setMovies(data?.data || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    

    // ✅ Fetch locations for the dropdown in the form
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched locations:', data);

        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    useEffect(() => {
      fetchMovies();
      fetchLocations();
    }, []);

    

    // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'poster' && files && files[0]) {
      const file = files[0];

      // Update form data
      setFormData((prevData) => ({ ...prevData, poster: file }));

      // Show preview using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingPoster(reader.result); // Base64 image data
      };
      reader.readAsDataURL(file); // Trigger the reader
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  // ✅ Poster Upload and Preview
  <div className="space-y-2">
    {existingPoster && (
      <div className="mb-2">
        <p className="text-sm text-gray-400">Preview:</p>
        <img
          src={existingPoster}  // This will show the preview URL
          alt="Poster Preview"
          className="w-full h-40 object-cover rounded"
        />
      </div>
    )}
    <input
      type="file"
      name="poster"
      accept="image/*"
      onChange={handleChange}
      className="w-full p-2 rounded bg-gray-700 text-white"
    />
  </div>

    // ✅ Add/Edit Movie
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      setError('');
      setMessage('');
    
      if (!formData.location) {
        setError('❌ Please select a location.');
        return;
      }
    
      if (!formData.movieTitle || !formData.releaseDate || !formData.showTime || !formData.ticketPrice) {
        setError('❌ Please fill in all the required fields.');
        return;
      }
    
      if (!editingId && !formData.poster) {
        setError('❌ Please upload a movie poster.');
        return;
      }
    
      const form = new FormData();
    
      form.append('movieTitle', formData.movieTitle);
      form.append('description', formData.description);
      form.append('releaseDate', formData.releaseDate);
      form.append('showTime', formData.showTime);
      form.append('ticketPrice', formData.ticketPrice);
      form.append('directorName', formData.directorName || '');
      form.append('location', formData.location);
      form.append('duration', formData.duration);
      form.append('cast', formData.cast); // Send as comma-separated string

    {/*
      // Change cast to plain array (without JSON.stringify)
      const castArray = formData.cast.split(',').map(item => item.trim());
      castArray.forEach((actor, index) => {
        form.append(`cast[${index}]`, actor);
      });
    */}
      // Poster
      if (formData.poster instanceof File) {
        form.append('poster', formData.poster);
      }
    
      try {
        setLoading(true);
    
        if (editingId) {
          await axios.put(`${API_BASE_URL}/nowplaying/${editingId}`, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setMessage('✅ Movie updated successfully!');
        } else {
          await axios.post(`${API_BASE_URL}/nowplaying`, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          setMessage('✅ Movie added successfully!');
        }
    
        resetForm();
        fetchMovies();
      } catch (err) {
        console.error(err);
        setError('❌ Failed to save movie.');
      } finally {
        setLoading(false);
      }
    };
    
    // ✅ Reset the form fields
    const resetForm = () => {
      setFormData({
        movieTitle: '',
        description: '',
        releaseDate: '',
        showTime: '',
        ticketPrice: '',
        directorName: '',
        cast: '',
        location: '',
        duration: '',
        poster: null,
      });
      setExistingPoster('');
      setEditingId(null);
      setError('');
      setMessage('');
    };

    // ✅ Edit movie handler
    const handleEdit = (movie) => {
      setFormData({
        movieTitle: movie.movieTitle,
        description: movie.description,
        releaseDate: movie.releaseDate.split('T')[0],
        showTime: movie.showTime,
        ticketPrice: movie.ticketPrice,
        directorName: movie.directorName,
        cast: movie.cast.join(', '),
        location: movie.location,
        duration: movie.duration?.toString() || '', 
        poster: null, // new poster will be uploaded manually
      });
    
      setExistingPoster(movie.poster); // just filename; rendered properly in updated JSX
      setEditingId(movie._id);
      setMessage('');
      setError('');
    };
    

    // ✅ Delete movie handler
    const handleDelete = async (movieId) => {
      if (!window.confirm('Are you sure you want to delete this movie?')) return;
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/nowplaying/${movieId}`);
        setMovies((prev) => prev.filter((movie) => movie._id !== movieId));
        setMessage('🗑️ Movie deleted successfully.');
      } catch (err) {
        console.error(err);
        setError('❌ Failed to delete movie.');
      } finally {
        setLoading(false);
      }
    };

    // ✅ Clear messages after a delay
    useEffect(() => {
      if (message || error) {
        const timer = setTimeout(() => {
          setMessage('');
          setError('');
        }, 4000);
        return () => clearTimeout(timer);
      }
    }, [message, error]);

    return (
      <div className="p-8 text-white bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Now Playing Admin Panel</h1>

        {loading && <p className="text-yellow-400 text-center mb-4">Loading...</p>}
        {message && <div className="text-green-400 mb-4 text-center">{message}</div>}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* ✅ Add/Edit Movie Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-gray-800 p-6 rounded-xl">
          <input
            type="text"
            name="movieTitle"
            value={formData.movieTitle}
            onChange={handleChange}
            placeholder="Movie Title"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="text"
            name="showTime"
            value={formData.showTime}
            onChange={handleChange}
            placeholder="Show Time (e.g. 7:00 PM)"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="Ticket Price"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (in minutes)"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />


          <input
            type="text"
            name="directorName"
            value={formData.directorName}
            onChange={handleChange}
            placeholder="Director Name"
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <input
            type="text"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
            placeholder="Cast (comma separated)"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          {/* ✅ Location Dropdown */}
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

        {/* ✅ Poster Upload */}
  <div className="space-y-2">
    {existingPoster && (
      <div className="mb-2">
        <p className="text-sm text-gray-400">Preview:</p>
        <img
          src={
            existingPoster.startsWith('data:')
              ? existingPoster // preview from FileReader
              : `http://localhost:5000/uploads/${existingPoster}` // saved poster
          }
          alt="Poster Preview"
          className="w-full h-40 object-cover rounded"
        />
      </div>
    )}
    <input
      type="file"
      name="poster"
      accept="image/*"
      onChange={handleChange}
      className="w-full p-2 rounded bg-gray-700 text-white"
    />
  </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="flex-1 mr-2 p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
              disabled={loading}
            >
              {editingId ? 'Update Movie' : 'Add Movie'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 p-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

              {/* ✅ Movies Table */}
              <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Now Playing Movies</h2>
          {movies.length === 0 ? (
            <p className="text-gray-400">No movies found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="text-left bg-gray-700">
                    <th className="p-3">Poster</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Duration</th>

                    <th className="p-3">Location</th>
                    <th className="p-3">Show Time</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie._id} className="border-t border-gray-600">
                      <td className="p-3">
                        <img
                          src={`http://localhost:5000/uploads/${movie.poster}`}
                          alt="poster"
                          className="w-20 h-24 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">{movie.movieTitle}</td>
                      <td className="p-3">{movie.duration} min</td>

                      <td className="p-3">{movie.location}</td>
                      <td className="p-3">{movie.showTime}</td>
                      <td className="p-3">₹{movie.ticketPrice}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default NowPlayingAdmin;
