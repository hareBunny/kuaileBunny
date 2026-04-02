# Cloudflare Workers 后端

基于 Cloudflare Workers + D1 + KV 的无服务器后端实现。

## 优势

- ✅ 全球 CDN 加速
- ✅ 无需服务器维护
- ✅ 自动扩展
- ✅ 免费额度充足
- ✅ 内置 DDoS 防护
- ✅ 超低延迟

## 技术栈

- **运行时**: Cloudflare Workers
- **框架**: Hono (轻量级 Web 框架)
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **认证**: JWT

## 快速开始

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 D1 数据库

```bash
wrangler d1 create kuaile8
```

记录返回的 `database_id`，更新到 `wrangler.toml` 中。

### 4. 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

记录返回的 `id`，更新到 `wrangler.toml` 中。

### 5. 初始化数据库

```bash
wrangler d1 execute kuaile8 --file=./schema.sql
```

### 6. 设置密钥

```bash
# JWT 密钥
wrangler secret put JWT_SECRET
# 输入: your-super-secret-jwt-key-min-32-chars

# Cron 密钥
wrangler secret put CRON_SECRET
# 输入: your-cron-secret-key

# 彩票 API（可选）
wrangler secret put LOTTERY_API_ID
wrangler secret put LOTTERY_API_KEY
```

### 7. 本地开发

```bash
cd backend-cloudflare
npm install
npm run dev
```

访问: http://localhost:8787

### 8. 部署到生产环境

```bash
npm run deploy
```

部署后会得到一个 URL，例如：
```
https://kuaile8-backend.your-subdomain.workers.dev
```

## 项目结构

```
backend-cloudflare/
├── src/
│   ├── index.ts           # 入口文件
│   ├── cron.ts            # 定时任务
│   ├── routes/            # 路由
│   │   ├── auth.ts        # 认证路由
│   │   ├── kuaile8.ts     # 快乐8路由
│   │   └── membership.ts  # 会员路由
│   ├── middleware/        # 中间件
│   │   └── auth.ts        # 认证中间件
│   └── utils/             # 工具函数
│       └── jwt.ts         # JWT 工具
├── schema.sql             # 数据库结构
├── wrangler.toml          # Cloudflare 配置
├── package.json
└── tsconfig.json
```

## API 接口

所有接口与 Next.js 版本保持一致，只需修改 H5 前端的 API 地址即可。

### 基础 URL

```
https://kuaile8-backend.your-subdomain.workers.dev
```

### 接口列表

- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取用户信息
- `GET /api/kuaile8/latest` - 最新开奖
- `GET /api/kuaile8/history` - 历史数据
- `GET /api/kuaile8/basic-stats` - 基础统计
- `POST /api/kuaile8/analyze` - 数据分析（会员）
- `GET /api/membership/status` - 会员状态
- `POST /api/membership/create-order` - 创建订单

## 定时任务

Cloudflare Cron Triggers 会自动执行定时任务（每5分钟）。

也可以手动触发：

```bash
curl -H "Authorization: Bearer your-cron-secret" \
  https://kuaile8-backend.your-subdomain.workers.dev/api/cron
```

## 数据库管理

### 查询数据

```bash
wrangler d1 execute kuaile8 --command="SELECT * FROM users LIMIT 10"
```

### 插入测试数据

```bash
wrangler d1 execute kuaile8 --command="INSERT INTO users (phone, password, nickname, membership_type, today_analyze_count, total_analyze_count, created_at, updated_at) VALUES ('13800138000', '\$2a\$10\$test', '测试用户', 'free', 0, 0, $(date +%s)000, $(date +%s)000)"
```

### 备份数据库

```bash
wrangler d1 export kuaile8 --output=backup.sql
```

### 恢复数据库

```bash
wrangler d1 execute kuaile8 --file=backup.sql
```

## 缓存策略

使用 Cloudflare KV 缓存热点数据：

- 最新开奖：5分钟
- 基础统计：10分钟

## 性能优化

### 1. 边缘计算

Workers 在全球 300+ 数据中心运行，自动选择最近的节点。

### 2. 数据库优化

- 使用索引加速查询
- 限制返回字段
- 使用 KV 缓存

### 3. 并发处理

Workers 自动处理并发，无需担心负载。

## 监控与日志

### 查看日志

```bash
wrangler tail
```

### 查看分析

访问 Cloudflare Dashboard:
- Workers & Pages → kuaile8-backend → Metrics

## 费用说明

### 免费额度（每天）

- **Workers**: 100,000 请求
- **D1**: 5M 行读取，100K 行写入
- **KV**: 100,000 读取，1,000 写入

### 付费计划

超出免费额度后：
- Workers: $5/月 + $0.50/百万请求
- D1: $5/月 + 按量计费
- KV: $5/月 + 按量计费

对于中小型应用，免费额度完全够用。

## 自定义域名

### 1. 添加域名到 Cloudflare

在 Cloudflare Dashboard 添加你的域名。

### 2. 配置 Workers 路由

```bash
wrangler publish
```

然后在 Dashboard 中：
- Workers & Pages → kuaile8-backend → Settings → Triggers
- 添加自定义域名：`api.your-domain.com`

### 3. 更新 H5 前端

修改 `h5/vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'https://api.your-domain.com',
    changeOrigin: true
  }
}
```

## 安全配置

### 1. CORS

在 `src/index.ts` 中配置允许的域名：

```typescript
app.use('*', cors({
  origin: ['https://your-domain.com'],
  credentials: true
}))
```

### 2. 速率限制

可以使用 Cloudflare Rate Limiting 规则。

### 3. WAF

Cloudflare 自动提供 Web 应用防火墙保护。

## 故障排查

### 问题：部署失败

```bash
# 检查配置
wrangler whoami
wrangler d1 list

# 重新部署
wrangler deploy --force
```

### 问题：数据库连接失败

```bash
# 检查数据库
wrangler d1 list
wrangler d1 info kuaile8

# 重新初始化
wrangler d1 execute kuaile8 --file=./schema.sql
```

### 问题：KV 读写失败

```bash
# 检查 KV
wrangler kv:namespace list

# 测试写入
wrangler kv:key put --namespace-id=your-kv-id test "hello"
wrangler kv:key get --namespace-id=your-kv-id test
```

## 迁移指南

### 从 Next.js 迁移

1. 数据导出（MongoDB → D1）
2. 更新 H5 前端 API 地址
3. 测试所有接口
4. 切换 DNS

### 数据迁移脚本

```javascript
// 从 MongoDB 导出数据
// 转换为 SQL INSERT 语句
// 导入到 D1
```

## 最佳实践

1. 使用环境变量管理密钥
2. 启用 KV 缓存减少数据库查询
3. 使用 Cloudflare Analytics 监控性能
4. 定期备份 D1 数据库
5. 配置自定义域名和 HTTPS

## 许可证

MIT License
