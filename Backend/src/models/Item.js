const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cnt: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  color: {
    type: String,
    required: true
  },
  category: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: [String],
    default: []
  }
}, {
  collection: 'items'
})

module.exports = mongoose.model('Item', itemSchema)

