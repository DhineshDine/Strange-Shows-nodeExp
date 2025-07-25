const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Location = require("../models/Location"); // ✅ Import Location model if needed

// 🚀 Get all events with populated location details
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: "locationId",
        select: "name", // ✅ Only fetch the name field of location
      });

    // Optional: Map events to a cleaner JSON structure
    const formattedEvents = events.map((event) => ({
      _id: event._id,
      movieTitle: event.movieTitle,
      date: event.date,
      time: event.time,
      location: event.locationId ? event.locationId.name : "Unknown Location",
    }));

    res.json(formattedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new event
router.post("/", async (req, res) => {
  const { movieTitle, locationId, date, time } = req.body;

  if (!movieTitle || !locationId || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newEvent = new Event({ movieTitle, locationId, date, time });
    const savedEvent = await newEvent.save();

    // ✅ Optionally populate after saving (if needed)
    const populatedEvent = await savedEvent.populate({
      path: "locationId",
      select: "name",
    });

    res.status(201).json({
      _id: populatedEvent._id,
      movieTitle: populatedEvent.movieTitle,
      date: populatedEvent.date,
      time: populatedEvent.time,
      location: populatedEvent.locationId ? populatedEvent.locationId.name : "Unknown Location",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete event by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
