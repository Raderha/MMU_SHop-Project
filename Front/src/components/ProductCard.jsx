import React from 'react'
import './ProductCard.css'

function ProductCard({ item }) {
  // 이미지 경로 가져오기 (배열의 0번 인덱스 사용)
  const getMainImage = () => {
    // 데이터베이스에 저장된 이미지 배열이 있고 0번 인덱스에 이미지가 있으면 사용
    if (item.image && Array.isArray(item.image) && item.image.length > 0 && item.image[0]) {
      const imagePath = item.image[0]
      // 이미 경로가 /items_img/로 시작하면 그대로 사용
      if (imagePath.startsWith('/items_img/')) {
        return imagePath
      }
      // 파일명만 있으면 /items_img/ 추가
      return `/items_img/${imagePath}`
    }

    // fallback: 이미지가 없는 경우 기본 이미지 또는 빈 문자열
    return '/items_img/default.png'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={getMainImage()}
          alt={item.name}
          className="product-image"
          onError={(e) => {
            // 이미지 배열에 다른 이미지가 있으면 시도
            if (item.image && Array.isArray(item.image) && item.image.length > 1) {
              // 1번 인덱스 이미지 시도
              const fallbackImage = item.image[1]
              if (fallbackImage) {
                const imagePath = fallbackImage.startsWith('/items_img/') 
                  ? fallbackImage 
                  : `/items_img/${fallbackImage}`
                e.target.src = imagePath
                return
              }
            }
            // 모든 시도 실패 시 콘솔에 로그
            console.warn(`이미지를 찾을 수 없습니다: ${item.name} (ID: ${item.id})`)
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{item.name}</h3>
        <div className="product-price">
          <span className="current-price">{formatPrice(item.price)}</span>
        </div>
        <div className="product-stock">
          <span className="stock-label">{item.cnt} Left</span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

