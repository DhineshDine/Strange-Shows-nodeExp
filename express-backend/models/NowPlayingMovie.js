const mongoose = require('mongoose');

const nowPlayingMovieSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  releaseDate: { type: Date, required: true },
  showTime: { type: String, required: true, trim: true },
  ticketPrice: { type: Number, required: true, min: [0, 'Ticket price must be positive'] },
  directorName: { type: String, required: true, trim: true },
  cast: [{ type: String, trim: true }],
  duration: {
    type: Number,
    required: false, // or true if you want to enforce it
  },
    poster: { type: String, default: '' },
  location: { type: String, required: true, trim: true },
}, {
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('NowPlayingMovie', nowPlayingMovieSchema);
