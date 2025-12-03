const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// 환경 변수 로드
dotenv.config()

// DB 연결
connectDB()

const app = express()

// 미들웨어
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 라우트
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/users', require('./routes/users'))
app.use('/api/items', require('./routes/items'))
app.use('/api/cart', require('./routes/cart'))

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: '쇼핑몰 API 서버' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)
})

