import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 오류 처리
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// 인증 API
export const authAPI = {
  // 회원가입
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // 로그인
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // 현재 사용자 정보 가져오기
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

// 장바구니 API
export const cartAPI = {
  // 장바구니 가져오기
  getCart: async () => {
    const response = await api.get('/cart')
    return response.data
  },

  // 장바구니에 아이템 추가
  addToCart: async (itemData) => {
    const response = await api.post('/cart', itemData)
    return response.data
  },

  // 장바구니 아이템 수량 업데이트
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity })
    return response.data
  },

  // 장바구니에서 아이템 제거
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`)
    return response.data
  },

  // 장바구니 비우기
  clearCart: async () => {
    const response = await api.delete('/cart')
    return response.data
  }
}

export default api

