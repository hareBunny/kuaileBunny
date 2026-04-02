# ✅ GitHub上传成功！

代码已成功推送到：https://github.com/hareBunny/kuaileBunny

---

## 🌐 下一步：部署到Cloudflare Pages

### 方式1: 通过Dashboard（推荐，5分钟完成）

#### 步骤1: 访问Cloudflare

打开浏览器，访问：https://dash.cloudflare.com

#### 步骤2: 创建Pages项目

1. 点击左侧 **Workers & Pages**
2. 点击右上角 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

#### 步骤3: 连接GitHub

1. 选择 **GitHub**
2. 点击 **Authorize Cloudflare**（首次需要授权）
3. 在仓库列表中找到 **hareBunny/kuaileBunny**
4. 点击仓库右侧的 **Begin setup**

#### 步骤4: 配置构建设置

**基本设置**:
```
项目名称: kuaile8
生产分支: main
```

**构建设置**:
```
Framework preset: None
Build command: cd h5 && npm install && npm run build
Build output directory: h5/dist
Root directory (optional): /
```

**环境变量** (点击 Add variable):
```
变量名: NODE_VERSION
值: 18
```

#### 步骤5: 开始部署

1. 点击 **Save and Deploy**
2. 等待构建（约2-3分钟）
3. 构建成功后会显示访问地址

#### 步骤6: 获取访问地址

部署成功后，你会看到：
```
✅ Success! Your site is live at:
https://kuaile8.pages.dev
```

---

### 方式2: 使用CLI（推荐开发者）

```bash
# 1. 安装Wrangler（如果还没安装）
npm install -g wrangler

# 2. 登录Cloudflare
wrangler login

# 3. 构建H5前端
cd h5
npm install
npm run build

# 4. 部署到Pages
npx wrangler pages deploy dist --project-name=kuaile8

# 5. 获得访问地址
# https://kuaile8.pages.dev
```

---

## ⚡ 部署后端Workers

### 步骤1: 创建D1数据库

```bash
cd backend-cloudflare
wrangler d1 create kuaile8
```

会返回：
```
✅ Successfully created DB 'kuaile8'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**复制这个database_id**，然后更新 `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kuaile8"
database_id = "粘贴你的database_id"
```

### 步骤2: 创建KV命名空间

```bash
wrangler kv:namespace create CACHE
```

会返回：
```
✅ Success!
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**复制这个id**，然后更新 `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "粘贴你的kv_id"
```

### 步骤3: 初始化数据库

```bash
# 远程数据库
wrangler d1 execute kuaile8 --file=./schema.sql --remote
```

### 步骤4: 配置密钥

```bash
# JWT密钥（输入一个32位以上的随机字符串）
wrangler secret put JWT_SECRET

# Cron密钥（输入一个32位以上的随机字符串）
wrangler secret put CRON_SECRET
```

**生成随机密钥**:
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 步骤5: 部署Workers

```bash
wrangler deploy
```

成功后会显示：
```
✅ Published kuaile8-backend
https://kuaile8-backend.your-account.workers.dev
```

### 步骤6: 更新前端API地址

1. 回到Cloudflare Dashboard
2. 进入 Pages → kuaile8 项目
3. 点击 **Settings** → **Environment variables**
4. 添加或更新：
   ```
   VITE_API_BASE_URL = https://kuaile8-backend.your-account.workers.dev
   ```
5. 点击 **Save**
6. 进入 **Deployments** → 点击最新部署 → **Retry deployment**

---

## 🤖 配置数据爬虫（可选）

如果你有服务器，可以配置自动爬虫：

### 1. 注册API KEY

访问 https://szxk365.com 注册获取免费API KEY

### 2. 在服务器上配置

```bash
# 上传代码
git clone https://github.com/hareBunny/kuaileBunny.git
cd kuaileBunny/backend-cloudflare/crawler

# 安装依赖
npm install

# 配置环境变量
export SZXK_API_KEY=your_api_key

# 测试
npm run test:api
npm run crawl:szxk

# 启动定时任务
npm run pm2:start
```

### 3. 或使用演示数据

如果暂时不想配置爬虫，可以使用演示数据：

```bash
cd backend-cloudflare/crawler
npm install
npm run crawl:demo
```

---

## ✅ 验证部署

### 1. 访问前端

打开浏览器访问：`https://kuaile8.pages.dev`

应该看到：
- ✅ 首页正常显示
- ✅ 法律声明弹窗出现
- ✅ 可以浏览各个页面

### 2. 测试API

```bash
curl https://your-worker.workers.dev/api/kuaile8/latest
```

应该返回JSON数据。

### 3. 测试完整流程

1. 访问首页
2. 同意法律声明
3. 进入快乐8专区
4. 查看最新开奖
5. 查看历史数据
6. 查看基础统计

---

## 🎯 配置自定义域名（可选）

### 前端域名

1. Cloudflare Dashboard → Pages → kuaile8
2. Custom domains → Set up a custom domain
3. 输入：`kuaile8.yourdomain.com`
4. 添加CNAME记录
5. 等待SSL配置

### 后端域名

1. Cloudflare Dashboard → Workers → kuaile8-backend
2. Triggers → Custom Domains → Add Custom Domain
3. 输入：`api.yourdomain.com`
4. 配置DNS记录

---

## 📊 监控和维护

### 查看访问统计

Cloudflare Dashboard → Pages → kuaile8 → Analytics

### 查看错误日志

```bash
# Workers日志
wrangler tail

# 爬虫日志
pm2 logs kuaile8-crawler
```

### 更新代码

```bash
# 1. 修改代码
# 2. 提交推送
git add .
git commit -m "feat: 新功能"
git push

# 3. Cloudflare自动部署
```

---

## 🎉 部署完成

恭喜！你的快乐8百宝箱已经成功部署！

**访问地址**:
- 📦 GitHub: https://github.com/hareBunny/kuaileBunny
- 🌐 H5前端: https://kuaile8.pages.dev
- ⚡ 后端API: https://your-worker.workers.dev

**特性**:
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 无限带宽
- ✅ 自动部署
- ✅ 免费使用

---

## 📚 相关文档

- [快速部署指南.md](./快速部署指南.md) - 详细步骤
- [cloudflare-pages-config.md](./cloudflare-pages-config.md) - 配置说明
- [Cloudflare部署指南.md](./Cloudflare部署指南.md) - 完整指南

---

**祝使用愉快！** 🎊

如有问题，请查看文档或访问：
- Cloudflare文档: https://developers.cloudflare.com/pages/
- GitHub Issues: https://github.com/hareBunny/kuaileBunny/issues
