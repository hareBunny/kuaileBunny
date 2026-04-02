import cron from 'node-cron'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'

const execAsync = promisify(exec)

// 日志文件
const LOG_FILE = 'crawler.log'

// 写入日志
function log(message) {
  const timestamp = new Date().toLocaleString('zh-CN')
  const logMessage = `[${timestamp}] ${message}\n`
  console.log(logMessage.trim())
  fs.appendFileSync(LOG_FILE, logMessage)
}

// 爬虫选择配置
const CRAWLER_SCRIPT = process.env.CRAWLER_SCRIPT || 'free-api-crawler.js'

// 执行爬虫
async function runCrawler() {
  log('========================================')
  log(`开始执行爬虫任务: ${CRAWLER_SCRIPT}`)
  
  try {
    const { stdout, stderr } = await execAsync(`node ${CRAWLER_SCRIPT}`)
    log(stdout)
    if (stderr) {
      log(`错误输出: ${stderr}`)
    }
    log('爬虫任务执行完成')
  } catch (error) {
    log(`爬虫任务执行失败: ${error.message}`)
  }
  
  log('========================================\n')
}

// 定时任务配置
const schedule = {
  // 每天晚上12点执行
  midnight: '0 0 * * *',
  
  // 测试用：每分钟执行
  everyMinute: '* * * * *',
  
  // 每小时执行
  hourly: '0 * * * *',
  
  // 每天早上9点执行
  morning: '0 9 * * *'
}

// 启动定时任务
function startCron() {
  log('========================================')
  log('快乐8爬虫定时任务启动')
  log(`使用爬虫: ${CRAWLER_SCRIPT}`)
  log('执行时间: 每天晚上 00:00')
  log('时区: Asia/Shanghai')
  log('========================================\n')
  
  // 每天晚上12点执行
  cron.schedule(schedule.midnight, runCrawler, {
    timezone: 'Asia/Shanghai'
  })
  
  log('定时任务已启动，等待执行...\n')
  
  // 立即执行一次测试
  log('立即执行一次测试...\n')
  runCrawler()
}

// 启动
startCron()

// 优雅退出
process.on('SIGINT', () => {
  log('\n定时任务已停止')
  process.exit(0)
})

process.on('SIGTERM', () => {
  log('\n定时任务已停止')
  process.exit(0)
})
