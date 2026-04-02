export interface User {
  _id: string
  phone?: string
  wechat_openid?: string
  nickname: string
  avatar_url?: string
  membership_type: string
  membership_expire_at?: Date
  total_analyze_count: number
  today_analyze_count: number
  last_analyze_at?: Date
  created_at: Date
  updated_at: Date
}

export interface MembershipOrder {
  _id: string
  user_id: string
  order_no: string
  product_type: string
  amount: number
  payment_method: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  paid_at?: Date
  created_at: Date
}

export interface LotteryResult {
  _id: string
  lottery_type: string
  draw_no: string
  draw_date: Date
  numbers: number[]
  sales_amount?: number
  pool_amount?: number
  created_at: Date
}
