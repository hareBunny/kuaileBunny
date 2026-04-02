# 快乐8百宝箱 🎯

一款专业的彩票数据统计分析工具，提供实时开奖、历史数据、统计分析等功能。

## ⚠️ 重要声明

**本软件仅供娱乐参考，不保证中奖。**

- 仅提供数据统计分析，不参与投注
- 不代客下单，不收取投注资金
- 算法仅对历史数据做统计分析，随机生成号码
- 禁止向未成年人（18周岁以下）销售

详见：[法律声明与免责条款](./法律声明与免责条款.md)

---

## 📦 项目结构

```
kuaileBunny/
├── h5/                          # H5前端（React + TypeScript + Vite）
├── backend-cloudflare/          # Cloudflare Workers后端
│   ├── src/                     # 后端源码
│   └── crawler/                 # 数据爬虫
├── web/                         # 微信小程序（备用）
└── docs/                        # 文档
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/hareBunny/kuaileBunny.git
cd kuaileBunny
```

### 2. 安装依赖

```bash
# H5前端
cd h5
npm install

# Cloudflare Workers后端
cd ../backend-cloudflare
npm install

# 爬虫
cd crawler
npm install
```

### 3. 本地开发

```bash
# 启动H5前端（终端1）
cd h5
npm run dev
# 访问 http://localhost:5173

# 启动后端（终端2）
cd backend-cloudflare
npm run dev
# 访问 http://localhost:8787
```

---

## 🌐 部署指南

### Cloudflare Pages 部署（H5前端）

#### 方式1: 通过Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Pages
3. 连接 GitHub 仓库
4. 配置构建设置：
   - **构建命令**: `cd h5 && npm install && npm run build`
   - **构建输出目录**: `h5/dist`
   - **Node版本**: 18.x

#### 方式2: 使用 Wrangler CLI

```bash
cd h5
npm run build
npx wrangler pages deploy dist --project-name=kuaile8
```

### Cloudflare Workers 部署（后端）

```bash
cd backend-cloudflare

# 登录
wrangler login

# 初始化数据库
wrangler d1 execute kuaile8 --file=./schema.sql --remote

# 配置密钥
wrangler secret put JWT_SECRET
wrangler secret put CRON_SECRET
wrangler secret put LOTTERY_API_ID
wrangler secret put LOTTERY_API_KEY

# 部署
wrangler deploy
```

详细部署文档：
- [Cloudflare部署指南](./Cloudflare部署指南.md)
- [服务器部署指南](./服务器部署指南.md)

---

## 🔧 配置说明

### 环境变量

#### H5前端 (`.env`)

```env
VITE_API_BASE_URL=https://your-worker.workers.dev
```

#### Cloudflare Workers (`wrangler.toml`)

```toml
name = "kuaile8-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "kuaile8"
database_id = "your-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-id"
```

#### 爬虫 (环境变量)

```bash
# 数字星空API（推荐）
export SZXK_API_KEY=your_api_key

# 或极速数据API
export JISU_APP_KEY=your_app_key
```

---

## 📊 功能特性

### 免费功能

- ✅ 最新开奖查询
- ✅ 历史数据查询（近7天）
- ✅ 基础统计分析
- ✅ 号码频率统计

### 会员功能

- 👑 高级统计分析
- 👑 AI智能预测
- 👑 走势图表
- 👑 数据导出
- 👑 365天历史数据

---

## 🤖 数据爬虫

### 可用方案

1. **数字星空API**（推荐，免费）
   ```bash
   cd backend-cloudflare/crawler
   npm run crawl:szxk
   ```

2. **极速数据API**（免费）
   ```bash
   npm run crawl:jisu
   ```

3. **演示模式**（无需API KEY）
   ```bash
   npm run crawl:demo
   ```

### 定时任务

```bash
# 使用PM2
npm run pm2:start

# 查看状态
pm2 status

# 查看日志
pm2 logs kuaile8-crawler
```

详细文档：
- [爬虫快速入门](./爬虫快速入门.md)
- [API选择指南](./backend-cloudflare/crawler/API选择指南.md)

---

## 📖 文档

- [快速测试指南](./快速测试指南.md)
- [启动指南](./启动指南.md)
- [H5实现文档](./H5实现文档.md)
- [后端实现文档](./后端实现文档.md)
- [数据爬取方案](./数据爬取方案.md)
- [法律声明与免责条款](./法律声明与免责条款.md)

---

## 🛠️ 技术栈

### 前端

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand（状态管理）
- Axios

### 后端

- Cloudflare Workers
- Hono（Web框架）
- Cloudflare D1（数据库）
- Cloudflare KV（缓存）

### 爬虫

- Node.js
- Axios
- Cheerio
- PM2

---

## 📝 开发规范

### Git提交规范

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

### 分支管理

- `main`: 主分支，生产环境
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目仅供学习交流使用。

---

## ⚖️ 法律声明

**重要提示：**

1. 本软件仅供娱乐参考，不保证中奖
2. 不参与任何实际投注活动
3. 不代客下单，不收取投注资金
4. 禁止向未成年人销售
5. 请理性购彩，量力而行

详细声明请查看：[法律声明与免责条款](./法律声明与免责条款.md)

---

## 📞 联系方式

- Issues: [GitHub Issues](https://github.com/hareBunny/kuaileBunny/issues)
- Email: [your-email@example.com]

---

## 🙏 致谢

感谢以下开源项目：

- [React](https://reactjs.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Vite](https://vitejs.dev/)
- [Hono](https://hono.dev/)

---

**请理性购彩，享受生活！** 🎊
