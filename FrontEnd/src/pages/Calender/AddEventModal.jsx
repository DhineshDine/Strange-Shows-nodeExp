import React, { useState } from "react";

const AddEventModal = ({ locations, onAddEvent }) => {
  const [movieTitle, setMovieTitle] = useState("");
  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!movieTitle || !locationId || !date || !time) {
      alert("Please fill in all fields");
      return;
    }

    const eventData = {
      movieTitle,
      locationId,
      date,
      time,
    };

    onAddEvent(eventData);

    // Clear inputs after submit
    setMovieTitle("");
    setLocationId("");
    setDate("");
    setTime("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Movie Event</h2>

      {/* Movie Title */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Movie Title</label>
        <input
          type="text"
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
          placeholder="Enter movie title"
        />
      </div>

      {/* Location Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Location</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
        >
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date and Time */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition"
      >
        Add Event
      </button>
    </form>
  );
};

export default AddEventModal;
