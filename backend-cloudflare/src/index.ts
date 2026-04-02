import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { kuaile8Routes } from './routes/kuaile8'
import { membershipRoutes } from './routes/membership'
import { cronHandler } from './cron'

type Bindings = {
  DB: D1Database
  CACHE: KVNamespace
  JWT_SECRET: string
  CRON_SECRET: string
  LOTTERY_API_ID: string
  LOTTERY_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS
app.use('*', cors({
  origin: [
    'http://localhost:5173', 
    'https://kuaile8.pages.dev',
    'https://*.kuaile8.pages.dev'  // 支持所有预览部署
  ],
  credentials: true
}))

// 健康检查
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    message: '快乐8百宝箱 API',
    version: '1.0.0'
  })
})

// 路由
app.route('/api/auth', authRoutes)
app.route('/api/kuaile8', kuaile8Routes)
app.route('/api/membership', membershipRoutes)

// 定时任务
app.get('/api/cron', cronHandler)

// 404
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default {
  fetch: app.fetch,
  // Cloudflare Cron Trigger
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(cronHandler({ env } as any))
  }
}
