import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 生成模拟数据
function generateMockData() {
  // 生成今天的期号
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 84) + 1).padStart(3, '0') // 1-84期
  const drawNo = `${year}${month}${day}${seq}`
  
  // 生成20个不重复的随机号码（1-80）
  const numbers = []
  while (numbers.length < 20) {
    const num = Math.floor(Math.random() * 80) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  numbers.sort((a, b) => a - b)
  
  // 计算总和
  const sum = numbers.reduce((a, b) => a + b, 0)
  
  // 生成时间戳（每期间隔10分钟，从早上8点开始）
  const hour = 8 + Math.floor(parseInt(seq) / 6)
  const minute = (parseInt(seq) % 6) * 10
  const drawDate = new Date(year, parseInt(month) - 1, parseInt(day), hour, minute, 0)
  
  return {
    draw_no: drawNo,
    draw_date: drawDate.getTime(),
    numbers,
    sum,
    lottery_type: 'kuaile8'
  }
}

// 保存到数据库
async function saveToDatabase(data) {
  try {
    const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${data.lottery_type}', '${data.draw_no}', ${data.draw_date}, '${JSON.stringify(data.numbers)}', ${data.sum}, ${Date.now()})`
    
    const command = `wrangler d1 execute kuaile8 --command="${sql}"`
    
    console.log('保存到数据库...')
    const { stdout } = await execAsync(command, { cwd: '..' })
    
    if (stdout.includes('Success') || stdout.includes('success')) {
      console.log('✓ 保存成功')
      return true
    } else {
      console.log('- 已存在或保存失败')
      return false
    }
  } catch (error) {
    console.error('保存失败:', error.message)
    return false
  }
}

// 主函数
async function main() {
  console.log('=== 快乐8数据爬虫 (演示模式) ===\n')
  console.log('⚠️  这是演示模式，使用模拟数据')
  console.log('⚠️  实际使用请配置真实API\n')
  console.log(`执行时间: ${new Date().toLocaleString('zh-CN')}\n`)
  
  // 生成模拟数据
  console.log('生成模拟数据...')
  const data = generateMockData()
  
  console.log('\n获取到数据:')
  console.log(`期号: ${data.draw_no}`)
  console.log(`号码: ${data.numbers.join(', ')}`)
  console.log(`总和: ${data.sum}`)
  console.log(`时间: ${new Date(data.draw_date).toLocaleString('zh-CN')}`)
  
  // 保存到数据库
  console.log('')
  await saveToDatabase(data)
  
  console.log('\n=== 完成 ===')
  console.log('\n💡 提示:')
  console.log('这是演示模式，数据是随机生成的')
  console.log('要使用真实数据，请:')
  console.log('1. 访问 https://szxk365.com 注册获取API KEY')
  console.log('2. 设置环境变量: set SZXK_API_KEY=your_key')
  console.log('3. 运行: npm run crawl:szxk')
}

// 运行
main().catch(console.error)
