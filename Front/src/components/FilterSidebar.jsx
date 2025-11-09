import React, { useState } from 'react'
import './FilterSidebar.css'

function FilterSidebar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    deals: false,
    newArrivals: false,
    nearMe: false,
    price: 'all',
    color: 'all'
  })

  const handleCategoryChange = (category) => {
    const newFilters = {
      ...filters,
      [category]: !filters[category]
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (price) => {
    const newFilters = {
      ...filters,
      price
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleColorChange = (color) => {
    const newFilters = {
      ...filters,
      color
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      deals: false,
      newArrivals: false,
      nearMe: false,
      price: 'all',
      color: 'all'
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Category</h4>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.deals}
            onChange={() => handleCategoryChange('deals')}
          />
          <span>Deals</span>
        </label>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.newArrivals}
            onChange={() => handleCategoryChange('newArrivals')}
          />
          <span>New Arrivals</span>
        </label>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.nearMe}
            onChange={() => handleCategoryChange('nearMe')}
          />
          <span>Near Me</span>
        </label>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Price Filter</h4>
        <label className="filter-radio">
          <input
            type="radio"
            name="price"
            value="all"
            checked={filters.price === 'all'}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <span>All</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="price"
            value="4-12"
            checked={filters.price === '4-12'}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <span>$4-12$</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="price"
            value="4-above"
            checked={filters.price === '4-above'}
            onChange={(e) => handlePriceChange(e.target.value)}
          />
          <span>$4 & Above</span>
        </label>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">Color Filter</h4>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="all"
            checked={filters.color === 'all'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>All</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="black"
            checked={filters.color === 'black'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>블랙</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="red"
            checked={filters.color === 'red'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>빨강</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="blue"
            checked={filters.color === 'blue'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>블루</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="green"
            checked={filters.color === 'green'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>그린</span>
        </label>
        <label className="filter-radio">
          <input
            type="radio"
            name="color"
            value="brown"
            checked={filters.color === 'brown'}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <span>브라운</span>
        </label>
      </div>
    </aside>
  )
}

export default FilterSidebar

