const express = require('express');
const router = express.Router();

const {
  getComingSoonMovies,
  createComingSoonMovie,
  deleteComingSoonMovie
} = require('../controllers/comingSoonController');

// GET all
router.get('/', getComingSoonMovies);

// POST create
router.post('/', createComingSoonMovie);

// DELETE by id
router.delete('/:id', deleteComingSoonMovie);

module.exports = router;
