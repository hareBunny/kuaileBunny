# 快乐8百宝箱 - 后端服务

Next.js 14 + MongoDB + TypeScript

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入真实配置

# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

## API 接口

- POST /api/auth/login - 登录
- POST /api/auth/register - 注册
- GET /api/auth/me - 获取当前用户
- GET /api/membership/status - 会员状态
- POST /api/membership/create-order - 创建订单
- GET /api/kuaile8/latest - 最新开奖
- GET /api/kuaile8/history - 历史开奖
- POST /api/kuaile8/analyze - 数据分析
- GET /api/cron - 定时任务
