const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  status: {
    type: String,
    enum: ['Pending', 'Sample Collected', 'Processing', 'Completed'],
    default: 'Pending',
  },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
