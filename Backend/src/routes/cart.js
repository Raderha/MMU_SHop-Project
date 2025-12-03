const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const cartController = require('../controllers/cartController')

// 모든 라우트는 인증 필요
router.use(auth)

// 장바구니 가져오기
router.get('/', cartController.getCart)

// 장바구니에 아이템 추가
router.post('/', cartController.addToCart)

// 장바구니 아이템 수량 업데이트
router.put('/:itemId', cartController.updateCartItem)

// 장바구니에서 아이템 제거
router.delete('/:itemId', cartController.removeFromCart)

// 장바구니 비우기
router.delete('/', cartController.clearCart)

module.exports = router

