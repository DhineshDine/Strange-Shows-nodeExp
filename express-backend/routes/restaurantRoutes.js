// routes/restaurantRoutes.js
const express = require('express');
const {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.post('/', createRestaurant);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

module.exports = router; // ✅ THIS MUST BE HERE
