import React, { useState } from 'react'
import './Modal.css'

function FindPW({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    email: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // 비밀번호 재설정 로직 구현
    console.log('Find Password:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content findpw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="findpw-container">
          {/* Left Section - Branding */}
          <div className="findpw-branding">
            <div className="brand-logo">
              <div className="logo-box">MMU</div>
            </div>
            <h1 className="brand-name">MMU Mart</h1>
            <p className="brand-slogan">
              걱정 마세요!<br />
              간단한 절차를 통해 비밀번호를 재설정해 드립니다.
            </p>
            <p className="brand-website">www.mmumart.com</p>
          </div>

          {/* Right Section - Find Password Form */}
          <div className="findpw-form-section">
            <h2 className="findpw-title">비밀번호 찾기</h2>
            <p className="findpw-subtitle">계정에 등록된 이메일 주소를 입력해 주세요.</p>
            
            <form onSubmit={handleSubmit} className="findpw-form">
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
              
              <button type="submit" className="btn-primary findpw-btn">재설정 링크 받기</button>
            </form>
            
            <p className="modal-switch">
              <button onClick={onSwitchToLogin} className="link-button">
                로그인 페이지로 돌아가기
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindPW

