const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getCategorySummary
} = require('../controllers/transactionController')

router.use(protect) // Saare routes protected hain

router.post('/', addTransaction)
router.get('/', getTransactions)
router.delete('/:id', deleteTransaction)
router.get('/summary', getCategorySummary)

module.exports = router