import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const BASE_EVENT_URL = "http://localhost:5000/api/events";

  // Fetch all events when component mounts
  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const res = await fetch(BASE_EVENT_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const daysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

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

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const days = Array.from(
    { length: daysInMonth(year, month) },
    (_, i) => i + 1
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Movie Calendar
      </h1>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Previous
        </button>

        <div className="text-xl font-semibold">
          {selectedDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </div>

        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {days.map((day) => (
          <div
            key={day}
            className="border border-gray-700 rounded p-2 hover:border-white transition relative"
          >
            <div className="font-bold text-sm mb-2">{day}</div>

            <div className="flex flex-col gap-1">
              {filteredEventsForDay(day).map((event) => (
                <div
                  key={event._id}
                  className="bg-indigo-600 text-xs p-1 rounded hover:bg-indigo-500 cursor-pointer"
                >
                  🎬 {event.movieTitle || "Untitled Movie"}
                  <div className="text-gray-300 text-[10px]">
                    {event.location || "Unknown Location"}
                  </div>
                  <div className="text-gray-400 text-[10px]">
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Events Message */}
      {events.length === 0 && (
        <div className="text-center text-gray-400">
          No movies scheduled for this month.
        </div>
      )}
    </div>
  );
};

export default Calendar;
