/**
 * 彩票数据填充脚本
 * 用于填充测试数据或历史数据
 * 运行方式: npx ts-node scripts/seed-lottery-data.ts
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kuaile8'

// 生成随机开奖号码（1-80中选15个）
function generateRandomNumbers(): number[] {
  const numbers: number[] = []
  while (numbers.length < 15) {
    const num = Math.floor(Math.random() * 80) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers.sort((a, b) => a - b)
}

// 生成期号
function generateDrawNo(date: Date, index: number): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const seq = String(index).padStart(3, '0')
  return `${year}${month}${day}${seq}`
}

async function seedLotteryData() {
  console.log('开始填充彩票数据...')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✓ 连接数据库成功')
    
    const db = client.db()
    const collection = db.collection('lottery_results')
    
    // 生成最近30天的数据，每天10期
    const days = 30
    const drawsPerDay = 10
    const totalDraws = days * drawsPerDay
    
    console.log(`准备生成 ${totalDraws} 条数据...`)
    
    const documents = []
    const now = new Date()
    
    for (let d = days - 1; d >= 0; d--) {
      const date = new Date(now)
      date.setDate(date.getDate() - d)
      date.setHours(9, 0, 0, 0) // 从早上9点开始
      
      for (let i = 1; i <= drawsPerDay; i++) {
        const drawTime = new Date(date)
        drawTime.setHours(drawTime.getHours() + i)
        
        const numbers = generateRandomNumbers()
        const sum = numbers.reduce((a, b) => a + b, 0)
        
        documents.push({
          lottery_type: 'kuaile8',
          draw_no: generateDrawNo(date, i),
          draw_date: drawTime,
          numbers,
          sum,
          created_at: drawTime
        })
      }
    }
    
    // 批量插入
    const result = await collection.insertMany(documents, { ordered: false })
    console.log(`✓ 成功插入 ${result.insertedCount} 条数据`)
    
    // 统计信息
    const stats = await collection.aggregate([
      { $match: { lottery_type: 'kuaile8' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          minDate: { $min: '$draw_date' },
          maxDate: { $max: '$draw_date' }
        }
      }
    ]).toArray()
    
    if (stats.length > 0) {
      console.log('\n数据统计:')
      console.log(`总记录数: ${stats[0].total}`)
      console.log(`最早日期: ${stats[0].minDate}`)
      console.log(`最新日期: ${stats[0].maxDate}`)
    }
    
    console.log('\n✅ 数据填充完成！')
    
  } catch (error: any) {
    if (error.code === 11000) {
      console.log('⚠️  部分数据已存在，跳过重复数据')
    } else {
      console.error('❌ 填充失败:', error)
      process.exit(1)
    }
  } finally {
    await client.close()
  }
}

// 运行填充
seedLotteryData()
