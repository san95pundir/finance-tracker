const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  limits: {
    eating:        { type: Number, default: 0 },
    stationery:    { type: Number, default: 0 },
    travel:        { type: Number, default: 0 },
    personal:      { type: Number, default: 0 },
    work:          { type: Number, default: 0 },
    shopping:      { type: Number, default: 0 },
    gifts:         { type: Number, default: 0 },
    entertainment: { type: Number, default: 0 },
    emi_rent:      { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

// Ek user ka ek month mein sirf ek budget
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true })

module.exports = mongoose.model('Budget', budgetSchema)