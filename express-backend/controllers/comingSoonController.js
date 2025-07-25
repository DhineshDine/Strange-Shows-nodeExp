const ComingSoonMovie = require('../models/ComingSoonMovie');

// GET all
exports.getComingSoonMovies = async (req, res) => {
  try {
    const movies = await ComingSoonMovie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create
exports.createComingSoonMovie = async (req, res) => {
  try {
    const movie = new ComingSoonMovie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deleteComingSoonMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await ComingSoonMovie.findByIdAndDelete(id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
