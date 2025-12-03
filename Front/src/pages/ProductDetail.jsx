import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ProductDetailView from '../components/ProductDetailView'
import api from '../utils/api'
import { getCartItemCount } from '../utils/cart'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProductDetail()
    }
    updateCartCount()
    
    // 장바구니 변경 시 카운트 업데이트
    const handleCartUpdate = () => {
      updateCartCount()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const updateCartCount = async () => {
    try {
      const count = await getCartItemCount()
      setCartCount(count)
    } catch (error) {
      console.error('장바구니 개수 조회 오류:', error)
      setCartCount(0)
    }
  }

  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 상품 상세 정보 가져오기
      const response = await api.get(`/items/${id}`)
      const productData = response.data
      setItem(productData)

      // 관련 상품 가져오기
      await fetchRelatedItems(productData)
    } catch (err) {
      console.error('상품을 불러오는 중 오류 발생:', err)
      setError('상품을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedItems = async (currentItem) => {
    try {
      // 서버에서 관련 상품만 가져오기 (최대 4개)
      const response = await api.get(`/items/${id}/related?limit=4`)
      setRelatedItems(response.data)
    } catch (err) {
      console.error('관련 상품을 불러오는 중 오류 발생:', err)
      setRelatedItems([])
    }
  }

  const handleRelatedItemClick = (relatedItem) => {
    // 관련 상품 클릭 시 해당 상품 상세 페이지로 이동
    const itemId = relatedItem.id || relatedItem._id
    if (itemId) {
      navigate(`/product/${itemId}`)
      // 스크롤을 맨 위로 이동
      window.scrollTo(0, 0)
    }
  }

  if (loading) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>상품을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div>
        <Header cartCount={cartCount} />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>{error || '상품을 찾을 수 없습니다.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <Header cartCount={cartCount} />
      <ProductDetailView 
        item={item} 
        relatedItems={relatedItems}
        onRelatedItemClick={handleRelatedItemClick}
      />
    </div>
  )
}

export default ProductDetail

