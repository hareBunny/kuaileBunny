import axios from 'axios'
import * as cheerio from 'cheerio'

// 测试爬取
async function test() {
  try {
    const url = 'https://www.cwl.gov.cn/c/2026/04/01/649756.shtml'
    
    console.log('测试爬取:', url)
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('状态码:', response.status)
    console.log('内容长度:', response.data.length)
    
    const $ = cheerio.load(response.data)
    
    // 查找标题
    const title = $('title').text()
    console.log('标题:', title)
    
    // 查找所有数字
    const numbers = []
    $('.ball, .number, [class*="ball"], [class*="number"]').each((i, elem) => {
      const num = parseInt($(elem).text().trim())
      if (num >= 1 && num <= 80) {
        numbers.push(num)
      }
    })
    
    console.log('找到的号码:', numbers)
    
    // 查找期号
    const bodyText = $('body').text()
    const drawNoMatch = bodyText.match(/(\d{11})/g)
    console.log('找到的期号:', drawNoMatch)
    
    // 输出部分HTML用于调试
    console.log('\n页面结构预览:')
    console.log($('body').html().substring(0, 500))
    
  } catch (error) {
    console.error('测试失败:', error.message)
  }
}

test()
