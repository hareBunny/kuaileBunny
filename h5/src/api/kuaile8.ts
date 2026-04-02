import request from '../utils/request'

// 获取最新开奖
export const getLatest = () => {
  return request.get('/kuaile8/latest')
}

// 获取历史数据
export const getHistory = (params?: {
  days?: number
  limit?: number
}) => {
  return request.get('/kuaile8/history', { params })
}

// 获取基础统计
export const getBasicStats = (params?: {
  days?: number
}) => {
  return request.get('/kuaile8/basic-stats', { params })
}

// 数据分析（会员功能）
export const analyze = (data: {
  analyzeType: string
  params?: any
}) => {
  return request.post('/kuaile8/analyze', data)
}
