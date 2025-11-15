import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import LoginModal from '../modals/LoginModal'
import RegisterModal from '../modals/RegisterModal'
import { getCartItemCount } from '../utils/cart'

function Header({ cartCount: propCartCount }) {
  const navigate = useNavigate()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(propCartCount || 0)

  // 로그인 상태 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  // 로그인 성공 시 상태 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error('Failed to parse user data:', e)
        }
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // 페이지 로드 시에도 확인
    handleStorageChange()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // 장바구니 카운트 업데이트
  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartItemCount()
      setCartCount(count)
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
  }, [])

  // propCartCount가 변경되면 업데이트
  useEffect(() => {
    if (propCartCount !== undefined) {
      setCartCount(propCartCount)
    }
  }, [propCartCount])

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleCartClick = () => {
    navigate('/cart')
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <span className="logo-icon">🛒</span>
              <span className="logo-text">MMU Mart</span>
            </div>
            {user?.address && (
              <div className="location">{user.address}</div>
            )}
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
            <div className="cart-icon" onClick={handleCartClick}>
              <span className="cart-badge">{cartCount}</span>
              🛒
            </div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#333', fontSize: '0.95rem' }}>
                  안녕하세요, {user.name}님
                </span>
                <button className="login-btn" onClick={handleLogout}>
                  <span>👤</span>
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={handleLoginClick}>
                <span>👤</span>
                <span>Login</span>
              </button>
            )}
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
