const User = require('../models/User')
const jwt = require('jsonwebtoken')

// JWT 토큰 생성
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// 회원가입
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
    }

    // 사용자 생성
    const user = await User.create({
      name,
      email,
      password
    })

    // 토큰 생성
    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 사용자 찾기
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // 토큰 생성
    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 현재 사용자 정보 가져오기
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

