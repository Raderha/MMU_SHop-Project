const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  pw: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: [String],
    required: false,
    default: []
  }
})

// 비밀번호 해싱
userSchema.pre('save', async function (next) {
  if (!this.isModified('pw')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.pw = await bcrypt.hash(this.pw, salt)
  next()
})

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.pw)
}

module.exports = mongoose.model('User', userSchema)

