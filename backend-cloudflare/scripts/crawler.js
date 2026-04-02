/**
 * 快乐8数据爬虫
 * 从中国福利彩票官网爬取每日开奖数据
 */

const https = require('https');
const http = require('http');

// 获取今天的日期（格式：2026/04/01）
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// 获取网页内容
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 解析HTML，提取开奖数据
function parseDrawData(html) {
  const results = [];
  
  // 匹配期号
  const issueRegex = /第(\d{11})期/g;
  const issues = [];
  let match;
  while ((match = issueRegex.exec(html)) !== null) {
    issues.push(match[1]);
  }
  
  // 匹配开奖号码（查找类似 "01 02 03 04 05 06 07 08 09 10 11 12 13 14 15" 的模式）
  const numbersRegex = /(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(\d{2})/g;
  const numbersMatches = [];
  while ((match = numbersRegex.exec(html)) !== null) {
    const numbers = [];
    for (let i = 1; i <= 15; i++) {
      numbers.push(parseInt(match[i]));
    }
    numbersMatches.push(numbers);
  }
  
  // 组合期号和号码
  for (let i = 0; i < Math.min(issues.length, numbersMatches.length); i++) {
    const numbers = numbersMatches[i];
    const sum = numbers.reduce((a, b) => a + b, 0);
    
    results.push({
      draw_no: issues[i],
      numbers: numbers,
      sum: sum,
      draw_date: Date.now(), // 使用当前时间戳
      lottery_type: 'kuaile8'
    });
  }
  
  return results;
}

// 生成SQL插入语句
function generateSQL(results) {
  const statements = [];
  
  results.forEach(result => {
    const numbersJson = JSON.stringify(result.numbers);
    const sql = `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('${result.lottery_type}', '${result.draw_no}', ${result.draw_date}, '${numbersJson}', ${result.sum}, ${result.draw_date});`;
    statements.push(sql);
  });
  
  return statements.join('\n');
}

// 主函数
async function main() {
  try {
    console.log('开始爬取快乐8数据...');
    console.log('日期:', getTodayDate());
    
    // 构建URL（使用今天的日期）
    const dateStr = getTodayDate();
    const url = `https://www.cwl.gov.cn/c/${dateStr.replace(/\//g, '/')}/649756.shtml`;
    
    console.log('URL:', url);
    console.log('正在获取网页内容...');
    
    const html = await fetchPage(url);
    
    console.log('网页内容获取成功，长度:', html.length);
    console.log('正在解析数据...');
    
    const results = parseDrawData(html);
    
    console.log(`解析完成，共找到 ${results.length} 条数据`);
    
    if (results.length === 0) {
      console.log('未找到数据，可能需要调整解析规则');
      console.log('网页内容预览:');
      console.log(html.substring(0, 500));
      return;
    }
    
    // 输出前3条数据作为示例
    console.log('\n数据示例:');
    results.slice(0, 3).forEach((result, index) => {
      console.log(`${index + 1}. 期号: ${result.draw_no}, 号码: ${result.numbers.join(' ')}, 总和: ${result.sum}`);
    });
    
    // 生成SQL
    console.log('\n生成SQL语句...');
    const sql = generateSQL(results);
    
    console.log('\n-- SQL 语句 --');
    console.log(sql);
    
    console.log('\n✅ 爬取完成！');
    console.log(`共爬取 ${results.length} 条数据`);
    
  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { fetchPage, parseDrawData, generateSQL };
