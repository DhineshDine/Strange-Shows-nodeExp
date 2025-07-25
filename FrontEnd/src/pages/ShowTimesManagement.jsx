import React, { useState, useEffect } from 'react';
import { getShowtimes, addShowtime, updateShowtime, deleteShowtime } from "./api";

const ShowtimesManagement = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [formData, setFormData] = useState({
        showDate: '',
        showTime: '',
        movieId: '',
        totalSeats: '',
        locationId: '' // Added locationId to formData
    });
    const [editId, setEditId] = useState(null);
    const [locations, setLocations] = useState([]); // New state for locations

    useEffect(() => {
        fetchShowtimes();
        fetchLocations(); // Fetch locations when component loads
    }, []);

    const fetchShowtimes = async () => {
        try {
            const data = await getShowtimes();
            setShowtimes(data);
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const res = await fetch("http://localhost:5289/api/locations");
            const data = await res.json();
            setLocations(data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.locationId) {
            alert('Please select a location!');
            return;
        }

        if (editId) {
            await updateShowtime(editId, formData);
        } else {
            await addShowtime(formData);
        }

        setFormData({ showDate: '', showTime: '', movieId: '', totalSeats: '', locationId: '' });
        setEditId(null);
        fetchShowtimes();
    };

    const handleEdit = (showtime) => {
        setFormData({
            showDate: showtime.showDate.split('T')[0],
            showTime: showtime.showTime,
            movieId: showtime.movieId,
            totalSeats: showtime.totalSeats,
            locationId: showtime.locationId || '' // assuming you have locationId in showtime
        });
        setEditId(showtime.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this showtime?')) {
            await deleteShowtime(id);
            fetchShowtimes();
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Showtimes Management</h1>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-4">
                <div className="mb-2">
                    <label className="block text-white">Show Date</label>
                    <input
                        type="date"
                        name="showDate"
                        value={formData.showDate}
                        onChange={handleChange}
                        className="w-full p-2 text-black bg-white rounded"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-white">Show Time</label>
                    <input
                        type="time"
                        name="showTime"
                        value={formData.showTime}
                        onChange={handleChange}
                        className="w-full p-2 text-black bg-white rounded"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-white">Movie ID</label>
                    <input
                        type="number"
                        name="movieId"
                        placeholder="Enter movie ID"
                        value={formData.movieId}
                        onChange={handleChange}
                        className="w-full p-2 text-black bg-white rounded"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-white">Total Seats</label>
                    <input
                        type="number"
                        name="totalSeats"
                        placeholder="Enter total seats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        className="w-full p-2 text-black bg-white rounded"
                        required
                    />
                </div>

                {/* Location Dropdown */}
                <div className="mb-4">
                    <label className="block text-white">Location</label>
                    <select
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                        className="w-full p-2 text-black bg-white rounded"
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} - {loc.address}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    {editId ? 'Update Showtime' : 'Add Showtime'}
                </button>
            </form>

            {/* Showtimes Table */}
            <table className="w-full text-left bg-gray-900 rounded overflow-hidden">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="p-2">ID</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Movie ID</th>
                        <th className="p-2">Seats</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {showtimes.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center text-gray-400 p-4">
                                No showtimes available.
                            </td>
                        </tr>
                    ) : (
                        showtimes.map((st) => (
                            <tr key={st.id} className="border-t border-gray-700 text-white">
                                <td className="p-2">{st.id}</td>
                                <td className="p-2">{st.showDate.split('T')[0]}</td>
                                <td className="p-2">{st.showTime}</td>
                                <td className="p-2">{st.movieId}</td>
                                <td className="p-2">{st.totalSeats}</td>
                                <td className="p-2">
                                    {
                                        locations.find((loc) => loc.id === st.locationId)?.name || "N/A"
                                    }
                                </td>
                                <td className="p-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(st)}
                                        className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(st.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ShowtimesManagement;
