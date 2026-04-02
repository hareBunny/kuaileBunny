# 快乐8数据爬虫 - API选择指南

## 📋 可用方案总览

我们提供了4种数据获取方案，你可以根据实际情况选择：

| 方案 | 文件 | 数据源 | 优势 | 劣势 | 推荐度 |
|------|------|--------|------|------|--------|
| 1️⃣ 数字星空API | `szxk-crawler.js` | szxk365.com | ✅ 免费<br>✅ 稳定<br>✅ 支持历史数据 | 需要注册 | ⭐⭐⭐⭐⭐ |
| 2️⃣ 极速数据API | `jisu-crawler.js` | jisuapi.com | ✅ 知名平台<br>✅ 接口规范 | 需要注册 | ⭐⭐⭐⭐ |
| 3️⃣ 接口盒子API | `simple-crawler.js` | apihz.cn | ✅ 简单易用 | 需要付费 | ⭐⭐⭐ |
| 4️⃣ 官网爬取 | `official-crawler.js` | cwl.gov.cn | ✅ 官方数据 | ❌ 有反爬<br>❌ 不稳定 | ⭐⭐ |

---

## 🎯 推荐方案：数字星空API

### 为什么推荐？

1. **完全免费** - 注册即可使用
2. **功能完整** - 支持最新数据、历史数据、指定期号查询
3. **数据准确** - 官方数据源
4. **接口稳定** - 专业API服务
5. **支持快乐8** - 明确支持 `code=kl8`

### 快速开始

#### 步骤1: 注册获取API KEY

访问 https://szxk365.com 注册账号并获取API KEY

#### 步骤2: 配置API KEY

方式A - 直接修改文件：
```bash
# 编辑 szxk-crawler.js
# 将 YOUR_API_KEY 替换为你的实际KEY
```

方式B - 使用环境变量（推荐）：
```bash
export SZXK_API_KEY=your_actual_api_key
```

#### 步骤3: 测试运行

```bash
cd backend-cloudflare/crawler

# 获取最新数据
npm run crawl:szxk

# 获取历史100条数据
npm run crawl:szxk:history
```

#### 步骤4: 配置定时任务

修改 `cron-config.js`，将爬虫命令改为：
```javascript
const { stdout, stderr } = await execAsync('node szxk-crawler.js')
```

然后启动定时任务：
```bash
npm run schedule
# 或使用PM2
npm run pm2:start
```

---

## 🔧 方案2：极速数据API

### 使用步骤

1. 访问 https://www.jisuapi.com 注册
2. 获取 APP KEY
3. 配置到 `jisu-crawler.js` 或环境变量 `JISU_APP_KEY`
4. 运行：`npm run crawl:jisu`

### 注意事项

- 需要确认快乐8的 `caipiaoid`（当前设置为13，可能需要调整）
- 免费版可能有调用次数限制

---

## 💰 方案3：接口盒子API

### 使用步骤

1. 访问 https://www.apihz.cn 注册
2. 获取 API ID 和 KEY（可能需要付费）
3. 配置到 `simple-crawler.js`
4. 运行：`npm run crawl`

### 注意事项

- 可能需要付费购买调用次数
- 适合商业项目使用

---

## 🌐 方案4：官网爬取

### 使用步骤

```bash
npm run crawl:official
```

### 注意事项

- ⚠️ 官网有反爬虫机制（403错误）
- ⚠️ 不稳定，不推荐生产环境使用
- 仅作为备用方案

---

## 📊 API接口对比

### 数字星空API

**接口地址：**
- 最新数据：`https://szxk365.com/api/openapi.lottery/kjxx`
- 历史数据：`https://szxk365.com/api/openapi.lottery/history`
- 指定期号：`https://szxk365.com/api/openapi.lottery/issue`

**请求参数：**
```javascript
{
  apikey: 'your_api_key',
  code: 'kl8',  // 快乐8
  size: 100     // 历史数据条数（仅history接口）
}
```

**返回示例：**
```json
{
  "code": 1,
  "msg": "查询成功",
  "data": {
    "type": "福彩",
    "name": "快乐8",
    "code": "kl8",
    "issue": "2026040001",
    "red": "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20",
    "blue": "",
    "drawdate": "2026-04-01(周三)",
    "time_rule": "每天 21:30",
    "sale_money": "12345678",
    "prize_pool": "0"
  }
}
```

### 极速数据API

**接口地址：**
```
https://api.jisuapi.com/caipiao/query
```

**请求参数：**
```javascript
{
  appkey: 'your_app_key',
  caipiaoid: '13',  // 快乐8的ID（需确认）
  issueno: ''       // 期号，不填则返回最新
}
```

**返回示例：**
```json
{
  "status": 0,
  "msg": "ok",
  "result": {
    "caipiaoid": "13",
    "issueno": "2026040001",
    "number": "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20",
    "opendate": "2026-04-01",
    "saleamount": "12345678"
  }
}
```

---

## 🚀 生产环境部署

### 推荐配置

使用 **数字星空API** + **PM2定时任务**

### 部署步骤

1. **配置环境变量**
```bash
# 在服务器上设置
export SZXK_API_KEY=your_actual_api_key

# 或添加到 ~/.bashrc
echo 'export SZXK_API_KEY=your_actual_api_key' >> ~/.bashrc
source ~/.bashrc
```

2. **修改定时任务配置**
```bash
# 编辑 cron-config.js
# 将爬虫命令改为：node szxk-crawler.js
```

3. **启动PM2**
```bash
cd backend-cloudflare/crawler
npm run pm2:start
pm2 save
pm2 startup
```

4. **验证运行**
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs kuaile8-crawler

# 查看爬虫日志
tail -f crawler.log
```

---

## 🔍 测试验证

### 测试数字星空API

```bash
# 设置环境变量
export SZXK_API_KEY=your_api_key

# 测试获取最新数据
node szxk-crawler.js

# 测试获取历史数据
node szxk-crawler.js --history 10
```

### 测试极速数据API

```bash
# 设置环境变量
export JISU_APP_KEY=your_app_key

# 测试
node jisu-crawler.js
```

### 验证数据库

```bash
cd ..
wrangler d1 execute kuaile8 --command="SELECT * FROM lottery_results ORDER BY draw_date DESC LIMIT 5" --remote
```

---

## 📝 常见问题

### Q1: 如何选择API？

**推荐顺序：**
1. 数字星空API（免费、稳定）
2. 极速数据API（知名平台）
3. 接口盒子API（付费）
4. 官网爬取（不推荐）

### Q2: API KEY在哪里配置？

**三种方式：**
1. 直接修改爬虫文件中的配置
2. 使用环境变量（推荐）
3. 创建 `.env` 文件

### Q3: 如何切换API？

修改 `cron-config.js` 中的爬虫命令：
```javascript
// 使用数字星空
await execAsync('node szxk-crawler.js')

// 使用极速数据
await execAsync('node jisu-crawler.js')

// 使用接口盒子
await execAsync('node simple-crawler.js')
```

### Q4: 数据不更新怎么办？

**检查步骤：**
1. 查看PM2日志：`pm2 logs kuaile8-crawler`
2. 查看爬虫日志：`cat crawler.log`
3. 手动测试：`node szxk-crawler.js`
4. 检查API KEY是否正确
5. 检查网络连接

### Q5: 如何补充历史数据？

```bash
# 使用数字星空API获取历史100条
node szxk-crawler.js --history 100

# 或修改数量
node szxk-crawler.js --history 500
```

---

## 🎉 总结

✅ **推荐使用数字星空API**
- 免费、稳定、功能完整
- 支持最新数据和历史数据
- 接口规范、易于使用

✅ **配置简单**
- 注册获取API KEY
- 设置环境变量
- 运行测试

✅ **自动化运行**
- PM2管理进程
- 定时任务自动执行
- 日志记录完整

**立即开始：访问 https://szxk365.com 注册获取API KEY！**
