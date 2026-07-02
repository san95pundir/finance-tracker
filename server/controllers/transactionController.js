const Transaction = require('../models/Transaction')

// Transaction add karo
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, subcategory, note, date } = req.body

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      subcategory,
      note,
      date: date || Date.now()
    })

    res.status(201).json({
      success: true,
      transaction
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Is month ki saari transactions lo
exports.getTransactions = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1
    const year = parseInt(req.query.year) || new Date().getFullYear()

    const transactions = await Transaction.find({
      user: req.user._id,
      month,
      year
    }).sort({ date: -1 })

    // Total income aur expense calculate karo
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    res.status(200).json({
      success: true,
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Single transaction delete karo
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Check karo yeh transaction is user ka hai
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await transaction.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Transaction deleted'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Category wise summary
exports.getCategorySummary = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1
    const year = parseInt(req.query.year) || new Date().getFullYear()

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          month,
          year
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ])

    res.status(200).json({
      success: true,
      summary
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}