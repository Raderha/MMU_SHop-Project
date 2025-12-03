import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import ShoppingCart from '../components/ShoppingCart'
import { getCartItemCount } from '../utils/cart'

function ShoppingCartPage() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    updateCartCount()
    
    // 장바구니 변경 시 카운트 업데이트
    const handleCartUpdate = () => {
      updateCartCount()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const updateCartCount = async () => {
    try {
      const count = await getCartItemCount()
      setCartCount(count)
    } catch (error) {
      console.error('장바구니 개수 조회 오류:', error)
      setCartCount(0)
    }
  }

  return (
    <div className="shopping-cart-page">
      <Header cartCount={cartCount} />
      <ShoppingCart />
    </div>
  )
}

export default ShoppingCartPage

