export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>快乐8百宝箱 API</h1>
      <p>API 服务运行中...</p>
      <ul>
        <li>POST /api/auth/login - 登录</li>
        <li>POST /api/auth/register - 注册</li>
        <li>GET /api/auth/me - 获取当前用户</li>
        <li>GET /api/membership/status - 会员状态</li>
        <li>POST /api/membership/create-order - 创建订单</li>
        <li>GET /api/kuaile8/latest - 最新开奖</li>
        <li>GET /api/kuaile8/history - 历史开奖</li>
        <li>POST /api/kuaile8/analyze - 数据分析</li>
        <li>GET /api/cron - 定时任务</li>
      </ul>
    </div>
  )
}
