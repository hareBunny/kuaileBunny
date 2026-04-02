import request from '../utils/request'

// 注册
export const register = (data: {
  phone: string
  password: string
  nickname?: string
}) => {
  return request.post('/auth/register', data)
}

// 登录
export const login = (data: {
  phone: string
  password: string
}) => {
  return request.post('/auth/login', data)
}

// 获取当前用户信息
export const getCurrentUser = () => {
  return request.get('/auth/me')
}
