// 장바구니 관리 유틸리티

const CART_STORAGE_KEY = 'shopping_cart'

// 장바구니 가져오기
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('장바구니를 불러오는 중 오류 발생:', error)
    return []
  }
}

// 장바구니 저장하기
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // 다른 탭/창에 변경사항 알림
    window.dispatchEvent(new Event('cartUpdated'))
  } catch (error) {
    console.error('장바구니를 저장하는 중 오류 발생:', error)
  }
}

// 장바구니에 아이템 추가
export const addToCart = (item, quantity = 1, size = 'Medium', color = null) => {
  const cart = getCart()
  const itemId = item.id || item._id
  
  // 이미 장바구니에 있는지 확인
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.id === itemId && cartItem.size === size && cartItem.color === (color || item.color)
  )
  
  if (existingItemIndex >= 0) {
    // 이미 있으면 수량 증가
    cart[existingItemIndex].quantity += quantity
  } else {
    // 없으면 새로 추가
    cart.push({
      id: itemId,
      _id: item._id || itemId,
      name: item.name,
      price: item.price,
      image: item.image && Array.isArray(item.image) && item.image.length > 0 
        ? item.image[0] 
        : '/items_img/default.png',
      quantity: quantity,
      size: size,
      color: color || item.color || 'Silver',
      maxQuantity: item.cnt || 999
    })
  }
  
  saveCart(cart)
  return cart
}

// 장바구니에서 아이템 제거
export const removeFromCart = (itemId, size, color) => {
  const cart = getCart()
  const filteredCart = cart.filter(
    item => !(item.id === itemId && item.size === size && item.color === color)
  )
  saveCart(filteredCart)
  return filteredCart
}

// 장바구니에서 모든 아이템 제거
export const clearCart = () => {
  saveCart([])
  return []
}

// 장바구니 아이템 수량 업데이트
export const updateCartItemQuantity = (itemId, size, color, newQuantity) => {
  const cart = getCart()
  const itemIndex = cart.findIndex(
    item => item.id === itemId && item.size === size && item.color === color
  )
  
  if (itemIndex >= 0) {
    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = newQuantity
    }
    saveCart(cart)
  }
  
  return cart
}

// 장바구니 아이템 개수 가져오기
export const getCartItemCount = () => {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

