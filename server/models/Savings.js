const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetAmount: { type: Number, required: true },
  month: { type: Number },
  year: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Savings', savingsSchema);