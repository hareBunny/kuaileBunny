# API 接入文档

## 已完成功能

### ✅ 后端 API
- Cloudflare Workers + D1 + KV
- 运行在：http://localhost:8787
- 所有接口已实现并测试通过

### ✅ H5 前端
- React + TypeScript + Vite
- 运行在：http://localhost:5175
- 已接入所有后端 API

### ✅ 数据库
- D1 数据库已初始化
- 测试数据已导入
- 支持本地和远程

## API 接口列表

### 1. 认证相关

#### 注册
```typescript
POST /api/auth/register
{
  "phone": "13800138000",
  "password": "123456",
  "nickname": "测试用户"
}
```

#### 登录
```typescript
POST /api/auth/login
{
  "phone": "13800138000",
  "password": "123456"
}
```

#### 获取用户信息
```typescript
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### 2. 快乐8相关

#### 最新开奖
```typescript
GET /api/kuaile8/latest
// 无需登录
```

#### 历史数据
```typescript
GET /api/kuaile8/history?days=7&limit=20
Headers: Authorization: Bearer <token>
// 免费用户：最多30天
// 会员用户：最多365天
```

#### 基础统计
```typescript
GET /api/kuaile8/basic-stats?days=100
// 无需登录
```

#### 数据分析（会员功能）
```typescript
POST /api/kuaile8/analyze
Headers: Authorization: Bearer <token>
{
  "analyzeType": "advanced",
  "params": {}
}
```

### 3. 会员相关

#### 会员状态
```typescript
GET /api/membership/status
Headers: Authorization: Bearer <token>
```

#### 创建订单
```typescript
POST /api/membership/create-order
Headers: Authorization: Bearer <token>
{
  "productType": "monthly" // monthly/quarterly/yearly/lifetime
}
```

## 前端页面

### 已实现页面

1. **首页** (`/`)
   - 专区列表
   - 个人中心入口

2. **快乐8专区** (`/kuaile8`)
   - 免费工具入口
   - 会员工具入口

3. **最新开奖** (`/latest`)
   - ✅ 已接入 API
   - 显示最新一期开奖结果

4. **历史数据** (`/history`)
   - ✅ 已接入 API
   - 显示近期开奖记录

5. **基础统计** (`/basic-stats`)
   - ✅ 已接入 API
   - 号码频率统计

6. **登录注册** (`/login`)
   - ✅ 已接入 API
   - 支持注册和登录

7. **个人中心** (`/profile`)
   - ✅ 已接入 API
   - 显示用户信息
   - 退出登录

8. **会员开通** (`/membership`)
   - ✅ 已接入 API
   - 创建订单

## 数据流程

### 用户注册/登录流程

```
1. 用户输入手机号和密码
2. 调用 /api/auth/register 或 /api/auth/login
3. 后端返回 token 和用户信息
4. 前端保存到 localStorage 和 Zustand store
5. 后续请求自动携带 token
```

### 查看开奖数据流程

```
1. 用户访问最新开奖页面
2. 调用 /api/kuaile8/latest
3. 后端从 D1 数据库查询
4. 优先从 KV 缓存获取（5分钟）
5. 前端展示数据
```

### 会员功能流程

```
1. 用户点击会员功能
2. 检查登录状态
3. 检查会员状态
4. 如果是免费用户，提示开通会员
5. 跳转到会员开通页面
6. 创建订单并支付
```

## 状态管理

### Zustand Store

```typescript
// 用户状态
const { user, token, setUser, setToken, logout } = useUserStore()

// 用户信息
user: {
  id: string
  phone: string
  nickname: string
  membershipType: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime'
}
```

## 错误处理

### 统一错误处理

```typescript
// 401: 未登录或 token 过期
// 自动跳转到登录页

// 403: 需要会员权限
// 提示开通会员

// 其他错误
// 显示错误信息
```

## 测试指南

### 1. 测试注册登录

```bash
# 访问登录页
http://localhost:5175/login

# 注册新用户
手机号: 13800138000
密码: 123456
昵称: 测试用户

# 登录
使用刚注册的账号登录
```

### 2. 测试开奖数据

```bash
# 访问最新开奖
http://localhost:5175/latest

# 访问历史数据（需要登录）
http://localhost:5175/history

# 访问基础统计
http://localhost:5175/basic-stats
```

### 3. 测试会员功能

```bash
# 访问个人中心
http://localhost:5175/profile

# 点击开通会员
http://localhost:5175/membership

# 选择套餐并创建订单
```

## 开发调试

### 查看 API 请求

打开浏览器开发者工具 → Network 标签

### 查看后端日志

```bash
# 查看 Cloudflare Workers 日志
wrangler tail
```

### 查看数据库

```bash
# 查看所有用户
wrangler d1 execute kuaile8 --command="SELECT * FROM users"

# 查看开奖记录
wrangler d1 execute kuaile8 --command="SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 10"
```

## 下一步

### 待完善功能

1. **支付集成**
   - 接入微信支付/支付宝
   - 支付回调处理
   - 订单状态更新

2. **会员功能**
   - AI 预测算法
   - 高级统计图表
   - 数据导出功能

3. **用户体验**
   - 加载动画
   - 错误提示优化
   - 骨架屏

4. **性能优化**
   - 图片懒加载
   - 虚拟滚动
   - 代码分割

5. **部署上线**
   - 配置自定义域名
   - 配置 HTTPS
   - 配置 CDN

## 常见问题

### Q: 前端无法连接后端？

A: 检查：
1. 后端是否运行：http://localhost:8787
2. 前端代理配置：vite.config.ts
3. 浏览器控制台是否有错误

### Q: 登录后刷新页面丢失状态？

A: Zustand 已配置持久化，检查：
1. localStorage 中是否有 user-storage
2. token 是否正确保存

### Q: API 返回 401？

A: 检查：
1. 是否已登录
2. token 是否过期
3. 请求头是否携带 Authorization

### Q: 数据库没有数据？

A: 运行：
```bash
cd backend-cloudflare
wrangler d1 execute kuaile8 --file=./seed-test.sql
```

## 总结

✅ 后端 API 已完成
✅ 前端页面已完成
✅ API 接入已完成
✅ 数据库已初始化
✅ 测试数据已导入

现在可以：
1. 完整测试所有功能
2. 完善 UI 和交互
3. 接入支付系统
4. 准备上线部署

项目已经可以正常运行和测试！🎉
