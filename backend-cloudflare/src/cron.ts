import { Context } from 'hono'

export async function cronHandler(c: Context) {
  try {
    // 验证 cron 密钥
    const authHeader = c.req.header('Authorization')
    const expectedToken = `Bearer ${c.env.CRON_SECRET}`
    
    if (authHeader !== expectedToken) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    
    // 获取最新开奖数据
    const apiUrl = `https://cn.apihz.cn/api/caipiao/kuaile8.php?id=${c.env.LOTTERY_API_ID}&key=${c.env.LOTTERY_API_KEY}`
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    if (!data.qihao || !data.number) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    
    // 检查是否已存在
    const existing = await c.env.DB.prepare(
      'SELECT id FROM lottery_results WHERE draw_no = ?'
    ).bind(data.qihao).first()
    
    if (!existing) {
      // 解析号码
      const numbers = data.number.split('|').map((n: string) => parseInt(n))
      const sum = numbers.reduce((a: number, b: number) => a + b, 0)
      const now = Date.now()
      
      // 插入新数据
      await c.env.DB.prepare(
        `INSERT INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at)
         VALUES ('kuaile8', ?, ?, ?, ?, ?)`
      ).bind(data.qihao, now, JSON.stringify(numbers), sum, now).run()
      
      // 清除缓存
      await c.env.CACHE.delete('kuaile8:latest')
    }
    
    // 清理2年前的数据
    const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000
    await c.env.DB.prepare(
      'DELETE FROM lottery_results WHERE lottery_type = ? AND draw_date < ?'
    ).bind('kuaile8', twoYearsAgo).run()
    
    return c.json({ success: true, data })
  } catch (error) {
    console.error('Cron error:', error)
    return c.json({ error: 'Internal error' }, 500)
  }
}
