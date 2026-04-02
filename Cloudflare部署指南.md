# Cloudflare 快速部署指南

## 为什么选择 Cloudflare？

- ✅ **完全免费**：免费额度足够中小型应用使用
- ✅ **全球加速**：300+ 数据中心，自动选择最近节点
- ✅ **无需服务器**：无需购买和维护服务器
- ✅ **自动扩展**：自动处理流量高峰
- ✅ **内置安全**：DDoS 防护、WAF、SSL 证书
- ✅ **超低延迟**：边缘计算，响应时间 < 50ms

## 5分钟快速部署

### 步骤 1: 注册 Cloudflare 账号

访问 https://dash.cloudflare.com/sign-up

### 步骤 2: 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 步骤 3: 登录

```bash
wrangler login
```

会自动打开浏览器完成授权。

### 步骤 4: 创建 D1 数据库

```bash
cd backend-cloudflare
wrangler d1 create kuaile8
```

输出示例：
```
✅ Successfully created DB 'kuaile8'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

复制 `database_id`，更新 `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kuaile8"
database_id = "你的database_id"  # 替换这里
```

### 步骤 5: 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

输出示例：
```
✅ Success!
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

复制 `id`，更新 `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "你的kv_id"  # 替换这里
```

### 步骤 6: 初始化数据库

```bash
wrangler d1 execute kuaile8 --file=./schema.sql
```

### 步骤 7: 设置密钥

```bash
# JWT 密钥（随机生成32位以上字符串）
wrangler secret put JWT_SECRET
# 输入: 例如 a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Cron 密钥
wrangler secret put CRON_SECRET
# 输入: 例如 cron-secret-key-2024

# 彩票 API（暂时可以随便填）
wrangler secret put LOTTERY_API_ID
# 输入: test-id

wrangler secret put LOTTERY_API_KEY
# 输入: test-key
```

### 步骤 8: 安装依赖

```bash
npm install
```

### 步骤 9: 部署

```bash
npm run deploy
```

部署成功后会显示 URL：
```
✨ Deployed to https://kuaile8-backend.your-subdomain.workers.dev
```

### 步骤 10: 测试 API

```bash
# 测试健康检查
curl https://kuaile8-backend.your-subdomain.workers.dev

# 测试注册
curl -X POST https://kuaile8-backend.your-subdomain.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456","nickname":"测试用户"}'
```

## 配置 H5 前端

修改 `h5/vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://kuaile8-backend.your-subdomain.workers.dev',
        changeOrigin: true
      }
    }
  }
})
```

或者直接修改 API 请求地址。

## 配置自定义域名（可选）

### 1. 添加域名到 Cloudflare

在 Cloudflare Dashboard 添加你的域名。

### 2. 配置 Workers 路由

在 Cloudflare Dashboard:
1. 进入 Workers & Pages
2. 选择 kuaile8-backend
3. 点击 Settings → Triggers
4. 添加自定义域名：`api.your-domain.com`

### 3. 等待 DNS 生效

通常几分钟内生效，最多24小时。

## 配置定时任务

定时任务已自动配置（每5分钟执行一次），无需额外操作。

查看定时任务日志：

```bash
wrangler tail
```

## 数据库管理

### 查看所有用户

```bash
wrangler d1 execute kuaile8 --command="SELECT * FROM users"
```

### 查看开奖记录

```bash
wrangler d1 execute kuaile8 --command="SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 10"
```

### 插入测试数据

```bash
# 插入测试用户（密码: 123456）
wrangler d1 execute kuaile8 --command="INSERT INTO users (phone, password, nickname, membership_type, today_analyze_count, total_analyze_count, created_at, updated_at) VALUES ('13800138000', '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '测试用户', 'free', 0, 0, $(date +%s)000, $(date +%s)000)"
```

## 监控与日志

### 实时日志

```bash
wrangler tail
```

### 查看分析数据

访问 Cloudflare Dashboard:
- Workers & Pages → kuaile8-backend → Metrics

可以看到：
- 请求数
- 错误率
- CPU 时间
- 响应时间

## 费用说明

### 免费额度（每天）

- Workers: 100,000 请求
- D1: 5M 行读取，100K 行写入
- KV: 100,000 读取，1,000 写入

### 估算

假设每天：
- 1000 个活跃用户
- 每人平均 20 次请求
- 总计 20,000 请求/天

**完全在免费额度内！**

## 常见问题

### Q: 如何更新代码？

A: 修改代码后重新部署：

```bash
npm run deploy
```

### Q: 如何回滚版本？

A: 在 Cloudflare Dashboard 中可以查看和回滚到之前的版本。

### Q: 如何备份数据库？

A: 导出数据：

```bash
wrangler d1 export kuaile8 --output=backup.sql
```

### Q: 如何删除 Worker？

A: 

```bash
wrangler delete
```

### Q: 本地如何开发？

A: 

```bash
npm run dev
```

访问 http://localhost:8787

### Q: 如何查看错误日志？

A: 

```bash
wrangler tail --format=pretty
```

## 性能优化建议

1. **启用缓存**：已配置 KV 缓存热点数据
2. **压缩响应**：Cloudflare 自动启用 Gzip/Brotli
3. **使用 CDN**：静态资源使用 Cloudflare Pages
4. **数据库索引**：已在 schema.sql 中配置
5. **限制查询**：使用 LIMIT 限制返回数据量

## 安全建议

1. **定期更换密钥**：定期更新 JWT_SECRET
2. **启用 WAF**：在 Cloudflare Dashboard 配置 WAF 规则
3. **速率限制**：配置 Rate Limiting 规则
4. **HTTPS Only**：强制使用 HTTPS
5. **监控异常**：设置告警规则

## 下一步

1. ✅ 后端已部署到 Cloudflare
2. ⏭️ 部署 H5 前端到 Cloudflare Pages
3. ⏭️ 配置自定义域名
4. ⏭️ 配置支付接口
5. ⏭️ 上线运营

## 部署 H5 到 Cloudflare Pages

```bash
cd h5
npm run build

# 使用 Wrangler 部署
wrangler pages deploy dist --project-name=kuaile8-h5
```

或者通过 GitHub 自动部署：
1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 连接 GitHub 仓库
3. 自动构建和部署

## 总结

使用 Cloudflare 的优势：
- 🚀 部署简单，5分钟搞定
- 💰 完全免费（中小型应用）
- 🌍 全球加速，低延迟
- 🔒 内置安全防护
- 📊 实时监控和日志
- ⚡ 自动扩展，无需运维

现在你的后端已经运行在全球 300+ 数据中心，享受企业级的性能和安全！
