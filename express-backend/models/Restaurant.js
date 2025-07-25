const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  description: String,
  contactNumber: { type: String, required: true },
  email: String,
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
