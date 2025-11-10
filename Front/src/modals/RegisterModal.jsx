import React, { useState } from 'react'
import './Modal.css'
import { authAPI } from '../utils/api'

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.register(formData)
      
      // 토큰 저장
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // 성공 시 모달 닫기
      onClose()
      
      // 회원가입 성공 이벤트 발생 (Header 컴포넌트가 감지)
      window.dispatchEvent(new Event('storage'))
      
      // 페이지 새로고침
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="register-container">
          {/* Left Section - Branding */}
          <div className="register-branding">
            <div className="brand-logo">
              <div className="logo-box">MMU</div>
            </div>
            <h1 className="brand-name">MMU Mart</h1>
            <p className="brand-slogan">
              지금 가입하고, 최고의 쇼핑을 시작하세요
            </p>
            <p className="brand-website">www.mmumart.com</p>
          </div>

          {/* Right Section - Registration Form */}
          <div className="register-form-section">
            <h2 className="register-title">회원가입</h2>
            <p className="register-subtitle">MMU Mart를 시작하려면 정보를 입력하세요</p>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="name">이름</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">이메일 주소</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mmumart.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">전화번호</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">주소</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="주소를 입력하세요(시/동 까지만)"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8자 이상, 문자/숫자 포함"
                  required
                />
                <span className="form-hint">8자 이상, 문자/숫자 포함</span>
              </div>
              
              {error && (
                <div className="error-message" style={{ 
                  color: '#ec4899', 
                  fontSize: '0.9rem', 
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn-primary register-btn"
                disabled={loading}
              >
                {loading ? '계정 생성 중...' : '계정 생성'}
              </button>
            </form>
            
            <p className="modal-switch">
              이미 계정이 있으신가요?{' '}
              <button onClick={onSwitchToLogin} className="link-button">
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal

