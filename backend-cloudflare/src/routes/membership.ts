import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const MEMBERSHIP_PRICES = {
  monthly: 29.9,
  quarterly: 79.9,
  yearly: 299,
  lifetime: 999
}

export const membershipRoutes = new Hono<{ Bindings: Bindings }>()

// 会员状态
membershipRoutes.get('/status', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    
    const dbUser = await c.env.DB.prepare(
      'SELECT membership_type, membership_expire_at, today_analyze_count FROM users WHERE id = ?'
    ).bind(user.id).first()
    
    if (!dbUser) {
      return c.json({ error: '用户不存在' }, 404)
    }
    
    const isMember = dbUser.membership_type !== 'free'
    const expireAt = dbUser.membership_expire_at as number | null
    const daysLeft = expireAt 
      ? Math.max(0, Math.ceil((expireAt - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0
    
    return c.json({
      is_member: isMember,
      membership_type: dbUser.membership_type,
      expire_at: expireAt,
      days_left: daysLeft,
      today_used: dbUser.today_analyze_count,
      benefits: isMember ? {
        daily_analyze_limit: -1,
        history_range_days: 365,
        advanced_stats: true,
        ai_predict: true,
        export_data: true
      } : {
        daily_analyze_limit: 3,
        history_range_days: 30,
        advanced_stats: false,
        ai_predict: false,
        export_data: false
      }
    })
  } catch (error) {
    console.error('Status error:', error)
    return c.json({ error: '查询失败' }, 500)
  }
})

// 创建订单
membershipRoutes.post('/create-order', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const { productType } = await c.req.json()
    
    if (!MEMBERSHIP_PRICES[productType as keyof typeof MEMBERSHIP_PRICES]) {
      return c.json({ error: '无效的产品类型' }, 400)
    }
    
    const orderNo = `KL${Date.now()}`
    const amount = MEMBERSHIP_PRICES[productType as keyof typeof MEMBERSHIP_PRICES]
    const now = Date.now()
    
    await c.env.DB.prepare(
      `INSERT INTO membership_orders (user_id, order_no, product_type, amount, payment_method, status, created_at)
       VALUES (?, ?, ?, ?, 'wechat', 'pending', ?)`
    ).bind(user.id, orderNo, productType, amount, now).run()
    
    // TODO: 调用支付接口
    const paymentUrl = `https://payment-api.com/pay?order_no=${orderNo}&amount=${amount}`
    
    return c.json({
      order_no: orderNo,
      amount,
      payment_url: paymentUrl
    })
  } catch (error) {
    console.error('Create order error:', error)
    return c.json({ error: '创建订单失败' }, 500)
  }
})
