import React, { useState } from 'react'
import './ProductDetailView.css'
import { addToCart } from '../utils/cart'

function ProductDetailView({ item, relatedItems, onRelatedItemClick }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('Medium')

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

  // 유효한 이미지 배열 생성 (빈 문자열, null, undefined 필터링)
  const validImages = Array.isArray(item?.image)
    ? item.image.filter(img => img && img.trim() !== "")
    : [];

  // 메인 이미지 (0번 인덱스)
  const mainImage = validImages.length > 0
    ? getImagePath(validImages[0])
    : '/items_img/default.png'

  // 썸네일 이미지들 (유효한 이미지만)
  const thumbnailImages = validImages
    .map(img => getImagePath(img))
    .filter(img => img && img.trim() !== "");

  // 수량 조절 함수
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncreaseQuantity = () => {
    const maxQuantity = item.cnt || 999
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1)
    }
  }

  // Buy Now 버튼 클릭
  const handleBuyNow = () => {
    // TODO: 구매 로직 구현
    console.log('Buy Now:', item.name, 'Quantity:', quantity)
    alert(`${item.name} ${quantity}개를 구매합니다.`)
  }

  // 장바구니에 추가
  const handleAddToCart = () => {
    addToCart(item, quantity, selectedSize, item.color)
    alert(`${item.name} ${quantity}개가 장바구니에 추가되었습니다.`)
    // 장바구니 업데이트 이벤트 발생
    window.dispatchEvent(new Event('cartUpdated'))
  }

  console.log("item.image:", item.image)
  console.log("validImages:", validImages)
  console.log("thumbnailImages:", thumbnailImages)

  return (
    <div className="product-detail-container">
      {/* 상품 상세 섹션 */}
      <div className="product-detail-section">
        {/* 좌측: 이미지 갤러리 */}
        <div className="product-images">
          <div className="images-wrapper">
            {/* 썸네일 이미지들 (왼쪽) */}
            {thumbnailImages.length > 0 && (
              <div className="thumbnail-images">
                {thumbnailImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${item.name} ${index + 1}`}
                      className="thumbnail-image"
                      onError={(e) => {
                        e.target.src = '/items_img/default.png'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            {/* 메인 이미지 (오른쪽) */}
            <div className="main-image-container">
              <img
                src={selectedImageIndex < thumbnailImages.length ? thumbnailImages[selectedImageIndex] : mainImage}
                alt={item.name}
                className="main-image"
                onError={(e) => {
                  e.target.src = '/items_img/default.png'
                }}
              />
            </div>
          </div>
        </div>

        {/* 우측: 상품 정보 */}
        <div className="product-info-section">
          <h1 className="product-detail-name">{item.name || '상품명'}</h1>
          
          <div className="product-price-section">
            <span className="product-price">{formatPrice(item.price || 0)}</span>
          </div>

          {(item.detail || item.detail_en) && (
            <div className="product-description">
              {item.detail && <p>{item.detail}</p>}
              {item.detail_en && <p>{item.detail_en}</p>}
            </div>
          )}

          {/* Color, Size와 재고를 평행으로 배치 */}
          <div className="product-attributes">
            {item.color && (
              <div className="product-color-section">
                <label className="color-label">Color:</label>
                <div className="color-options">
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: item.color.toLowerCase() }}
                    title={item.color}
                  />
                </div>
              </div>
            )}

            {/* <div className="product-size-section">
              <label className="size-label">Size:</label>
              <select
                className="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div> */}

            {item.cnt !== undefined && (
              <div className="product-stock">
                <span className="stock-label">재고: {item.cnt}개</span>
              </div>
            )}
          </div>

          {/* 수량 조절 및 구매 버튼 */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                className="quantity-btn decrease" 
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn increase" 
                onClick={handleIncreaseQuantity}
                disabled={quantity >= (item.cnt || 999)}
              >
                +
              </button>
            </div>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              title="장바구니에 추가"
            >
              🛒 장바구니
            </button>
          </div>
        </div>
      </div>

      {/* 관련 상품 섹션 */}
      {relatedItems && relatedItems.length > 0 && (
        <div className="related-items-section">
          <h2 className="related-items-title">Related Item</h2>
          <div className="related-items-grid">
            {relatedItems.map((relatedItem) => (
              <div
                key={relatedItem._id || relatedItem.id}
                className="related-item-card"
                onClick={() => onRelatedItemClick && onRelatedItemClick(relatedItem)}
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

export default ProductDetailView

