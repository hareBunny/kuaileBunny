import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const latest = await db.collection('lottery_results')
      .find({ lottery_type: 'kuaile8' })
      .sort({ draw_date: -1 })
      .limit(1)
      .toArray()
    
    if (latest.length === 0) {
      return NextResponse.json({ error: '暂无数据' }, { status: 404 })
    }
    
    return NextResponse.json({ data: latest[0] })
  } catch (error) {
    return NextResponse.json({ error: '查询失败' }, { status: 500 })
  }
}
