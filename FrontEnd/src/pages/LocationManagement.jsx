import React, { useState, useEffect } from "react";
import { FiMapPin, FiTrash2, FiEdit, FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LocationManagement = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({ name: "", address: "" });
    const [editingLocation, setEditingLocation] = useState(null);
    const [loading, setLoading] = useState(true); // true on initial load
    const [error, setError] = useState("");

    const BASE_URL = "http://localhost:5000/api/locations";

    useEffect(() => {
        fetchLocations();
    }, []);

    // ✅ Fetch Locations
    const fetchLocations = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Failed to fetch locations");

            const data = await response.json();
            setLocations(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while fetching locations");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Reset Form
    const resetForm = () => {
        setNewLocation({ name: "", address: "" });
        setEditingLocation(null);
    };

    // ✅ Add Location
    const handleAddLocation = async () => {
        if (!newLocation.name.trim() || !newLocation.address.trim()) {
            toast.warn("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLocation),
            });

            if (!response.ok) throw new Error("Failed to add location");

            const createdLocation = await response.json();
            setLocations([...locations, createdLocation]);
            toast.success("Location added successfully");
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to add location");
        }
    };

    // ✅ Edit Location (Populate Form)
    const handleEditLocation = (location) => {
        setEditingLocation(location);
        setNewLocation({ name: location.name, address: location.address });
    };

    // ✅ Update Location
    const handleUpdateLocation = async () => {
        if (!editingLocation) return;

        if (!newLocation.name.trim() || !newLocation.address.trim()) {
            toast.warn("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/${editingLocation._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLocation),
            });

            if (!response.ok) throw new Error("Failed to update location");

            const updatedLocation = await response.json();

            const updatedLocations = locations.map((loc) =>
                loc._id === editingLocation._id ? updatedLocation : loc
            );

            setLocations(updatedLocations);
            toast.success("Location updated successfully");
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to update location");
        }
    };

    // ✅ Delete Location
    const handleDeleteLocation = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this location?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete location");

            setLocations(locations.filter((loc) => loc._id !== id));
            toast.success("Location deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to delete location");
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <ToastContainer position="top-center" />

            <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                <FiMapPin className="mr-2" /> Manage Locations
            </h2>

            {/* Add/Edit Form */}
            <div className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Location Name"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Location Address"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                />

                {editingLocation ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdateLocation}
                            disabled={loading}
                            className={`flex items-center justify-center space-x-2 w-full px-4 py-2 ${loading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"} text-black rounded-lg transition`}
                        >
                            <FiEdit /> <span>Update Location</span>
                        </button>
                        <button
                            onClick={resetForm}
                            className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAddLocation}
                        disabled={loading}
                        className={`flex items-center justify-center space-x-2 w-full px-4 py-2 ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"} text-black rounded-lg transition`}
                    >
                        <FiPlusCircle /> <span>Add Location</span>
                    </button>
                )}
            </div>

            {/* Loading & Error */}
            {loading && <p className="text-gray-400">Loading locations...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {/* Location List */}
            <div className="grid gap-4">
                {!loading && locations.length === 0 ? (
                    <p className="text-gray-400">No locations available.</p>
                ) : (
                    locations.map((loc) => (
                        <div
                            key={loc._id}
                            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-white">{loc.name}</h3>
                                <p className="text-gray-300">{loc.address}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditLocation(loc)}
                                    className="p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                                >
                                    <FiEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteLocation(loc._id)}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LocationManagement;
