import React, { useState } from 'react'
import './Header.css'
import LoginModal from '../modals/LoginModal'
import RegisterModal from '../modals/RegisterModal'

function Header({ cartCount = 0 }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  const handleCloseLogin = () => {
    setShowLoginModal(false)
  }

  const handleSwitchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const handleCloseRegister = () => {
    setShowRegisterModal(false)
  }

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">MMU Mart</span>
            </div>
            <div className="location">10115 New York</div>
          </div>
          
          <div className="header-center">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right">
            <div className="cart-icon">
              <span className="cart-badge">{cartCount}</span>
              🛒
            </div>
            <button className="login-btn" onClick={handleLoginClick}>
              <span>👤</span>
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLogin}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={handleCloseRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}

export default Header
