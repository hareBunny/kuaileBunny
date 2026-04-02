// 填充测试数据脚本
// 运行: node scripts/seed-data.js

// 生成随机开奖号码
function generateRandomNumbers() {
  const numbers = []
  while (numbers.length < 15) {
    const num = Math.floor(Math.random() * 80) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers.sort((a, b) => a - b)
}

// 生成期号
function generateDrawNo(date, index) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const seq = String(index).padStart(3, '0')
  return `${year}${month}${day}${seq}`
}

// 生成SQL插入语句
function generateInsertSQL() {
  const statements = []
  const now = new Date()
  
  // 生成最近7天的数据，每天10期
  for (let d = 6; d >= 0; d--) {
    const date = new Date(now)
    date.setDate(date.getDate() - d)
    date.setHours(9, 0, 0, 0)
    
    for (let i = 1; i <= 10; i++) {
      const drawTime = new Date(date)
      drawTime.setHours(drawTime.getHours() + i)
      
      const numbers = generateRandomNumbers()
      const sum = numbers.reduce((a, b) => a + b, 0)
      const drawNo = generateDrawNo(date, i)
      const timestamp = drawTime.getTime()
      
      statements.push(
        `INSERT OR IGNORE INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('kuaile8', '${drawNo}', ${timestamp}, '${JSON.stringify(numbers)}', ${sum}, ${timestamp});`
      )
    }
  }
  
  return statements.join('\n')
}

// 输出SQL
console.log('-- 快乐8测试数据')
console.log('-- 生成时间:', new Date().toLocaleString())
console.log('')
console.log(generateInsertSQL())
console.log('')
console.log('-- 共生成 70 条数据（7天 x 10期）')
