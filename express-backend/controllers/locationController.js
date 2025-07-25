const Location = require('../models/Location');

// =========================
// 📥 Get All Locations
// =========================
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 }); // latest first
    return res.status(200).json(locations);
  } catch (error) {
    console.error('❌ Error fetching locations:', error.message);
    return res.status(500).json({ message: 'Server error fetching locations' });
  }
};

// =========================
// 📥 Get Single Location By ID
// =========================
const getLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    return res.status(200).json(location);
  } catch (error) {
    console.error(`❌ Error fetching location (ID: ${id}):`, error.message);
    return res.status(500).json({ message: 'Server error fetching location' });
  }
};

// =========================
// ➕ Create New Location
// =========================
const createLocation = async (req, res) => {
  const { name, address, comingSoon } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Name and address are required' });
  }

  try {
    const newLocation = new Location({
      name,
      address,
      comingSoon: comingSoon ?? false, // fallback for undefined/null
    });

    const savedLocation = await newLocation.save();
    return res.status(201).json(savedLocation);
  } catch (error) {
    console.error('❌ Error creating location:', error.message);
    return res.status(500).json({ message: 'Server error creating location' });
  }
};

// =========================
// ✏️ Update Location
// =========================
const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, address, comingSoon } = req.body;

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Only update fields if provided
    if (name !== undefined) location.name = name;
    if (address !== undefined) location.address = address;
    if (comingSoon !== undefined) location.comingSoon = comingSoon;

    const updatedLocation = await location.save();
    return res.status(200).json(updatedLocation);
  } catch (error) {
    console.error(`❌ Error updating location (ID: ${id}):`, error.message);
    return res.status(500).json({ message: 'Server error updating location' });
  }
};

// =========================
// ❌ Delete Location
// =========================
const deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.deleteOne();
    return res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting location (ID: ${id}):`, error.message);
    return res.status(500).json({ message: 'Server error deleting location' });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
