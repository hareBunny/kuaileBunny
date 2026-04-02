# 后端快速设置指南

## 1. 数据库配置

### 方案 A: 使用 MongoDB Atlas（推荐）

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 注册并创建免费集群（Free Tier）
3. 创建数据库用户
   - 点击 "Database Access"
   - 添加新用户，设置用户名和密码
4. 配置网络访问
   - 点击 "Network Access"
   - 添加 IP 地址：`0.0.0.0/0`（允许所有 IP，仅用于开发）
5. 获取连接字符串
   - 点击 "Connect" → "Connect your application"
   - 复制连接字符串，格式如：
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kuaile8
     ```
6. 更新 `.env.local` 文件中的 `MONGODB_URI`

### 方案 B: 使用本地 MongoDB

1. 下载安装 MongoDB Community Server
   - Windows: https://www.mongodb.com/try/download/community
   - 选择 MSI 安装包
   - 安装时选择 "Complete" 安装
   - 勾选 "Install MongoDB as a Service"

2. 启动 MongoDB 服务
   ```bash
   # Windows
   net start MongoDB
   
   # 或者使用 MongoDB Compass（图形界面）
   ```

3. 使用默认连接字符串
   ```
   MONGODB_URI=mongodb://localhost:27017/kuaile8
   ```

## 2. 环境变量配置

编辑 `backend/.env.local` 文件：

```bash
# 数据库配置（使用 MongoDB Atlas 或本地 MongoDB）
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kuaile8

# JWT配置（生成一个随机字符串，至少32个字符）
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-here

# 彩票数据API（暂时可以不配置，使用模拟数据）
LOTTERY_API_ID=test-api-id
LOTTERY_API_KEY=test-api-key

# 支付配置（暂时可以不配置）
PAYMENT_API_URL=https://payment-api.com
PAYMENT_MERCHANT_ID=test-merchant
PAYMENT_KEY=test-key

# 定时任务密钥（生成一个随机字符串）
CRON_SECRET=your-cron-secret-key-change-this

# 环境标识
NODE_ENV=development
```

## 3. 安装依赖

```bash
cd backend
npm install
```

## 4. 初始化数据库

```bash
npm run db:init
```

这会创建所有必要的集合和索引。

## 5. 填充测试数据

```bash
npm run db:seed
```

这会生成最近30天的测试开奖数据。

## 6. 启动开发服务器

```bash
npm run dev
```

服务器将运行在 http://localhost:3001

## 7. 测试 API

使用浏览器或 Postman 测试：

```bash
# 获取最新开奖
http://localhost:3001/api/kuaile8/latest

# 获取基础统计
http://localhost:3001/api/kuaile8/basic-stats
```

## 常见问题

### Q: 连接 MongoDB Atlas 失败？

A: 检查以下几点：
1. 网络访问是否配置为 `0.0.0.0/0`
2. 连接字符串中的用户名和密码是否正确
3. 数据库名称是否正确（默认是 `kuaile8`）

### Q: JWT_SECRET 如何生成？

A: 可以使用以下方法生成随机字符串：

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或者在线生成
https://www.random.org/strings/
```

### Q: 如何查看数据库内容？

A: 使用 MongoDB Compass：
1. 下载安装：https://www.mongodb.com/try/download/compass
2. 使用连接字符串连接数据库
3. 可视化查看和编辑数据

### Q: 本地 MongoDB 启动失败？

A: Windows 系统：
```bash
# 检查服务状态
sc query MongoDB

# 启动服务
net start MongoDB

# 停止服务
net stop MongoDB
```

## 下一步

1. 启动 H5 前端：`cd h5 && npm run dev`
2. 访问 http://localhost:5173
3. 测试完整功能流程

## 生产环境部署

参考 `后端实现文档.md` 中的部署章节。
