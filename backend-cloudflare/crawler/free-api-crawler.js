import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 免费API配置
const API_CONFIG = {
  baseUrl: 'http://api.huiniao.top/interface/home/lotteryHistory',
  type: 'klb' // 快乐8
}

// 从免费API获取最新数据
async function fetchLatest() {
  try {
    console.log('从免费API获取最新数据...')
    
    const url = API_CONFIG.baseUrl
    const response = await axios.get(url, {
      params: {
        type: API_CONFIG.type
      },
      timeout: 10000
    })
    
    const result = response.data
    console.log('API返回:', JSON.stringify(result, null, 2))
    
    if (result.code !== 1) {
      throw new Error(result.info || 'API返回失败')
    }
    
    return parseData(result.data.last)
  } catch (error) {
    console.error('获取失败:', error.message)
    return null
  }
}

// 获取历史数据
async function fetchHistory(size = 10) {
  try {
    console.log(`从免费API获取历史数据 (${size}条)...`)
    
    const url = API_CONFIG.baseUrl
    const response = await axios.get(url, {
      params: {
        type: API_CONFIG.type,
        limit: size
      },
      timeout: 10000
    })
    
    const result = response.data
    
    if (result.code !== 1) {
      throw new Error(result.info || 'API返回失败')
    }
    
    return result.data.data.list.map(item => parseData(item))
  } catch (error) {
    console.error('获取失败:', error.message)
    return []
  }
}

// 解析数据
function parseData(data) {
  try {
    // 解析号码（根据API返回格式调整）
    const numbers = []
    
    // 遍历号码字段（one, two, three...）
    const fieldNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 
                      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
    
    for (const field of fieldNames) {
      const num = data[field]
      if (num) {
        numbers.push(parseInt(num))
      }
    }
    
    if (numbers.length === 0) {
      // 尝试另一种格式
      if (data.number) {
        numbers.push(...data.number.split('|').map(n => parseInt(n.trim())).filter(n => n >= 1 && n <= 80))
      }
    }
    
    if (numbers.length < 15) {
      throw new Error(`号码数量不正确: ${numbers.length}`)
    }
    
    // 排序
    numbers.sort((a, b) => a - b)
    
    // 计算总和
    const sum = numbers.reduce((a, b) => a + b, 0)
    
    // 解析日期
    const drawDate = new Date(data.day)
    
    return {
      draw_no: data.code,
      draw_date: drawDate.getTime(),
      numbers,
      sum,
      lottery_type: 'kuaile8',
      raw_data: data
    }
  } catch (error) {
    console.error('解析数据失败:', error.message, data)
    return null
  }
}

// 保存到数据库
async function saveToDatabase(dataList) {
  try {
    let saved = 0
    let skipped = 0
    
    for (const data of dataList) {
      if (!data) {
        skipped++
        continue
      }
      
      const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${data.lottery_type}', '${data.draw_no}', ${data.draw_date}, '${JSON.stringify(data.numbers)}', ${data.sum}, ${Date.now()})`
      
      try {
        const command = `wrangler d1 execute kuaile8 --command="${sql}"`
        const { stdout } = await execAsync(command, { cwd: '..' })
        
        if (stdout.includes('Success') || stdout.includes('success')) {
          saved++
          console.log(`✓ 保存成功: ${data.draw_no}`)
        } else {
          skipped++
          console.log(`- 已存在: ${data.draw_no}`)
        }
      } catch (error) {
        skipped++
        console.log(`- 跳过: ${data.draw_no}`)
      }
      
      // 延迟避免过快
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    return { saved, skipped }
  } catch (error) {
    console.error('保存失败:', error.message)
    return { saved: 0, skipped: 0 }
  }
}

// 主函数
async function main() {
  console.log('=== 快乐8数据爬虫 (免费API) ===\n')
  console.log(`执行时间: ${new Date().toLocaleString('zh-CN')}\n`)
  
  // 获取最新数据
  const latestData = await fetchLatest()
  
  if (latestData) {
    console.log('\n获取到最新数据:')
    console.log(`期号: ${latestData.draw_no}`)
    console.log(`号码: ${latestData.numbers.join(', ')}`)
    console.log(`总和: ${latestData.sum}`)
    console.log(`时间: ${new Date(latestData.draw_date).toLocaleString('zh-CN')}`)
    
    // 保存到数据库
    console.log('\n保存到数据库...')
    const result = await saveToDatabase([latestData])
    console.log(`成功保存 ${result.saved} 条，跳过 ${result.skipped} 条`)
  }
  
  console.log('\n=== 完成 ===')
}

// 支持命令行参数
const args = process.argv.slice(2)
if (args.includes('--history')) {
  const size = parseInt(args[args.indexOf('--history') + 1]) || 10
  
  console.log('=== 快乐8历史数据爬虫 (免费API) ===\n')
  console.log(`执行时间: ${new Date().toLocaleString('zh-CN')}\n`)
  
  fetchHistory(size).then(async (dataList) => {
    if (dataList.length > 0) {
      console.log(`\n获取到 ${dataList.length} 条历史数据`)
      
      console.log('\n保存到数据库...')
      const result = await saveToDatabase(dataList)
      console.log(`\n成功保存 ${result.saved} 条，跳过 ${result.skipped} 条`)
    }
    
    console.log('\n=== 完成 ===')
  })
} else {
  main().catch(console.error)
}