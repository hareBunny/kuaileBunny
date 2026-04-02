import cron from 'node-cron'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 执行爬虫
async function runCrawler() {
  const timestamp = new Date().toLocaleString('zh-CN')
  console.log(`\n[${timestamp}] 开始爬取数据...`)
  
  try {
    const { stdout, stderr } = await execAsync('node simple-crawler.js')
    console.log(stdout)
    if (stderr) {
      console.error('错误输出:', stderr)
    }
  } catch (error) {
    console.error('执行失败:', error.message)
  }
}

// 定时任务配置
const schedules = [
  {
    name: '每小时执行',
    cron: '0 * * * *',  // 每小时的第0分钟
    enabled: true
  },
  {
    name: '每30分钟执行',
    cron: '*/30 * * * *',  // 每30分钟
    enabled: false
  },
  {
    name: '每天早上9点执行',
    cron: '0 9 * * *',  // 每天9:00
    enabled: false
  }
]

// 启动定时任务
function startScheduler() {
  console.log('=== 快乐8爬虫定时任务 ===\n')
  
  schedules.forEach(schedule => {
    if (schedule.enabled) {
      console.log(`✓ 启动任务: ${schedule.name}`)
      console.log(`  Cron: ${schedule.cron}\n`)
      
      cron.schedule(schedule.cron, runCrawler, {
        timezone: 'Asia/Shanghai'
      })
    }
  })
  
  console.log('定时任务已启动，等待执行...\n')
  
  // 立即执行一次
  console.log('立即执行一次测试...')
  runCrawler()
}

// 启动
startScheduler()

// 保持进程运行
process.on('SIGINT', () => {
  console.log('\n\n定时任务已停止')
  process.exit(0)
})
