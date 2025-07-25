const Food = require('../models/Food');
const path = require('path');

exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate('location', 'name')       // ✅ populate location name
      .populate('restaurant', 'name');    // optional, for restaurant name
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createFood = async (req, res) => {
  const { name, category, price, description, location, restaurant } = req.body;
  const image = req.file ? req.file.filename : null;

  const food = new Food({ name, category, price, description, location, restaurant, image });
  await food.save();
  res.status(201).json(food);
};

exports.updateFood = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (req.file) updates.image = req.file.filename;
  const food = await Food.findByIdAndUpdate(id, updates, { new: true });
  res.json(food);
};

exports.deleteFood = async (req, res) => {
  const { id } = req.params;
  await Food.findByIdAndDelete(id);
  res.json({ message: 'Food deleted' });
};
