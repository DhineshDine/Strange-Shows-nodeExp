const mongoose = require("mongoose");

const comingSoonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  releaseDate: Date,
  posterUrl: String,
});

module.exports = mongoose.model("ComingSoon", comingSoonSchema);
