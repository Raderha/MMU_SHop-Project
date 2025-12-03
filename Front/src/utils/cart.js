// 장바구니 관리 유틸리티 (데이터베이스 기반)

import { cartAPI } from './api'

// 장바구니 가져오기
export const getCart = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      // 로그인하지 않은 경우 빈 배열 반환
      return []
    }
    const cart = await cartAPI.getCart()
    return cart || []
  } catch (error) {
    console.error('장바구니를 불러오는 중 오류 발생:', error)
    // 인증 오류인 경우 빈 배열 반환
    if (error.response?.status === 401) {
      return []
    }
    return []
  }
}

// 장바구니 저장하기 (동기화용 - 실제로는 서버에 저장됨)
export const saveCart = async (cart) => {
  // 이 함수는 호환성을 위해 유지하지만 실제로는 사용되지 않음
  // 장바구니 변경은 각각의 함수(addToCart, updateCartItem 등)에서 처리
  window.dispatchEvent(new Event('cartUpdated'))
}

// 장바구니에 아이템 추가
export const addToCart = async (item, quantity = 1, size = 'Medium', color = null) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const itemId = item.id || item._id
    const image = item.image && Array.isArray(item.image) && item.image.length > 0 
      ? item.image[0] 
      : '/items_img/default.png'

    const cart = await cartAPI.addToCart({
      itemId: String(itemId),
      name: item.name,
      image: image,
      price: item.price,
      quantity: quantity
    })

    // 다른 탭/창에 변경사항 알림
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
  } catch (error) {
    console.error('장바구니에 추가하는 중 오류 발생:', error)
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다.')
    }
    throw error
  }
}

// 장바구니에서 아이템 제거
export const removeFromCart = async (itemId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const cart = await cartAPI.removeFromCart(String(itemId))
    
    // 다른 탭/창에 변경사항 알림
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
  } catch (error) {
    console.error('장바구니에서 제거하는 중 오류 발생:', error)
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다.')
    }
    throw error
  }
}

// 장바구니에서 모든 아이템 제거
export const clearCart = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const cart = await cartAPI.clearCart()
    
    // 다른 탭/창에 변경사항 알림
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
  } catch (error) {
    console.error('장바구니를 비우는 중 오류 발생:', error)
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다.')
    }
    throw error
  }
}

// 장바구니 아이템 수량 업데이트
export const updateCartItemQuantity = async (itemId, newQuantity) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('로그인이 필요합니다.')
    }

    const cart = await cartAPI.updateCartItem(String(itemId), newQuantity)
    
    // 다른 탭/창에 변경사항 알림
    window.dispatchEvent(new Event('cartUpdated'))
    return cart
  } catch (error) {
    console.error('장바구니 수량 업데이트 중 오류 발생:', error)
    if (error.response?.status === 401) {
      throw new Error('로그인이 필요합니다.')
    }
    throw error
  }
}

// 장바구니 아이템 개수 가져오기
export const getCartItemCount = async () => {
  try {
    const cart = await getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
  } catch (error) {
    console.error('장바구니 개수 조회 중 오류 발생:', error)
    return 0
  }
}
