const mongoose = require('mongoose')

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['on_track', 'at_risk', 'achieved', 'failed'],
    default: 'on_track'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema)