const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping_mall')
    console.log(`MongoDB 연결 성공: ${conn.connection.host}`)
    console.log(`데이터베이스: ${conn.connection.name}`)
  } catch (error) {
    console.error('MongoDB 연결 오류:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB

