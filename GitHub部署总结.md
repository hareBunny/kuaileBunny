# GitHub & Cloudflare 部署总结

## ✅ 已创建的部署文件

### 1. 部署脚本

| 文件 | 说明 | 适用系统 |
|------|------|----------|
| `deploy-github.bat` | GitHub部署脚本 | Windows |
| `deploy-github.sh` | GitHub部署脚本 | Mac/Linux |
| `deploy-all.bat` | 一键部署脚本 | Windows |

### 2. 配置文件

| 文件 | 说明 |
|------|------|
| `.gitignore` | Git忽略文件配置 |
| `README.md` | 项目说明文档 |
| `cloudflare-pages-config.md` | Cloudflare Pages详细配置 |
| `快速部署指南.md` | 快速部署步骤 |
| `GitHub部署总结.md` | 本文档 |

---

## 🚀 快速开始

### Windows用户

**方式1: 一键部署（推荐）**
```cmd
deploy-all.bat
```

**方式2: 分步部署**
```cmd
REM 1. 部署到GitHub
deploy-github.bat

REM 2. 按照提示配置Cloudflare Pages
REM 3. 按照提示配置Cloudflare Workers
REM 4. 配置数据爬虫
```

### Mac/Linux用户

```bash
# 1. 添加执行权限
chmod +x deploy-github.sh

# 2. 部署到GitHub
./deploy-github.sh

# 3. 按照快速部署指南.md继续
```

---

## 📋 部署步骤详解

### 第一步：GitHub部署

**目标**: 将代码推送到GitHub仓库

**命令**:
```bash
git init
git add .
git commit -m "feat: 快乐8百宝箱初始版本"
git branch -M main
git remote add origin https://github.com/hareBunny/kuaileBunny.git
git push -u origin main
```

**验证**:
- 访问 https://github.com/hareBunny/kuaileBunny
- 确认代码已推送

---

### 第二步：Cloudflare Pages部署

**目标**: 部署H5前端到Cloudflare Pages

**方式A: Dashboard（推荐新手）**

1. 访问 https://dash.cloudflare.com
2. Workers & Pages → Create application
3. Pages → Connect to Git
4. 选择 GitHub → hareBunny/kuaileBunny
5. 配置构建：
   ```
   项目名称: kuaile8
   构建命令: cd h5 && npm install && npm run build
   输出目录: h5/dist
   环境变量: NODE_VERSION=18
   ```
6. Save and Deploy

**方式B: CLI（推荐开发者）**

```bash
cd h5
npm install
npm run build
npx wrangler pages deploy dist --project-name=kuaile8
```

**验证**:
- 访问 https://kuaile8.pages.dev
- 确认页面正常显示

---

### 第三步：Cloudflare Workers部署

**目标**: 部署后端API到Cloudflare Workers

**步骤**:

```bash
cd backend-cloudflare

# 1. 登录
wrangler login

# 2. 创建D1数据库
wrangler d1 create kuaile8
# 记录database_id，更新到wrangler.toml

# 3. 创建KV命名空间
wrangler kv:namespace create CACHE
# 记录id，更新到wrangler.toml

# 4. 初始化数据库
wrangler d1 execute kuaile8 --file=./schema.sql --remote

# 5. 配置密钥
wrangler secret put JWT_SECRET
wrangler secret put CRON_SECRET

# 6. 部署
wrangler deploy
```

**验证**:
```bash
curl https://your-worker.workers.dev/api/kuaile8/latest
```

---

### 第四步：配置数据爬虫

**目标**: 配置定时任务自动爬取数据

**步骤**:

```bash
cd backend-cloudflare/crawler

# 1. 安装依赖
npm install

# 2. 配置API KEY
export SZXK_API_KEY=your_api_key

# 3. 测试爬虫
npm run test:api
npm run crawl:szxk

# 4. 启动定时任务
npm run pm2:start

# 5. 验证
pm2 status
pm2 logs kuaile8-crawler
```

---

## 🔧 配置文件说明

### .gitignore

已配置忽略：
- `node_modules/` - 依赖包
- `dist/` - 构建输出
- `.env*` - 环境变量
- `.wrangler/` - Cloudflare本地文件
- `*.log` - 日志文件

### wrangler.toml

