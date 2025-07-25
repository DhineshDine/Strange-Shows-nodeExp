const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: false , default: null ,},
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },

  image: { type: String }, // Store URL or file path
}, {
  timestamps: true,
});

module.exports = mongoose.model("Food", foodSchema);
