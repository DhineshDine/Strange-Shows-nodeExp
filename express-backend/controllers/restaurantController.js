const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('location', 'name'); // ✅ fix
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRestaurant = async (req, res) => {
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  res.status(201).json(restaurant);
};

exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
  res.json(restaurant);
};

exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  await Restaurant.findByIdAndDelete(id);
  res.json({ message: 'Restaurant deleted' });
};
