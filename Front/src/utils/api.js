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

export default api

