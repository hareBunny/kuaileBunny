import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken } from '../utils/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

export const authRoutes = new Hono<{ Bindings: Bindings }>()

// 注册
authRoutes.post('/register', async (c) => {
  try {
    const { phone, password, nickname } = await c.req.json()
    
    // 检查用户是否存在
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE phone = ?'
    ).bind(phone).first()
    
    if (existing) {
      return c.json({ error: '手机号已注册' }, 400)
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)
    const now = Date.now()
    
    // 插入用户
    const result = await c.env.DB.prepare(
      `INSERT INTO users (phone, password, nickname, membership_type, today_analyze_count, total_analyze_count, created_at, updated_at)
       VALUES (?, ?, ?, 'free', 0, 0, ?, ?)`
    ).bind(phone, hashedPassword, nickname || `用户${phone.slice(-4)}`, now, now).run()
    
    // 生成 token
    const token = await signToken({
      id: result.meta.last_row_id.toString(),
      phone,
      membershipType: 'free'
    }, c.env.JWT_SECRET)
    
    return c.json({
      token,
      user: {
        id: result.meta.last_row_id,
        phone,
        nickname: nickname || `用户${phone.slice(-4)}`,
        membershipType: 'free'
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return c.json({ error: '注册失败' }, 500)
  }
})

// 登录
authRoutes.post('/login', async (c) => {
  try {
    const { phone, password } = await c.req.json()
    
    // 查询用户
    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE phone = ?'
    ).bind(phone).first()
    
    if (!user) {
      return c.json({ error: '手机号或密码错误' }, 401)
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, user.password as string)
    if (!isValid) {
      return c.json({ error: '手机号或密码错误' }, 401)
    }
    
    // 生成 token
    const token = await signToken({
      id: user.id.toString(),
      phone: user.phone as string,
      membershipType: user.membership_type as string
    }, c.env.JWT_SECRET)
    
    return c.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        membershipType: user.membership_type
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: '登录失败' }, 500)
  }
})

// 获取当前用户
authRoutes.get('/me', async (c) => {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return c.json({ error: '请先登录' }, 401)
    }
    
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    if (!payload) {
      return c.json({ error: '登录已过期' }, 401)
    }
    
    const user = await c.env.DB.prepare(
      'SELECT id, phone, nickname, membership_type, membership_expire_at, today_analyze_count, total_analyze_count, created_at FROM users WHERE id = ?'
    ).bind(payload.id).first()
    
    if (!user) {
      return c.json({ error: '用户不存在' }, 404)
    }
    
    return c.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ error: '查询失败' }, 500)
  }
})
