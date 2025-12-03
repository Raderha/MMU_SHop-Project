const User = require('../models/User')

// 장바구니 가져오기
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart')
    res.json(user.cart || [])
  } catch (error) {
    console.error('장바구니 조회 오류:', error)
    res.status(500).json({ message: '장바구니를 불러오는 중 오류가 발생했습니다.', error: error.message })
  }
}

// 장바구니에 아이템 추가
exports.addToCart = async (req, res) => {
  try {
    const { itemId, name, image, price, quantity } = req.body

    // 필수 필드 검증
    if (!itemId || !name || !image || price === undefined || !quantity) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' })
    }

    // 수량 검증
    if (quantity < 1) {
      return res.status(400).json({ message: '수량은 1 이상이어야 합니다.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    // cart 필드가 없으면 초기화
    if (!user.cart) {
      user.cart = []
    }

    // 이미 같은 itemId가 있는지 확인
    const existingItemIndex = user.cart.findIndex(item => item.itemId === itemId)

    if (existingItemIndex >= 0) {
      // 이미 있으면 수량 증가
      user.cart[existingItemIndex].quantity += quantity
    } else {
      // 없으면 새로 추가
      user.cart.push({
        itemId,
        name,
        image,
        price,
        quantity
      })
    }

    await user.save()

    res.json(user.cart)
  } catch (error) {
    console.error('장바구니 추가 오류:', error)
    res.status(500).json({ message: '장바구니에 추가하는 중 오류가 발생했습니다.', error: error.message })
  }
}

// 장바구니 아이템 수량 업데이트
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: '유효한 수량을 입력해주세요.' })
    }

    const user = await User.findById(req.user.id)
    if (!user || !user.cart) {
      return res.status(404).json({ message: '장바구니를 찾을 수 없습니다.' })
    }

    const itemIndex = user.cart.findIndex(item => item.itemId === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ message: '장바구니에 해당 상품이 없습니다.' })
    }

    if (quantity === 0) {
      // 수량이 0이면 제거
      user.cart.splice(itemIndex, 1)
    } else {
      // 수량 업데이트
      user.cart[itemIndex].quantity = quantity
    }

    await user.save()

    res.json(user.cart)
  } catch (error) {
    console.error('장바구니 업데이트 오류:', error)
    res.status(500).json({ message: '장바구니를 업데이트하는 중 오류가 발생했습니다.', error: error.message })
  }
}

// 장바구니에서 아이템 제거
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params

    const user = await User.findById(req.user.id)
    if (!user || !user.cart) {
      return res.status(404).json({ message: '장바구니를 찾을 수 없습니다.' })
    }

    const itemIndex = user.cart.findIndex(item => item.itemId === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ message: '장바구니에 해당 상품이 없습니다.' })
    }

    user.cart.splice(itemIndex, 1)
    await user.save()

    res.json(user.cart)
  } catch (error) {
    console.error('장바구니 제거 오류:', error)
    res.status(500).json({ message: '장바구니에서 제거하는 중 오류가 발생했습니다.', error: error.message })
  }
}

// 장바구니 비우기
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    }

    user.cart = []
    await user.save()

    res.json([])
  } catch (error) {
    console.error('장바구니 비우기 오류:', error)
    res.status(500).json({ message: '장바구니를 비우는 중 오류가 발생했습니다.', error: error.message })
  }
}

