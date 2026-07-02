const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const { setBudget, getBudgets } = require('../controllers/budgetController')

router.use(protect)

router.post('/', setBudget)
router.get('/', getBudgets)

module.exports = router