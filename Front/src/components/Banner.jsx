import React, { useState } from 'react'
import './Banner.css'

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const banners = [
    {
      id: 1,
      image: '/items_img/discount_banner1.jpg'
    },
    {
      id: 2,
      image: '/items_img/discount_banner2.jpg'
    },
    {
      id: 3,
      image: '/items_img/discount_banner3.jpg'
    }
  ]

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="banner-container">
      <div className="banner-wrapper">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`banner-slide ${index === currentBanner ? 'active' : ''}`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
          </div> 
        ))}
      </div>
      <button className="banner-nav prev" onClick={prevBanner}>‹</button>
      <button className="banner-nav next" onClick={nextBanner}>›</button>
    </div>
  )
}

export default Banner

