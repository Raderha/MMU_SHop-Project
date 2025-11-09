const Product = require('../models/Product')

// 모든 상품 가져오기
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 상품 하나 가져오기
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 상품 생성 (관리자용)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 상품 수정 (관리자용)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

// 상품 삭제 (관리자용)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' })
    }
    res.json({ message: '상품이 삭제되었습니다.' })
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message })
  }
}

