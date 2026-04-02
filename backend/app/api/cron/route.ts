import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const validateCronRequest = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`
  return authHeader === expectedToken
}

export async function GET(req: NextRequest) {
  if (!validateCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const latestData = await fetchLatestLotteryData()
    
    const client = await clientPromise
    const db = client.db()
    
    const existing = await db.collection('lottery_results').findOne({
      lottery_type: 'kuaile8',
      draw_no: latestData.qihao
    })
    
    if (!existing) {
      await db.collection('lottery_results').insertOne({
        lottery_type: 'kuaile8',
        draw_no: latestData.qihao,
        draw_date: new Date(),
        numbers: parseNumbers(latestData.number),
        created_at: new Date()
      })
    }
    
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    await db.collection('lottery_results').deleteMany({
      lottery_type: 'kuaile8',
      draw_date: { $lt: twoYearsAgo }
    })
    
    return NextResponse.json({ success: true, data: latestData })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function fetchLatestLotteryData() {
  const url = `https://cn.apihz.cn/api/caipiao/kuaile8.php?id=${process.env.LOTTERY_API_ID}&key=${process.env.LOTTERY_API_KEY}`
  const response = await fetch(url)
  return response.json()
}

function parseNumbers(numberStr: string): number[] {
  return numberStr.split('|').map(n => parseInt(n))
}
