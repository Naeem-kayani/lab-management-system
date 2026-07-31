const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
