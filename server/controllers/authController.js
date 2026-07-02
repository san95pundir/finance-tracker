const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Token banane ka function
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check karo email pehle se hai ya nahi
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    // Naya user banao
    const user = await User.create({ name, email, password })

    // Token banao
    const token = createToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // User dhundo
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Password check karo
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Token banao
    const token = createToken(user._id)

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}