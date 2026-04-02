import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 极速数据API配置
const API_CONFIG = {
  baseUrl: 'https://api.jisuapi.com/caipiao/query',
  appkey: 'YOUR_APP_KEY', // 需要在 https://www.jisuapi.com 注册获取
  caipiaoid: '13' // 快乐8的ID (需要确认)
}

// 从极速数据API获取数据
async function fetchData(issueno = '') {
  try {
    console.log(issueno ? `获取期号 ${issueno} 的数据...` : '获取最新数据...')
    
    const response = await axios.get(API_CONFIG.baseUrl, {
      params: {
        appkey: API_CONFIG.appkey,
        caipiaoid: API_CONFIG.caipiaoid,
        issueno: issueno
      },
      timeout: 10000
    })
    
    const result = response.data
    console.log('API返回:', JSON.stringify(result, null, 2))
    
    if (result.status !== 0) {
      throw new Error(result.msg || 'API返回失败')
    }
    
    return parseData(result.result)
  } catch (error) {
    console.error('获取失败:', error.message)
    return null
  }
}

// 解析数据
function parseData(data) {
  try {
    // 解析号码
    const numbers = data.number.split(' ').map(n => parseInt(n.trim())).filter(n => n >= 1 && n <= 80)
    
    if (numbers.length !== 20) {
      throw new Error(`号码数量不正确: ${numbers.length}`)
    }
    
    // 排序
    numbers.sort((a, b) => a - b)
    
    // 计算总和
    const sum = numbers.reduce((a, b) => a + b, 0)
    
    // 解析日期
    const drawDate = new Date(data.opendate)
    
    return {
      draw_no: data.issueno,
      draw_date: drawDate.getTime(),
      numbers,
      sum,
      lottery_type: 'kuaile8',
      raw_data: {
        opendate: data.opendate,
        deadline: data.deadline,
        saleamount: data.saleamount,
        refernumber: data.refernumber
      }
    }
  } catch (error) {
    console.error('解析数据失败:', error.message, data)
    return null
  }
}

// 保存到数据库
async function saveToDatabase(data) {
  try {
    if (!data) return false
    
    const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${data.lottery_type}', '${data.draw_no}', ${data.draw_date}, '${JSON.stringify(data.numbers)}', ${data.sum}, ${Date.now()})`
    
    const command = `wrangler d1 execute kuaile8 --command="${sql}"`
    const { stdout } = await execAsync(command, { cwd: '..' })
    
    if (stdout.includes('Success') || stdout.includes('success')) {
      console.log(`✓ 保存成功: ${data.draw_no}`)
      return true
    } else {
      console.log(`- 已存在: ${data.draw_no}`)
      return false
    }
  } catch (error) {
    console.log(`- 跳过: ${data.draw_no}`)
    return false
  }
}

// 主函数
async function main() {
  console.log('=== 快乐8数据爬虫 (极速数据API) ===\n')
  console.log(`执行时间: ${new Date().toLocaleString('zh-CN')}\n`)
  
  // 检查APP KEY
  if (API_CONFIG.appkey === 'YOUR_APP_KEY') {
    console.log('⚠️  请先配置APP KEY')
    console.log('1. 访问 https://www.jisuapi.com 注册账号')
    console.log('2. 获取 APP KEY')
    console.log('3. 修改本文件中的 API_CONFIG.appkey\n')
    
    console.log('或者使用环境变量:')
    console.log('export JISU_APP_KEY=your_app_key')
    console.log('node jisu-crawler.js\n')
    return
  }
  
  // 获取最新数据
  const data = await fetchData()
  
  if (data) {
    console.log('\n获取到数据:')
    console.log(`期号: ${data.draw_no}`)
    console.log(`号码: ${data.numbers.join(', ')}`)
    console.log(`总和: ${data.sum}`)
    console.log(`时间: ${new Date(data.draw_date).toLocaleString('zh-CN')}`)
    
    // 保存到数据库
    console.log('\n保存到数据库...')
    await saveToDatabase(data)
  }
  
  console.log('\n=== 完成 ===')
}

// 支持环境变量
if (process.env.JISU_APP_KEY) {
  API_CONFIG.appkey = process.env.JISU_APP_KEY
}

// 运行
main().catch(console.error)
