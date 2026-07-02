const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
  setSavingsGoal,
  getSavingsGoal,
  updateSavedAmount
} = require('../controllers/savingsController')

router.use(protect)

router.post('/', setSavingsGoal)
router.get('/', getSavingsGoal)
router.patch('/update', updateSavedAmount)

module.exports = router