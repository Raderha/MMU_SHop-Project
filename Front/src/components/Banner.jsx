import React, { useState } from 'react'
import './Banner.css'

function Banner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const banners = [
    {
      id: 1,
      title: 'CRAZY & WEEKLY DEALS',
      subtitle: 'Jun 7th - 13th',
      description: "Save up to 50% off Father's Day sale",
      image: '/items_img/discount_banner1.jpg'
    },
    {
      id: 2,
      title: '618 Shopping Festival sale',
      description: '30% off, 40% off',
      image: '/items_img/discount_banner2.jpg'
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
            {/* <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              {banner.subtitle && <p className="banner-subtitle">{banner.subtitle}</p>}
              <p className="banner-description">{banner.description}</p> 
            </div> */}
          </div> 
        ))}
      </div>
      <button className="banner-nav prev" onClick={prevBanner}>‹</button>
      <button className="banner-nav next" onClick={nextBanner}>›</button>
    </div>
  )
}

export default Banner

