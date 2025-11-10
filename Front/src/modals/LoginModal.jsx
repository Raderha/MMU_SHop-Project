import React, { useState } from 'react'
import './Modal.css'
import { authAPI } from '../utils/api'

function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberPassword: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password)
      
      // 토큰 저장
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // 비밀번호 저장 옵션 처리
      if (formData.rememberPassword) {
        // 필요시 추가 로직
      }
      
      // 성공 시 모달 닫기
      onClose()
      
      // 로그인 성공 이벤트 발생 (Header 컴포넌트가 감지)
      window.dispatchEvent(new Event('storage'))
      
      // 페이지 새로고침
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="login-container">
          {/* Left Section - Branding */}
          <div className="login-branding">
            <div className="brand-logo">
              <div className="logo-box">MMU</div>
            </div>
            <h1 className="brand-name">MMU Mart</h1>
            <p className="brand-slogan">
              최고의 쇼핑 경험을 제공하는<br />온라인 마켓플레이스
            </p>
            <p className="brand-website">www.mmumart.com</p>
          </div>

          {/* Right Section - Login Form */}
          <div className="login-form-section">
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">계정에 로그인하여 쇼핑을 시작하세요</p>
            
            <form onSubmit={handleSubmit} className="login-form">
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
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberPassword"
                    checked={formData.rememberPassword}
                    onChange={handleChange}
                  />
                  <span>비밀번호 저장</span>
                </label>
                <button type="button" className="forgot-password-link">
                  비밀번호 찾기
                </button>
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
                className="btn-primary login-btn"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
            
            <p className="modal-switch">
              계정이 없으신가요?{' '}
              <button onClick={onSwitchToRegister} className="link-button">
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal

