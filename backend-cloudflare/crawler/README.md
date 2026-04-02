# 快乐8数据爬虫系统

完整的快乐8彩票数据采集系统，支持多种数据源和自动化定时任务。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 测试API（推荐先做这一步）

```bash
npm run test:api
```

这会测试所有可用的API，帮助你选择最合适的数据源。

### 3. 配置API KEY

根据测试结果，选择一个可用的API并配置：

**推荐：数字星空API（免费）**
```bash
export SZXK_API_KEY=your_api_key
```

访问 https://szxk365.com 注册获取API KEY

### 4. 测试爬取

```bash
npm run crawl:szxk
```

### 5. 启动定时任务

```bash
# 使用PM2（推荐）
npm run pm2:start

# 或直接运行
npm run schedule
```

---

## 📚 可用命令

### 爬虫命令

```bash
# 数字星空API（推荐）
npm run crawl:szxk              # 获取最新数据
npm run crawl:szxk:history      # 获取历史100条数据

# 极速数据API
npm run crawl:jisu              # 获取最新数据

# 接口盒子API
npm run crawl                   # 获取最新数据

# 官网爬取（不推荐）
npm run crawl:official          # 从官网爬取
```

### 测试命令

```bash
npm run test:api                # 测试所有API
npm run test                    # 运行测试脚本
```

### 定时任务命令

```bash
npm run schedule                # 启动定时任务（前台运行）
npm run pm2:start               # 使用PM2启动（后台运行）
npm run pm2:stop                # 停止PM2任务
npm run pm2:restart             # 重启PM2任务
npm run pm2:logs                # 查看PM2日志
```

---

## 🎯 API选择指南

### 推荐方案：数字星空API

**优势：**
- ✅ 完全免费
- ✅ 接口稳定
- ✅ 支持历史数据
- ✅ 数据准确

**注册地址：** https://szxk365.com

**使用方法：**
```bash
# 1. 设置API KEY
export SZXK_API_KEY=your_api_key

# 2. 获取最新数据
npm run crawl:szxk

# 3. 获取历史数据
npm run crawl:szxk:history
```

### 备选方案：极速数据API

**优势：**
- ✅ 知名平台
- ✅ 接口规范

**注册地址：** https://www.jisuapi.com

**使用方法：**
```bash
export JISU_APP_KEY=your_app_key
npm run crawl:jisu
```

### 付费方案：接口盒子API

**注册地址：** https://www.apihz.cn

**使用方法：**
```bash
export APIHZ_ID=your_id
export APIHZ_KEY=your_key
npm run crawl
```

详细对比请查看：[API选择指南.md](./API选择指南.md)

---

## ⚙️ 配置说明

### 环境变量

```bash
# 数字星空API
export SZXK_API_KEY=your_api_key

# 极速数据API
export JISU_APP_KEY=your_app_key

# 接口盒子API
export APIHZ_ID=your_id
export APIHZ_KEY=your_key

# 定时任务爬虫选择（默认：szxk-crawler.js）
export CRAWLER_SCRIPT=szxk-crawler.js
```

### 定时任务配置

编辑 `cron-config.js` 修改执行时间：

```javascript
const schedule = {
  midnight: '0 0 * * *',      // 每天晚上12点
  hourly: '0 * * * *',        // 每小时
  morning: '0 9 * * *',       // 每天早上9点
  everyMinute: '* * * * *'    // 每分钟（测试用）
}
```

---

## 📦 文件说明

| 文件 | 说明 |
|------|------|
| `szxk-crawler.js` | 数字星空API爬虫（推荐） |
| `jisu-crawler.js` | 极速数据API爬虫 |
| `simple-crawler.js` | 接口盒子API爬虫 |
| `official-crawler.js` | 官网爬虫（不推荐） |
| `cron-config.js` | 定时任务配置 |
| `test-api.js` | API测试工具 |
| `ecosystem.config.cjs` | PM2配置文件 |
| `API选择指南.md` | 详细的API对比和使用指南 |

---

## 🔧 部署到服务器

### 1. 上传代码

```bash
scp -r crawler user@server:/path/to/backend-cloudflare/
```

### 2. 安装依赖

```bash
ssh user@server
cd /path/to/backend-cloudflare/crawler
npm install
```

### 3. 配置环境变量

```bash
# 添加到 ~/.bashrc
echo 'export SZXK_API_KEY=your_api_key' >> ~/.bashrc
source ~/.bashrc
```

### 4. 测试运行

```bash
npm run test:api
npm run crawl:szxk
```

### 5. 启动PM2

```bash
npm run pm2:start
pm2 save
pm2 startup
```

### 6. 验证

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs kuaile8-crawler

# 查看爬虫日志
tail -f crawler.log
```

---

## 📊 数据流程

```
1. 定时任务触发（每天晚上12点）
   ↓
2. 调用API获取数据
   ↓
3. 解析并验证数据
   ↓
4. 保存到Cloudflare D1数据库
   ↓
5. 前端通过API获取展示
```

---

## 🐛 故障排查

### 问题1: API返回错误

**检查：**
```bash
npm run test:api
```

**解决：**
- 确认API KEY是否正确
- 检查API是否有调用限制
- 尝试其他API

### 问题2: 数据不更新

**检查：**
```bash
pm2 logs kuaile8-crawler
cat crawler.log
```

**解决：**
- 检查定时任务是否运行
- 手动执行测试
- 查看错误日志

### 问题3: 数据库保存失败

**检查：**
```bash
cd ..
wrangler d1 execute kuaile8 --command="SELECT COUNT(*) FROM lottery_results" --remote
```

**解决：**
- 确认wrangler已登录
- 检查数据库是否存在
- 查看SQL语句是否正确

---

## 📝 常见问题

### Q: 推荐使用哪个API？

A: 推荐使用数字星空API（szxk365.com），免费、稳定、功能完整。

### Q: 如何获取历史数据？

A: 使用数字星空API：
```bash
npm run crawl:szxk:history
```

### Q: 定时任务什么时候执行？

A: 默认每天晚上12点（00:00），可在 `cron-config.js` 中修改。

### Q: 如何切换API？

A: 设置环境变量：
```bash
export CRAWLER_SCRIPT=szxk-crawler.js  # 数字星空
export CRAWLER_SCRIPT=jisu-crawler.js  # 极速数据
export CRAWLER_SCRIPT=simple-crawler.js # 接口盒子
```

### Q: 数据会重复吗？

A: 不会，使用 `INSERT OR IGNORE` 自动去重。

---

## 📖 相关文档

- [API选择指南](./API选择指南.md) - 详细的API对比和使用说明
- [服务器部署指南](../服务器部署指南.md) - 完整的服务器部署流程
- [数据爬取方案](../数据爬取方案.md) - 爬虫方案说明

---

## 🎉 总结

✅ **多种数据源** - 4种方案可选
✅ **自动化运行** - PM2定时任务
✅ **易于部署** - 完整的文档
✅ **稳定可靠** - 错误处理和日志

**立即开始：**
1. `npm install`
2. `npm run test:api`
3. 配置API KEY
4. `npm run pm2:start`

搞定！🎊
