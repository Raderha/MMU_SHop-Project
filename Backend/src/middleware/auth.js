const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 없습니다.' })
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const decoded = jwt.verify(token, secret)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: '인증 토큰이 유효하지 않습니다.' })
  }
}

module.exports = auth

