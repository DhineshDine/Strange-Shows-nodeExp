import React from "react";
import { Trash2, MapPin } from "lucide-react";

const EventCard = ({ event, onDelete }) => {
  return (
    <div className="bg-gray-700 p-2 rounded relative group text-xs hover:bg-gray-600 transition">
      {/* Movie Title */}
      <div className="font-semibold text-white">{event.movieTitle}</div>

      {/* Time */}
      <div className="text-gray-300">{event.time}</div>

      {/* ✅ Location */}
      <div className="flex items-center text-green-400 mt-1">
        <MapPin size={12} className="mr-1" />
        <span>{event.location}</span>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(event._id)}
        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
        title="Delete Event"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default EventCard;
