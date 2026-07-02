const SavingsGoal = require('../models/SavingsGoal')

// Savings goal set karo
exports.setSavingsGoal = async (req, res) => {
  try {
    const { month, year, targetAmount } = req.body

    const goal = await SavingsGoal.findOneAndUpdate(
      { user: req.user._id, month, year },
      { targetAmount },
      { new: true, upsert: true }
    )

    res.status(200).json({
      success: true,
      goal
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Is month ki savings lo
exports.getSavingsGoal = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1
    const year = parseInt(req.query.year) || new Date().getFullYear()

    const goal = await SavingsGoal.findOne({
      user: req.user._id,
      month,
      year
    })

    res.status(200).json({
      success: true,
      goal
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Savings update karo
exports.updateSavedAmount = async (req, res) => {
  try {
    const { savedAmount } = req.body
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()

    const goal = await SavingsGoal.findOne({
      user: req.user._id,
      month,
      year
    })

    if (!goal) {
      return res.status(404).json({ message: 'No savings goal found for this month' })
    }

    // Status update karo
    goal.savedAmount = savedAmount
    if (savedAmount >= goal.targetAmount) {
      goal.status = 'achieved'
    } else if (savedAmount >= goal.targetAmount * 0.7) {
      goal.status = 'on_track'
    } else {
      goal.status = 'at_risk'
    }

    await goal.save()

    res.status(200).json({
      success: true,
      goal
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}