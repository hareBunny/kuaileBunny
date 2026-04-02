import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  CACHE: KVNamespace
  JWT_SECRET: string
}

export const kuaile8Routes = new Hono<{ Bindings: Bindings }>()

// 最新开奖
kuaile8Routes.get('/latest', async (c) => {
  try {
    // 尝试从缓存获取
    const cached = await c.env.CACHE.get('kuaile8:latest')
    if (cached) {
      return c.json({ data: JSON.parse(cached) })
    }
    
    const result = await c.env.DB.prepare(
      `SELECT * FROM lottery_results 
       WHERE lottery_type = 'kuaile8' 
       ORDER BY draw_date DESC 
       LIMIT 1`
    ).first()
    
    if (!result) {
      return c.json({ error: '暂无数据' }, 404)
    }
    
    // 解析 numbers
    const data = {
      ...result,
      numbers: JSON.parse(result.numbers as string)
    }
    
    // 缓存5分钟
    await c.env.CACHE.put('kuaile8:latest', JSON.stringify(data), { expirationTtl: 300 })
    
    return c.json({ data })
  } catch (error) {
    console.error('Latest error:', error)
    return c.json({ error: '查询失败' }, 500)
  }
})

// 历史数据
kuaile8Routes.get('/history', requireAuth, async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '30')
    const limit = parseInt(c.req.query('limit') || '100')
    
    const user = c.get('user')
    const maxDays = user.membershipType === 'free' ? 30 : 365
    const actualDays = Math.min(days, maxDays)
    
    const startDate = Date.now() - actualDays * 24 * 60 * 60 * 1000
    
    const results = await c.env.DB.prepare(
      `SELECT * FROM lottery_results 
       WHERE lottery_type = 'kuaile8' AND draw_date >= ?
       ORDER BY draw_date DESC 
       LIMIT ?`
    ).bind(startDate, limit).all()
    
    const data = results.results.map(r => ({
      ...r,
      numbers: JSON.parse(r.numbers as string)
    }))
    
    return c.json({ data, days: actualDays })
  } catch (error) {
    console.error('History error:', error)
    return c.json({ error: '查询失败' }, 500)
  }
})

// 基础统计
kuaile8Routes.get('/basic-stats', async (c) => {
  try {
    const days = parseInt(c.req.query('days') || '100')
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000
    
    // 尝试从缓存获取
    const cacheKey = `kuaile8:stats:${days}`
    const cached = await c.env.CACHE.get(cacheKey)
    if (cached) {
      return c.json(JSON.parse(cached))
    }
    
    const results = await c.env.DB.prepare(
      `SELECT numbers FROM lottery_results 
       WHERE lottery_type = 'kuaile8' AND draw_date >= ?
       ORDER BY draw_date DESC`
    ).bind(startDate).all()
    
    // 统计频率
    const frequency: Record<number, number> = {}
    for (let i = 1; i <= 80; i++) {
      frequency[i] = 0
    }
    
    results.results.forEach(r => {
      const numbers = JSON.parse(r.numbers as string)
      numbers.forEach((num: number) => {
        frequency[num]++
      })
    })
    
    const stats = Object.entries(frequency).map(([num, count]) => ({
      number: parseInt(num),
      count,
      percentage: Math.round((count / results.results.length) * 100)
    })).sort((a, b) => b.count - a.count)
    
    const response = {
      data: stats,
      total_draws: results.results.length,
      days
    }
    
    // 缓存10分钟
    await c.env.CACHE.put(cacheKey, JSON.stringify(response), { expirationTtl: 600 })
    
    return c.json(response)
  } catch (error) {
    console.error('Stats error:', error)
    return c.json({ error: '查询失败' }, 500)
  }
})

// 数据分析（会员功能）
kuaile8Routes.post('/analyze', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    
    if (user.membershipType === 'free') {
      return c.json({ 
        error: '此功能需要开通会员',
        code: 'NEED_MEMBERSHIP'
      }, 403)
    }
    
    const { analyzeType, params } = await c.req.json()
    
    // 这里实现分析逻辑
    // 简化版本，返回模拟数据
    
    return c.json({
      type: analyzeType,
      hotNumbers: [
        { number: 7, count: 45 },
        { number: 12, count: 43 }
      ],
      coldNumbers: [
        { number: 80, count: 12 },
        { number: 1, count: 15 }
      ],
      aiPrediction: [3, 7, 12, 23, 34, 45, 56, 67],
      trendAnalysis: { trend: 'up', confidence: 0.75 },
      recommendation: '建议关注热号 3, 7, 12'
    })
  } catch (error) {
    console.error('Analyze error:', error)
    return c.json({ error: '分析失败' }, 500)
  }
})
