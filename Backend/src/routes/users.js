const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// 사용자 프로필 가져오기
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
})

module.exports = router

