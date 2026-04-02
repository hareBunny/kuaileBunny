# Cloudflare Pages 部署配置

## 📋 前置条件

- ✅ 代码已推送到GitHub
- ✅ 拥有Cloudflare账号
- ✅ H5前端已构建测试通过

---

## 🚀 部署步骤

### 方式1: 通过Cloudflare Dashboard（推荐）

#### 步骤1: 创建Pages项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧菜单 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**

#### 步骤2: 连接GitHub仓库

1. 选择 **GitHub**
2. 授权Cloudflare访问GitHub
3. 选择仓库：`hareBunny/kuaileBunny`
4. 点击 **Begin setup**

#### 步骤3: 配置构建设置

**项目名称**:
```
kuaile8
```

**生产分支**:
```
main
```

**构建设置**:

| 配置项 | 值 |
|--------|-----|
| Framework preset | None |
| Build command | `cd h5 && npm install && npm run build` |
| Build output directory | `h5/dist` |
| Root directory | `/` |

**环境变量**:

| 变量名 | 值 |
|--------|-----|
| NODE_VERSION | `18` |
| VITE_API_BASE_URL | `https://your-worker.workers.dev` |

#### 步骤4: 部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约2-3分钟）
3. 构建成功后会显示访问地址

#### 步骤5: 配置自定义域名（可选）

1. 在项目设置中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如：kuaile8.yourdomain.com）
4. 按照提示配置DNS记录
5. 等待SSL证书自动配置

---

### 方式2: 使用Wrangler CLI

#### 步骤1: 安装Wrangler

```bash
npm install -g wrangler
```

#### 步骤2: 登录Cloudflare

```bash
wrangler login
```

#### 步骤3: 构建前端

```bash
cd h5
npm install
npm run build
```

#### 步骤4: 部署到Pages

```bash
npx wrangler pages deploy dist --project-name=kuaile8
```

#### 步骤5: 后续更新

```bash
# 构建
npm run build

# 部署
npx wrangler pages deploy dist --project-name=kuaile8
```

---

## 🔧 构建配置详解

### package.json 构建脚本

H5前端的 `package.json` 已配置：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 构建输出

构建后的文件在 `h5/dist/` 目录：
```
h5/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

---

## 🌐 环境变量配置

### 开发环境

创建 `h5/.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8787
```

### 生产环境

创建 `h5/.env.production`:

```env
VITE_API_BASE_URL=https://your-worker.workers.dev
```

或在Cloudflare Pages设置中配置：

1. 进入项目设置
2. 点击 **Environment variables**
3. 添加变量：
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-worker.workers.dev`
4. 选择环境：Production
5. 保存并重新部署

---

## 🔄 自动部署

### GitHub Actions（可选）

Cloudflare Pages默认会自动监听GitHub仓库的推送，无需额外配置。

**自动部署流程**:
1. 推送代码到GitHub
2. Cloudflare自动检测到更新
3. 自动执行构建
4. 自动部署到生产环境

**查看部署状态**:
- Cloudflare Dashboard → Pages → 项目 → Deployments

### 手动触发部署

在Cloudflare Dashboard中：
1. 进入项目
2. 点击 **Deployments**
3. 点击 **Retry deployment**

---

## 🐛 常见问题

### 问题1: 构建失败 - 找不到模块

**原因**: 依赖安装失败

**解决方案**:
```bash
# 本地测试构建
cd h5
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 问题2: 构建失败 - TypeScript错误

**原因**: 类型检查失败

**解决方案**:
```bash
# 检查TypeScript错误
npm run build

# 修复错误后重新推送
git add .
git commit -m "fix: 修复TypeScript错误"
git push
```

### 问题3: 部署成功但页面空白

**原因**: 路由配置问题

**解决方案**:

在Cloudflare Pages设置中添加重定向规则：
1. 进入项目设置
2. 点击 **Functions**
3. 添加 `_redirects` 文件：
   ```
   /* /index.html 200
   ```

或创建 `h5/public/_redirects`:
```
/* /index.html 200
```

### 问题4: API请求失败

**原因**: CORS或API地址错误

**解决方案**:
1. 检查环境变量 `VITE_API_BASE_URL`
2. 确认后端已部署
3. 检查后端CORS配置

---

## 📊 部署检查清单

### 部署前

- [ ] 代码已提交到GitHub
- [ ] 本地构建测试通过
- [ ] 环境变量已配置
- [ ] 后端API已部署
- [ ] 数据库已初始化

### 部署后

- [ ] 访问Pages地址确认页面正常
- [ ] 测试所有页面路由
- [ ] 测试API接口调用
- [ ] 测试会员功能
- [ ] 检查法律声明显示

### 优化

- [ ] 配置自定义域名
- [ ] 启用HTTPS
- [ ] 配置CDN缓存
- [ ] 设置错误页面
- [ ] 配置分析统计

---

## 🎯 推荐配置

### 生产环境配置

**Cloudflare Pages**:
- 项目名称: `kuaile8`
- 构建命令: `cd h5 && npm install && npm run build`
- 输出目录: `h5/dist`
- Node版本: `18`

**环境变量**:
```
NODE_VERSION=18
VITE_API_BASE_URL=https://kuaile8-backend.your-account.workers.dev
```

**自定义域名**:
```
kuaile8.yourdomain.com
```

---

## 📈 性能优化

### 1. 构建优化

在 `vite.config.ts` 中：

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['zustand', 'axios']
        }
      }
    }
  }
})
```

### 2. Cloudflare Pages优化

- 自动启用HTTP/3
- 自动启用Brotli压缩
- 全球CDN加速
- 自动HTTPS

### 3. 缓存策略

创建 `h5/public/_headers`:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/index.html
  Cache-Control: public, max-age=0, must-revalidate
```

---

## 🔐 安全配置

### 1. 环境变量

- 不要在代码中硬编码API密钥
- 使用Cloudflare Pages环境变量
- 敏感信息使用Secrets

### 2. CORS配置

后端已配置CORS，允许Pages域名访问。

### 3. CSP配置

创建 `h5/public/_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 📝 部署后验证

### 1. 功能测试

```bash
# 访问首页
curl https://your-pages-url.pages.dev

# 测试API
curl https://your-pages-url.pages.dev/api/kuaile8/latest
```

### 2. 性能测试

使用工具：
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

### 3. 监控

在Cloudflare Dashboard中：
- 查看访问统计
- 查看错误日志
- 查看性能指标

---

## 🎉 部署完成

部署成功后，你将获得：

- ✅ 全球CDN加速的H5应用
- ✅ 自动HTTPS证书
- ✅ 无限带宽（免费套餐）
- ✅ 自动部署（推送即部署）
- ✅ 版本回滚功能

**访问地址**:
- Cloudflare Pages: `https://kuaile8.pages.dev`
- 自定义域名: `https://kuaile8.yourdomain.com`

---

## 📚 相关文档

- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Vite部署指南](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions文档](https://docs.github.com/en/actions)

---

**祝部署顺利！** 🚀
