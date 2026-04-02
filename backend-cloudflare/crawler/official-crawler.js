import axios from 'axios'
import * as cheerio from 'cheerio'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 从官网爬取数据
async function crawlFromOfficial() {
  try {
    console.log('从中国福利彩票官网爬取数据...')
    
    // 尝试多个可能的URL
    const urls = [
      'https://www.cwl.gov.cn/ygkj/wqkjgg/kl8/',
      'https://www.cwl.gov.cn/kjxx/kl8/kjgg/',
      'https://www.cwl.gov.cn/c/kl8/'
    ]
    
    for (const url of urls) {
      console.log(`\n尝试: ${url}`)
      
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 15000,
          maxRedirects: 5
        })
        
        if (response.status === 200) {
          console.log('✓ 访问成功')
          
          const $ = cheerio.load(response.data)
          const results = []
          
          // 方法1: 查找包含开奖信息的元素
          $('.kjxx, .kjgg, [class*="result"], [class*="number"]').each((i, elem) => {
            const text = $(elem).text()
            const data = parseDrawData(text)
            if (data) {
              results.push(data)
            }
          })
          
          // 方法2: 从整个页面文本中提取
          if (results.length === 0) {
            const bodyText = $('body').text()
            const data = parseDrawData(bodyText)
            if (data) {
              results.push(data)
            }
          }
          
          // 方法3: 查找所有链接，可能包含详情页
          if (results.length === 0) {
            const links = []
            $('a').each((i, elem) => {
              const href = $(elem).attr('href')
              const text = $(elem).text()
              if (href && (text.includes('快乐8') || text.includes('开奖'))) {
                links.push(href.startsWith('http') ? href : `https://www.cwl.gov.cn${href}`)
              }
            })
            
            // 爬取详情页
            for (const link of links.slice(0, 3)) {
              console.log(`  爬取详情: ${link}`)
              const detailData = await crawlDetailPage(link)
              if (detailData) {
                results.push(detailData)
              }
            }
          }
          
          if (results.length > 0) {
            return results
          }
        }
      } catch (error) {
        console.log(`✗ 失败: ${error.message}`)
      }
    }
    
    return null
  } catch (error) {
    console.error('爬取失败:', error.message)
    return null
  }
}

// 爬取详情页
async function crawlDetailPage(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })
    
    const $ = cheerio.load(response.data)
    const bodyText = $('body').text()
    return parseDrawData(bodyText)
  } catch (error) {
    return null
  }
}

// 解析开奖数据
function parseDrawData(text) {
  try {
    // 查找期号 (11位数字)
    const drawNoMatch = text.match(/(\d{11})/g)
    if (!drawNoMatch) return null
    
    const drawNo = drawNoMatch[0]
    
    // 查找号码 (1-80之间的数字)
    const numbers = []
    const numberMatches = text.match(/\b([1-9]|[1-7][0-9]|80)\b/g)
    
    if (numberMatches) {
      const seen = new Set()
      for (const match of numberMatches) {
        const num = parseInt(match)
        if (num >= 1 && num <= 80 && !seen.has(num)) {
          numbers.push(num)
          seen.add(num)
          if (numbers.length >= 20) break
        }
      }
    }
    
    if (numbers.length < 15) return null
    
    // 取前20个并排序
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
    return null
  }
}

// 保存到数据库
async function saveToDatabase(dataList) {
  try {
    let saved = 0
    
    for (const data of dataList) {
      const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${data.lottery_type}', '${data.draw_no}', ${data.draw_date}, '${JSON.stringify(data.numbers)}', ${data.sum}, ${Date.now()})`
      
      try {
        const command = `wrangler d1 execute kuaile8 --command="${sql}"`
        await execAsync(command, { cwd: '..' })
        saved++
        console.log(`✓ 保存成功: ${data.draw_no}`)
      } catch (error) {
        console.log(`- 可能已存在: ${data.draw_no}`)
      }
      
      // 延迟避免过快
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    return saved
  } catch (error) {
    console.error('保存失败:', error.message)
    return 0
  }
}

// 主函数
async function main() {
  console.log('=== 快乐8官网爬虫 ===\n')
  console.log(`执行时间: ${new Date().toLocaleString('zh-CN')}\n`)
  
  // 爬取数据
  const dataList = await crawlFromOfficial()
  
  if (!dataList || dataList.length === 0) {
    console.log('\n✗ 未能获取数据')
    console.log('\n提示: 可能需要申请 API KEY')
    console.log('访问: https://www.apihz.cn')
    return
  }
  
  console.log(`\n获取到 ${dataList.length} 条数据:`)
  dataList.forEach(data => {
    console.log(`- ${data.draw_no}: ${data.numbers.join(', ')} (总和: ${data.sum})`)
  })
  
  // 保存到数据库
  console.log('\n保存到数据库...')
  const saved = await saveToDatabase(dataList)
  
  console.log(`\n成功保存 ${saved} 条新数据`)
  console.log('\n=== 完成 ===')
}

// 运行
main().catch(console.error)
