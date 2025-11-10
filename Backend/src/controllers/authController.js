const User = require('../models/User')
const jwt = require('jsonwebtoken')

// JWT 토큰 생성
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  })
}

// 회원가입
exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body

    // 필수 필드 검증
    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' })
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
    }

    // 전화번호를 배열로 변환 (하이픈 제거)
    const phoneNumber = phone ? phone.replace(/-/g, '').trim() : ''
    
    // 전화번호가 비어있지 않은지 확인
    if (!phoneNumber) {
      return res.status(400).json({ message: '전화번호를 입력해주세요.' })
    }

    // 사용자 생성
    const user = await User.create({
      name,
      email,
      pw: password, // pw 필드에 저장
      address,
      number: phoneNumber ? [phoneNumber] : [] // 배열로 저장
    })

    // 토큰 생성
    const token = generateToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        number: user.number
      }
    })
  } catch (error) {
    console.error('회원가입 오류:', error)
    if (error.code === 11000) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' })
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ message: messages.join(', ') })
    }
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 필수 필드 검증
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' })
    }

    // 사용자 찾기
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
    }

    // 비밀번호 확인 (pw 필드와 비교)
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
        address: user.address,
        number: user.number
      }
    })
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 현재 사용자 정보 가져오기
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-pw')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

