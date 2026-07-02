const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'eating', 'stationery', 'travel', 'personal',
      'work', 'shopping', 'gifts', 'entertainment',
      'emi_rent', 'savings', 'other'
    ]
  },
  subcategory: {
    type: String,
    default: null
  },
  note: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  month: {
    type: Number
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
})

// Auto month & year set karo
transactionSchema.pre('save', function(next) {
  this.month = this.date.getMonth() + 1
  this.year = this.date.getFullYear()
  next()
})

// Fast queries ke liye index
transactionSchema.index({ user: 1, month: 1, year: 1 })

module.exports = mongoose.model('Transaction', transactionSchema)