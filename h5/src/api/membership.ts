import request from '../utils/request'

// 获取会员状态
export const getMembershipStatus = () => {
  return request.get('/membership/status')
}

// 创建订单
export const createOrder = (data: {
  productType: string
}) => {
  return request.post('/membership/create-order', data)
}
