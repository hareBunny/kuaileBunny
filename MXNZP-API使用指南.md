# MXNZP API 使用指南

## 📋 API信息

**API提供商**: MXNZP (https://www.mxnzp.com)

**接口地址**: `https://www.mxnzp.com/api/lottery/common/aim_lottery`

**请求方式**: GET

**彩种代码**: `kl8` (快乐8)

**你的APP_ID**: `ceoplkrvuljhijpk`

---

## 🔑 配置APP_SECRET

你需要提供 `APP_SECRET` 才能使用API。

### 方法1: 设置环境变量（推荐）

**Windows:**
```bash
set MXNZP_APP_SECRET=your_app_secret_here
```

**Linux/Mac:**
```bash
export MXNZP_APP_SECRET=your_app_secret_here
```

### 方法2: 直接修改脚本

编辑 `backend-cloudflare/crawler/mxnzp-crawler.js`，找到这一行：

```javascript
APP_SECRET: process.env.MXNZP_APP_SECRET || '', // 需要设置
```

改为：

```javascript
APP_SECRET: process.env.MXNZP_APP_SECRET || 'your_app_secret_here',
```

---

## 🧪 测试API

### 1. 测试API连接

```bash
cd backend-cloudflare/crawler

# 设置APP_SECRET
set MXNZP_APP_SECRET=your_app_secret_here

# 运行测试
node test-mxnzp.js
```

**期望输出:**
```
=== 测试MXNZP API ===

APP_ID: ceoplkrvuljhijpk
APP_SECRET: your***

1️⃣ 测试获取最新快乐8数据...

响应状态码: 1
响应消息: 数据返回成功

✅ API调用成功！

返回数据:
  期号: 20260402001
  号码: 01,05,08,12,15,18,22,25,28,32,35,38,42,45,48,52,55,58,62,65
  时间: 2026-04-02 09:00:00
  名称: 快乐8

  号码数组: [1,5,8,12,15,18,22,25,28,32,35,38,42,45,48,52,55,58,62,65]
  号码总和: 706
  号码数量: 20

✅ 号码格式正确（20个号码）

=== 测试完成 ===
```

---

## 🚀 运行爬虫

### 手动运行一次

```bash
cd backend-cloudflare/crawler

# 设置APP_SECRET
set MXNZP_APP_SECRET=your_app_secret_here

# 运行爬虫
npm run crawl:mxnzp
```

### 定时运行

#### 方法1: 使用PM2（推荐）

编辑 `ecosystem.config.cjs`，添加MXNZP爬虫：

```javascript
module.exports = {
  apps: [
    {
      name: 'kuaile8-mxnzp',
      script: 'mxnzp-crawler.js',
      cron_restart: '0 */5 * * * *', // 每5分钟运行一次
      autorestart: false,
      env: {
        MXNZP_APP_SECRET: 'your_app_secret_here'
      }
    }
  ]
}
```

启动：
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

#### 方法2: 使用Windows任务计划程序

创建批处理文件 `run-mxnzp-crawler.bat`:

```batch
@echo off
set MXNZP_APP_SECRET=your_app_secret_here
cd backend-cloudflare\crawler
node mxnzp-crawler.js
```

然后在Windows任务计划程序中设置定时运行。

---

## 📊 API返回数据格式

```json
{
  "code": 1,
  "msg": "数据返回成功",
  "data": {
    "expect": "20260402001",
    "openCode": "01,05,08,12,15,18,22,25,28,32,35,38,42,45,48,52,55,58,62,65",
    "time": "2026-04-02 09:00:00",
    "name": "快乐8",
    "code": "kl8"
  }
}
```

---

## 🔄 数据处理流程

1. **获取数据**: 从MXNZP API获取最新开奖数据
2. **解析号码**: 将逗号分隔的字符串转换为数组
3. **计算总和**: 计算20个号码的总和
4. **保存数据库**: 保存到Cloudflare D1数据库
5. **去重处理**: 使用 `ON CONFLICT` 避免重复数据

---

## 🛠️ 故障排查

### 问题1: API返回错误

**错误信息**: `app_secret错误`

**解决方法**:
- 检查APP_SECRET是否正确
- 确认环境变量已设置
- 尝试重新申请APP_SECRET

### 问题2: 号码数量不正确

**错误信息**: `号码数量不正确: XX，应该是20个`

**解决方法**:
- 检查API返回的数据格式
- 查看 `openCode` 字段是否完整
- 联系API提供商确认数据格式

### 问题3: 数据库保存失败

**错误信息**: `保存到数据库失败`

**解决方法**:
- 确认wrangler已登录: `wrangler whoami`
- 检查数据库是否存在: `wrangler d1 list`
- 查看数据库表结构: `wrangler d1 execute kuaile8 --remote --command="SELECT * FROM lottery_results LIMIT 1"`

---

## 📝 完整使用流程

### 第一次使用

```bash
# 1. 进入爬虫目录
cd backend-cloudflare/crawler

# 2. 设置APP_SECRET
set MXNZP_APP_SECRET=your_app_secret_here

# 3. 测试API
node test-mxnzp.js

# 4. 运行爬虫
npm run crawl:mxnzp

# 5. 验证数据
wrangler d1 execute kuaile8 --remote --command="SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 5"
```

### 日常使用

```bash
# 手动运行一次
npm run crawl:mxnzp

# 或者使用PM2自动运行
pm2 start ecosystem.config.cjs
pm2 logs kuaile8-mxnzp
```

---

## 🎯 优势

相比其他API方案，MXNZP API的优势：

1. ✅ **免费使用** - 无需付费
2. ✅ **稳定可靠** - 官方维护
3. ✅ **数据准确** - 实时更新
4. ✅ **简单易用** - 接口简洁
5. ✅ **支持多彩种** - 不仅限于快乐8

---

## 📞 技术支持

如果遇到问题：

1. 查看API文档: https://www.mxnzp.com
2. 运行测试脚本: `node test-mxnzp.js`
3. 查看爬虫日志
4. 检查数据库数据

---

## 🎉 总结

MXNZP API是一个可靠的快乐8数据源，配置简单，使用方便。

**下一步**:
1. 提供你的 `APP_SECRET`
2. 运行测试脚本验证
3. 配置定时任务自动获取数据
4. 享受自动化的数据更新！