需要配置：
```toml
name = "kuaile8-backend"
main = "src/index.ts"

[[d1_databases]]
binding = "DB"
database_name = "kuaile8"
database_id = "your-database-id"  # 需要更新

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-id"  # 需要更新
```

### package.json

H5前端构建脚本：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 📊 部署架构

```
GitHub仓库
    ↓
    ├─→ Cloudflare Pages (H5前端)
    │   └─→ https://kuaile8.pages.dev
    │
    └─→ Cloudflare Workers (后端API)
        ├─→ https://your-worker.workers.dev
        ├─→ D1数据库
        └─→ KV缓存

服务器
    └─→ 数据爬虫 (PM2定时任务)
        └─→ 每天晚上12点爬取数据
```

---

## 🔐 密钥管理

### GitHub

- Personal Access Token
- 用于推送代码
- 权限：`repo`

### Cloudflare

**Workers密钥**:
- `JWT_SECRET` - JWT签名密钥（32位随机字符串）
- `CRON_SECRET` - 定时任务密钥（32位随机字符串）
- `LOTTERY_API_ID` - 彩票API ID（可选）
- `LOTTERY_API_KEY` - 彩票API KEY（可选）

**生成随机密钥**:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🐛 常见问题

### 1. GitHub推送失败

**错误**: `Authentication failed`

**解决**:
1. 使用Personal Access Token
2. 访问 https://github.com/settings/tokens
3. 生成token（勾选repo权限）
4. 推送时使用token作为密码

### 2. Cloudflare Pages构建失败

**错误**: `Build failed`

**解决**:
1. 检查构建命令是否正确
2. 检查Node版本（需要18+）
3. 本地测试构建：`cd h5 && npm run build`
4. 查看构建日志

### 3. Workers部署失败

**错误**: `Deployment failed`

**解决**:
1. 检查wrangler.toml配置
2. 确认database_id和kv id正确
3. 检查TypeScript错误
4. 查看部署日志

### 4. 爬虫不运行

**错误**: `PM2 process not found`

**解决**:
1. 检查PM2是否安装：`pm2 -v`
2. 检查API KEY是否配置
3. 手动测试：`npm run crawl:szxk`
4. 查看日志：`pm2 logs`

---

## 📈 性能优化

### 1. Cloudflare Pages

- 自动启用HTTP/3
- 自动启用Brotli压缩
- 全球CDN加速
- 自动HTTPS

### 2. Cloudflare Workers

- 边缘计算
- 全球分布
- 低延迟
- 自动扩展

### 3. 构建优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom']
        }
      }
    }
  }
})
```

---

## 📝 部署检查清单

### 部署前

- [ ] 代码已完成开发
- [ ] 本地测试通过
- [ ] 环境变量已配置
- [ ] 文档已更新
- [ ] .gitignore已配置

### GitHub部署

- [ ] 仓库已创建
- [ ] 代码已推送
- [ ] 分支设置正确
- [ ] README显示正常

### Cloudflare Pages

- [ ] 项目已创建
- [ ] 构建配置正确
- [ ] 环境变量已设置
- [ ] 首次部署成功
- [ ] 页面可以访问

### Cloudflare Workers

- [ ] Workers已部署
- [ ] D1数据库已创建
- [ ] KV命名空间已创建
- [ ] 密钥已配置
- [ ] API可以访问

### 数据爬虫

- [ ] 依赖已安装
- [ ] API KEY已配置
- [ ] PM2已启动
- [ ] 定时任务运行
- [ ] 数据正常更新

---

## 🎉 部署完成

恭喜！你已经完成了完整的部署流程。

**访问地址**:
- GitHub: https://github.com/hareBunny/kuaileBunny
- H5前端: https://kuaile8.pages.dev
- 后端API: https://your-worker.workers.dev

**下一步**:
1. 配置自定义域名
2. 设置监控告警
3. 优化性能
4. 推广应用

---

## 📚 相关文档

- [README.md](./README.md) - 项目说明
- [快速部署指南.md](./快速部署指南.md) - 快速开始
- [cloudflare-pages-config.md](./cloudflare-pages-config.md) - 详细配置
- [Cloudflare部署指南.md](./Cloudflare部署指南.md) - 完整指南

---

**祝部署顺利！** 🚀
