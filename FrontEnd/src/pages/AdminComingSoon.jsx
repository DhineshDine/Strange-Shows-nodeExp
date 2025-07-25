import React, { useState, useEffect } from "react";

const AdminComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseDate: "",
    posterUrl: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/coming-soon");
      const data = await res.json();
      setMovies(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({
          title: "",
          description: "",
          releaseDate: "",
          posterUrl: "",
        });
        fetchMovies();
      } else {
        console.error("Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/coming-soon/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMovies();
      } else {
        console.error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin - Coming Soon Movies</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
          required
        />
        <input
          type="text"
          name="releaseDate"
          placeholder="Release Date (e.g., MAR 17)"
          value={form.releaseDate}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
          required
        />
        <input
          type="text"
          name="posterUrl"
          placeholder="Poster URL"
          value={form.posterUrl}
          onChange={handleChange}
          className="w-full p-2 rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 px-6 py-2 rounded text-black font-bold hover:bg-yellow-400"
        >
          Add Movie
        </button>
      </form>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-xl">Loading movies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">
              No Coming Soon Movies Found!
            </div>
          ) : (
            movies.map((movie) => (
              <div key={movie._id} className="bg-zinc-800 p-4 rounded shadow-md">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-48 w-full object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
                <p className="text-gray-400 text-sm mb-2">
  {new Date(movie.releaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
</p>
                <p className="text-sm mb-3">{movie.description}</p>
                <button
                  onClick={() => handleDelete(movie._id)}
                  className="bg-red-500 px-4 py-2 rounded text-white font-semibold hover:bg-red-400"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminComingSoon;
