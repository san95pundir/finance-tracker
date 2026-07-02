const Budget = require('../models/Budget');

exports.setBudget = async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month, year },
      { $set: { [`limits.${category}`]: limitAmount } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budget = await Budget.findOne({ user: req.user._id, month, year });

    res.status(200).json({ success: true, budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};