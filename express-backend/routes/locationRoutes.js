const express = require('express');
const router = express.Router();

const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

// ✅ Routes
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
