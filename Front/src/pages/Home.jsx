import React, { useState, useEffect } from 'react'
import './Home.css'
import Header from '../components/Header'
import FilterSidebar from '../components/FilterSidebar'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'
import api from '../utils/api'

function Home() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    deals: false,
    newArrivals: false,
    nearMe: false,
    price: 'all',
    color: 'all'
  })

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [items, filters])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await api.get('/items')
      setItems(response.data)
      setFilteredItems(response.data)
    } catch (error) {
      console.error('상품을 불러오는 중 오류 발생:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...items]

    // 가격 필터
    if (filters.price === '4-12') {
      filtered = filtered.filter(item => item.price >= 4 && item.price <= 12)
    } else if (filters.price === '4-above') {
      filtered = filtered.filter(item => item.price >= 4)
    }

    // 색상 필터
    if (filters.color !== 'all') {
      const colorMap = {
        black: 'black',
        red: 'red',
        blue: 'blue',
        green: 'green',
        brown: 'brown'
      }
      filtered = filtered.filter(item => 
        item.color && item.color.toLowerCase() === colorMap[filters.color]
      )
    }

    // 카테고리 필터 (Deals, New Arrivals, Near Me는 추후 구현 가능)
    // 현재는 기본 필터링만 적용

    setFilteredItems(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="home">
      <Header cartCount={0} />
      
      <div className="main-container">
        <FilterSidebar onFilterChange={handleFilterChange} />
        
        <div className="content-area">
          <Banner />
          
          <div className="products-section">
            <h2 className="section-title">All Products</h2>
            
            {loading ? (
              <div className="loading">상품을 불러오는 중...</div>
            ) : filteredItems.length === 0 ? (
              <div className="no-products">상품이 없습니다.</div>
            ) : (
              <div className="products-grid">
                {filteredItems.map((item) => (
                  <ProductCard key={item._id || item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
