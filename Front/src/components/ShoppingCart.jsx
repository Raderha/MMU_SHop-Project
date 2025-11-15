import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ShoppingCart.css'
import { getCart, removeFromCart, updateCartItemQuantity, clearCart } from '../utils/cart'
import api from '../utils/api'

function ShoppingCart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [promocode, setPromocode] = useState('')
  const [appliedPromocode, setAppliedPromocode] = useState('')
  const [relatedItems, setRelatedItems] = useState([])

  useEffect(() => {
    loadCart()
    
    // 다른 탭/창에서 장바구니 변경 시 업데이트
    const handleCartUpdate = () => {
      loadCart()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // 장바구니 아이템이 변경되면 관련 상품 다시 가져오기
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchRelatedItems()
    } else {
      // 장바구니가 비어있으면 관련 아이템도 초기화
      setRelatedItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length])

  const loadCart = () => {
    const cart = getCart()
    setCartItems(cart)
  }

  // 이미지 경로 가져오기
  const getImagePath = (imagePath) => {
    if (!imagePath) return '/items_img/default.png'
    if (imagePath.startsWith('/items_img/')) {
      return imagePath
    }
    return `/items_img/${imagePath}`
  }

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(price)
  }

  // 수량 변경
  const handleQuantityChange = (itemId, size, color, newQuantity) => {
    updateCartItemQuantity(itemId, size, color, newQuantity)
    loadCart()
  }

  // 아이템 제거
  const handleRemoveItem = (itemId, size, color) => {
    removeFromCart(itemId, size, color)
    loadCart()
  }

  // 모든 아이템 제거
  const handleRemoveAll = () => {
    if (window.confirm('장바구니의 모든 상품을 제거하시겠습니까?')) {
      clearCart()
      loadCart()
    }
  }

  // 프로모 코드 적용
  const handleApplyPromocode = () => {
    if (promocode.trim()) {
      setAppliedPromocode(promocode.trim())
      // 실제 프로모 코드 검증 로직은 여기에 추가 가능
    }
  }

  // 관련 상품 가져오기
  const fetchRelatedItems = async () => {
    try {
      // 모든 상품 가져오기
      const response = await api.get('/items')
      const allItems = response.data

      // 장바구니에 있는 상품들의 카테고리 수집
      const cartCategories = new Set()
      cartItems.forEach(cartItem => {
        // 장바구니 아이템에서 카테고리 정보가 없으므로, 전체 아이템에서 찾기
        const fullItem = allItems.find(item => (item.id || item._id) === cartItem.id)
        if (fullItem && fullItem.category) {
          fullItem.category.forEach(cat => cartCategories.add(cat))
        }
      })

      // 카테고리가 겹치는 상품 찾기 (장바구니에 있는 상품 제외)
      const cartItemIds = new Set(cartItems.map(item => item.id))
      const related = []
      
      for (const item of allItems) {
        const itemId = item.id || item._id
        // 장바구니에 없는 상품만
        if (cartItemIds.has(itemId)) {
          continue
        }

        // 카테고리 비교
        const itemCategories = item.category || []
        const hasCommonCategory = Array.from(cartCategories).some(cat => 
          itemCategories.includes(cat)
        )

        if (hasCommonCategory) {
          related.push(item)
          // 최대 4개까지만
          if (related.length >= 4) {
            break
          }
        }
      }

      // 카테고리로 찾지 못한 경우, 랜덤으로 4개 선택
      if (related.length === 0) {
        const availableItems = allItems.filter(item => {
          const itemId = item.id || item._id
          return !cartItemIds.has(itemId)
        })
        setRelatedItems(availableItems.slice(0, 4))
      } else {
        setRelatedItems(related)
      }
    } catch (err) {
      console.error('관련 상품을 불러오는 중 오류 발생:', err)
    }
  }

  // 관련 상품 클릭 핸들러
  const handleRelatedItemClick = (relatedItem) => {
    const itemId = relatedItem.id || relatedItem._id
    if (itemId) {
      navigate(`/product/${itemId}`)
      window.scrollTo(0, 0)
    }
  }

  // 계산
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryCost = 2500 // 고정 배달비
  const discountThreshold = 50000
  const discount = subtotal >= discountThreshold ? Math.floor(subtotal * 0.05) : 0
  const total = subtotal + deliveryCost - discount

  return (
    <div className="shopping-cart-container">
      <div className="cart-content">
        {/* 왼쪽: 상품 목록 */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h2 className="cart-title">Your cart</h2>
            <p className="cart-item-count">{cartItems.length} Products in Your cart</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>장바구니가 비어있습니다.</p>
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/')}
              >
                쇼핑 계속하기
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item, index) => {
                  const itemTotal = item.price * item.quantity
                  return (
                    <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="cart-item-card">
                      <div className="cart-item-image">
                        <img
                          src={getImagePath(item.image)}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = '/items_img/default.png'
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <div className="cart-item-info">
                          <span>Color: {item.color}</span>
                          <span>Size: {item.size}</span>
                          <span>Price: {formatPrice(item.price)} / per item</span>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-selector-wrapper">
                          <label>Qty:</label>
                          <select
                            className="quantity-select"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, item.size, item.color, parseInt(e.target.value))}
                          >
                            {Array.from({ length: Math.min(item.maxQuantity, 10) }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="cart-item-remove-btn"
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                          title="제거"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="cart-item-total">
                        {formatPrice(itemTotal)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="remove-all-section">
                <button className="remove-all-btn" onClick={handleRemoveAll}>
                  Remove all from cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* 오른쪽: 주문 요약 */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="promocode-section">
              <input
                type="text"
                className="promocode-input"
                placeholder="Promocode"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value)}
              />
              <button className="apply-promocode-btn" onClick={handleApplyPromocode}>
                Apply
              </button>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>{cartItems.length} items:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Delivery cost:</span>
                <span>{formatPrice(deliveryCost)}</span>
              </div>
              {discount > 0 && (
                <div className="price-row discount">
                  <span>Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="total-section">
              <span className="total-label">Total:</span>
              <span className="total-amount">{formatPrice(total)}</span>
            </div>

            <button className="checkout-btn" onClick={() => alert('구매 기능은 추후 구현 예정입니다.')}>
              Checkout →
            </button>

            <div className="delivery-info">
              <span className="delivery-icon">🚚</span>
              <span className="delivery-text">택배 배송은 평균적으로 2~3일이 소요 됩니다.</span>
            </div>
          </div>
        </div>
      </div>
      {relatedItems && relatedItems.length > 0 && (
        <div className="related-items-section">
          <h2 className="related-items-title">Recommended Item</h2>
          <div className="related-items-grid">
            {relatedItems.map((relatedItem) => (
              <div
                key={relatedItem._id || relatedItem.id}
                className="related-item-card"
                onClick={() => handleRelatedItemClick(relatedItem)}
              >
                <div className="related-item-image-container">
                  <img
                    src={relatedItem.image && Array.isArray(relatedItem.image) && relatedItem.image.length > 0
                      ? getImagePath(relatedItem.image[0])
                      : '/items_img/default.png'}
                    alt={relatedItem.name}
                    className="related-item-image"
                    onError={(e) => {
                      e.target.src = '/items_img/default.png'
                    }}
                  />
                </div>
                <div className="related-item-info">
                  <h3 className="related-item-name">{relatedItem.name}</h3>
                  <div className="related-item-price">
                    {formatPrice(relatedItem.price || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShoppingCart

