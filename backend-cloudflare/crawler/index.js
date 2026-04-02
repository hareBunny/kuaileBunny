import axios from 'axios'
import * as cheerio from 'cheerio'
import Database from 'better-sqlite3'

// 配置
const BASE_URL = 'https://www.cwl.gov.cn'
const DB_PATH = '../.wrangler/state/v3/d1/miniflare-D1DatabaseObject/kuaile8.sqlite'

// 爬取快乐8数据
async function crawlKuaile8(date) {
  try {
    // 格式化日期 YYYY/MM/DD
    const dateStr = date || new Date().toISOString().split('T')[0]
    const [year, month, day] = dateStr.split('-')
    const url = `${BASE_URL}/c/${year}/${month}/${day}/`
    
    console.log(`正在爬取: ${url}`)
    
    // 获取页面列表
    const listResponse = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const $ = cheerio.load(listResponse.data)
    const links = []
    
    // 查找快乐8相关链接
    $('a').each((i, elem) => {
      const href = $(elem).attr('href')
      const text = $(elem).text()
      if (text.includes('快乐8') || text.includes('快乐八')) {
        links.push(href)
      }
    })
    
    if (links.length === 0) {
      console.log('未找到快乐8数据链接')
      return []
    }
    
    console.log(`找到 ${links.length} 个链接`)
    
    // 爬取每个链接的数据
    const results = []
    for (const link of links) {
      const fullUrl = link.startsWith('http') ? link : `${BASE_URL}${link}`
      console.log(`爬取详情: ${fullUrl}`)
      
      const detailResponse = await axios.get(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      const detail$ = cheerio.load(detailResponse.data)
      
      // 解析开奖数据
      const data = parseKuaile8Data(detail$)
      if (data) {
        results.push(data)
      }
      
      // 延迟避免请求过快
      await sleep(1000)
    }
    
    return results
  } catch (error) {
    console.error('爬取失败:', error.message)
    return []
  }
}

// 解析快乐8数据
function parseKuaile8Data($) {
  try {
    // 查找期号
    let drawNo = ''
    $('*').each((i, elem) => {
      const text = $(elem).text()
      const match = text.match(/(\d{11})/g)
      if (match && match[0].length === 11) {
        drawNo = match[0]
        return false
      }
    })
    
    if (!drawNo) {
      console.log('未找到期号')
      return null
    }
    
    // 查找开奖号码
    const numbers = []
    $('.ball, .number, [class*="ball"], [class*="number"]').each((i, elem) => {
      const num = parseInt($(elem).text().trim())
      if (num >= 1 && num <= 80 && !numbers.includes(num)) {
        numbers.push(num)
      }
    })
    
    // 如果没找到，尝试从文本中提取
    if (numbers.length === 0) {
      const bodyText = $('body').text()
      const matches = bodyText.match(/\d{1,2}/g)
      if (matches) {
        matches.forEach(match => {
          const num = parseInt(match)
          if (num >= 1 && num <= 80 && !numbers.includes(num) && numbers.length < 20) {
            numbers.push(num)
          }
        })
      }
    }
    
    if (numbers.length < 15) {
      console.log(`号码数量不足: ${numbers.length}`)
      return null
    }
    
    // 取前20个号码并排序
    const finalNumbers = numbers.slice(0, 20).sort((a, b) => a - b)
    const sum = finalNumbers.reduce((a, b) => a + b, 0)
    
    // 生成时间戳
    const year = drawNo.substring(0, 4)
    const month = drawNo.substring(4, 6)
    const day = drawNo.substring(6, 8)
    const seq = parseInt(drawNo.substring(8))
    const drawDate = new Date(`${year}-${month}-${day}T${8 + seq}:00:00+08:00`)
    
    return {
      draw_no: drawNo,
      draw_date: drawDate.getTime(),
      numbers: finalNumbers,
      sum,
      lottery_type: 'kuaile8'
    }
  } catch (error) {
    console.error('解析数据失败:', error.message)
    return null
  }
}

// 保存到数据库
function saveToDatabase(data) {
  try {
    const db = new Database(DB_PATH)
    
    const insert = db.prepare(`
      INSERT OR IGNORE INTO lottery_results 
      (lottery_type, draw_no, draw_date, numbers, sum, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    let inserted = 0
    for (const item of data) {
      const result = insert.run(
        item.lottery_type,
        item.draw_no,
        item.draw_date,
        JSON.stringify(item.numbers),
        item.sum,
        Date.now()
      )
      if (result.changes > 0) {
        inserted++
        console.log(`✓ 保存成功: ${item.draw_no}`)
      } else {
        console.log(`- 已存在: ${item.draw_no}`)
      }
    }
    
    db.close()
    console.log(`\n共保存 ${inserted} 条新数据`)
    return inserted
  } catch (error) {
    console.error('保存失败:', error.message)
    return 0
  }
}

// 延迟函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 主函数
async function main() {
  console.log('=== 快乐8数据爬虫 ===\n')
  
  // 获取命令行参数（日期）
  const date = process.argv[2] // 格式: YYYY-MM-DD
  
  if (date) {
    console.log(`指定日期: ${date}\n`)
  } else {
    console.log(`使用今天日期: ${new Date().toISOString().split('T')[0]}\n`)
  }
  
  // 爬取数据
  const data = await crawlKuaile8(date)
  
  if (data.length === 0) {
    console.log('\n未获取到数据')
    return
  }
  
  console.log(`\n获取到 ${data.length} 条数据:`)
  data.forEach(item => {
    console.log(`- ${item.draw_no}: ${item.numbers.join(', ')} (总和: ${item.sum})`)
  })
  
  // 保存到数据库
  console.log('\n保存到数据库...')
  saveToDatabase(data)
  
  console.log('\n=== 完成 ===')
}

// 运行
main().catch(console.error)
