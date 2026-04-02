import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '100')
    
    const client = await clientPromise
    const db = client.db()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const results = await db.collection('lottery_results')
      .find({
        lottery_type: 'kuaile8',
        draw_date: { $gte: startDate }
      })
      .sort({ draw_date: -1 })
      .toArray()
    
    // 统计每个号码出现的频率
    const frequency: Record<number, number> = {}
    for (let i = 1; i <= 80; i++) {
      frequency[i] = 0
    }
    
    results.forEach(result => {
      result.numbers.forEach((num: number) => {
        frequency[num] = (frequency[num] || 0) + 1
      })
    })
    
    // 转换为数组并排序
    const stats = Object.entries(frequency).map(([num, count]) => ({
      number: parseInt(num),
      count,
      percentage: Math.round((count / results.length) * 100)
    })).sort((a, b) => b.count - a.count)
    
    return NextResponse.json({
      data: stats,
      total_draws: results.length,
      days
    })
  } catch (error) {
    console.error('Basic stats error:', error)
    return NextResponse.json({ error: '查询失败' }, { status: 500 })
  }
}
