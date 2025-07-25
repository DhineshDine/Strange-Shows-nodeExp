import React, { useState, useEffect } from "react";
import AddEventModal from "./AddEventModal";

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const BASE_EVENT_URL = "http://localhost:5000/api/events";
  const BASE_LOCATION_URL = "http://localhost:5000/api/locations";

  useEffect(() => {
    fetchEvents();
    fetchLocations();
  }, []);

  // Fetch Events
  const fetchEvents = async () => {
    try {
      const res = await fetch(BASE_EVENT_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Fetch Locations
  const fetchLocations = async () => {
    try {
      const res = await fetch(BASE_LOCATION_URL);
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  // Add a new Event
  const addEvent = async (eventData) => {
    try {
      const res = await fetch(BASE_EVENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error("Failed to add event");

      const newEvent = await res.json();
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event. Try again!");
    }
  };

  // Delete Event by ID
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${BASE_EVENT_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Try again!");
    }
  };

  // Utility: Get total days in a month
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  // Navigation Handlers
  const handlePrevMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Filter events for a specific day
  const filteredEventsForDay = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  // Calendar variables
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Movie Calendar</h1>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={handlePrevMonth}
          className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          ← Previous
        </button>

        <div className="text-2xl font-semibold tracking-wide">
          {selectedDate.toLocaleString("default", { month: "long" })} {year}
        </div>

        <button
          onClick={handleNextMonth}
          className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Next →
        </button>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div
            key={day}
            className="border border-gray-700 rounded-lg p-3 hover:border-white transition relative min-h-[150px]"
          >
            {/* Day Number */}
            <div className="font-bold text-lg mb-3">{day}</div>

            {/* Events in the day */}
            <div className="flex flex-col gap-2">
              {filteredEventsForDay(day).map((event) => (
                <div
                  key={event._id}
                  className="bg-gray-800 p-2 rounded relative shadow hover:shadow-lg"
                >
                  {/* Event Name */}
                  <div className="font-semibold text-yellow-400 truncate">
                    🎬 {event.movieTitle}
                  </div>

                  {/* Event Date (optional) */}
                  <div className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString()}
                  </div>

                  {/* Event Location */}
                  <div className="text-sm text-green-400 font-medium">
                    📍 {event.location}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="absolute top-1 right-1 text-red-400 hover:text-red-600 text-lg"
                    title="Delete Event"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <div className="mt-12">
        <AddEventModal locations={locations} onAddEvent={addEvent} />
      </div>
    </div>
  );
};

export default AdminCalendar;
