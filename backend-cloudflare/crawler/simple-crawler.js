import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 从接口盒子API获取数据
async function fetchFromAPI() {
  try {
    const url = 'https://cn.apihz.cn/api/caipiao/kuaile8.php'
    
    console.log('从API获取数据...')
    const response = await axios.get(url, {
      timeout: 10000
    })
    
    const data = response.data
    console.log('API返回:', data)
    
    if (!data.qihao || !data.number) {
      throw new Error('API返回数据格式错误')
    }
    
    // 解析数据
    const numbers = data.number.split('|').map(n => parseInt(n)).sort((a, b) => a - b)
    const sum = numbers.reduce((a, b) => a + b, 0)
    
    // 生成时间戳
    const year = data.qihao.substring(0, 4)
    const month = data.qihao.substring(4, 6)
    const day = data.qihao.substring(6, 8)
    const seq = parseInt(data.qihao.substring(8))
    const drawDate = new Date(`${year}-${month}-${day}T${8 + seq}:00:00+08:00`)
    
    return {
      draw_no: data.qihao,
      draw_date: drawDate.getTime(),
      numbers,
      sum,
      lottery_type: 'kuaile8'
    }
  } catch (error) {
    console.error('API获取失败:', error.message)
    return null
  }
}

// 保存到数据库（使用 wrangler 命令）
async function saveToDatabase(data) {
  try {
    const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${data.lottery_type}', '${data.draw_no}', ${data.draw_date}, '${JSON.stringify(data.numbers)}', ${data.sum}, ${Date.now()})`
    
    const command = `wrangler d1 execute kuaile8 --command="${sql}"`
    
    console.log('保存到数据库...')
    const { stdout, stderr } = await execAsync(command, {
      cwd: '..'
    })
    
    if (stderr && !stderr.includes('Success')) {
      console.error('保存失败:', stderr)
      return false
    }
    
    console.log('✓ 保存成功')
    return true
  } catch (error) {
    console.error('保存失败:', error.message)
    return false
  }
}

// 主函数
async function main() {
  console.log('=== 快乐8数据爬虫 ===\n')
  
  // 获取数据
  const data = await fetchFromAPI()
  
  if (!data) {
    console.log('\n✗ 未能获取数据')
    return
  }
  
  console.log('\n获取到数据:')
  console.log(`期号: ${data.draw_no}`)
  console.log(`号码: ${data.numbers.join(', ')}`)
  console.log(`总和: ${data.sum}`)
  console.log(`时间: ${new Date(data.draw_date).toLocaleString('zh-CN')}`)
  
  // 保存到数据库
  await saveToDatabase(data)
  
  console.log('\n=== 完成 ===')
}

// 运行
main().catch(console.error)
