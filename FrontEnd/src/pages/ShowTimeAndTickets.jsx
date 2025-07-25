import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://your-api-url.com/api/movies"; // Replace with your actual API endpoint

const ShowTimeAndTicket = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    posterUrl: "",
    showtimes: [],
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleShowtimeChange = (e) => {
    setNewMovie({ ...newMovie, showtimes: e.target.value.split(",") });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewMovie({ ...newMovie, posterUrl: response.data.url });
    } catch (error) {
      console.error("Error uploading poster:", error);
    }
  };

  const handleAddOrUpdateMovie = async () => {
    try {
      if (editingMovie) {
        await axios.put(`${API_URL}/${editingMovie.id}`, newMovie);
      } else {
        await axios.post(API_URL, newMovie);
      }
      setNewMovie({ title: "", description: "", releaseDate: "", posterUrl: "", showtimes: [] });
      setEditingMovie(null);
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setNewMovie(movie);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-yellow-500">Manage Showtimes & Tickets</h1>

      {/* Movie Form */}
      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-semibold">{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>
        <input className="w-full p-2 my-2 bg-gray-700 rounded" type="text" name="title" placeholder="Title" value={newMovie.title} onChange={handleInputChange} />
        <textarea className="w-full p-2 my-2 bg-gray-700 rounded" name="description" placeholder="Description" value={newMovie.description} onChange={handleInputChange}></textarea>
        <input className="w-full p-2 my-2 bg-gray-700 rounded" type="date" name="releaseDate" value={newMovie.releaseDate} onChange={handleInputChange} />
        <input className="w-full p-2 my-2 bg-gray-700 rounded" type="text" name="posterUrl" placeholder="Poster URL" value={newMovie.posterUrl} onChange={handleInputChange} />
        <input className="w-full p-2 my-2 bg-gray-700 rounded" type="file" onChange={handleFileUpload} />
        <input className="w-full p-2 my-2 bg-gray-700 rounded" type="text" placeholder="Showtimes (comma-separated)" value={newMovie.showtimes.join(",")} onChange={handleShowtimeChange} />
        <button className="w-full bg-yellow-500 p-2 rounded mt-2" onClick={handleAddOrUpdateMovie}>{editingMovie ? "Update Movie" : "Add Movie"}</button>
      </div>

      {/* Movie List */}
      <div className="mt-6">
        {movies.length === 0 ? <p>No movies available.</p> : movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 p-4 my-4 rounded flex justify-between">
            <div>
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p>{movie.description}</p>
              <p>Release Date: {movie.releaseDate}</p>
              <p>Showtimes: {movie.showtimes.join(", ")}</p>
              <button className="bg-blue-500 px-3 py-1 rounded mr-2" onClick={() => handleEdit(movie)}>Edit</button>
              <button className="bg-red-500 px-3 py-1 rounded" onClick={() => handleDelete(movie.id)}>Delete</button>
            </div>
            <img src={movie.posterUrl} alt={movie.title} className="w-24 h-32 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowTimeAndTicket;
