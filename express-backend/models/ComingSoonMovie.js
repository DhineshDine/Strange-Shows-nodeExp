const mongoose = require('mongoose');

const comingSoonMovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  releaseDate: String,
  posterUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('ComingSoonMovie', comingSoonMovieSchema);
