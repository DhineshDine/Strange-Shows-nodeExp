const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  date: { type: String, required: true }, // ISO date string
  time: { type: String, required: true },
});

module.exports = mongoose.model("Event", eventSchema);
