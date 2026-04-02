import { Context, Next } from 'hono'
import { verifyToken } from '../utils/jwt'

export interface AuthUser {
  id: string
  phone: string
  membershipType: string
}

export const requireAuth = async (c: Context, next: Next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({ error: '请先登录', code: 'UNAUTHORIZED' }, 401)
  }
  
  const payload = await verifyToken(token, c.env.JWT_SECRET)
  
  if (!payload) {
    return c.json({ error: '登录已过期', code: 'UNAUTHORIZED' }, 401)
  }
  
  c.set('user', payload)
  await next()
}
