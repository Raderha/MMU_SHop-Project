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
    const item = await Item.find({ id: req.params.id })
    if (!item || item.length === 0) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }
    res.json(item[0])
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 관련 상품 가져오기
exports.getRelatedItems = async (req, res) => {
  try {
    const { id } = req.params
    const limit = parseInt(req.query.limit) || 4
    
    // 현재 상품 정보 가져오기
    const currentItem = await Item.findOne({ id: id })
    if (!currentItem) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }

    // 카테고리를 사용한 집계 쿼리
    const relatedItems = await Item.aggregate([
      {
        $match: {
          $and: [
            // 현재 상품 제외
            { id: { $ne: id } },
            // 카테고리가 하나라도 겹치는 상품
            { category: { $in: currentItem.category || [] } }
          ]
        }
      },
      {
        $sort: { id: 1 }
      },
      {
        $limit: limit
      }
    ])

    res.json(relatedItems)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

