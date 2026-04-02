import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',  // 通过 Vite 代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
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

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理错误
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        // 未登录或 token 过期
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      } else if (status === 403) {
        // 需要会员权限
        if (data.code === 'NEED_MEMBERSHIP') {
          alert('此功能需要开通会员')
        }
      } else {
        alert(data.error || '请求失败')
      }
    } else {
      alert('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

export default request
