const Item = require('../models/Item')

// 모든 상품 가져오기
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ id: 1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 상품 하나 가져오기
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id })
    if (!item) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

