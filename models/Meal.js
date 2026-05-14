const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  username:    { type: String, required: true, trim: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image:       { type: String, required: true },
  category:    { type: String, required: true, enum: ['breakfast', 'lunch', 'dinner', 'dessert'] },
  likes:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);
