import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import clientPromise from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  return withAuth(req, async (user) => {
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const client = await clientPromise
    const db = client.db()
    
    const dbUser = await db.collection('users').findOne({ _id: user.id })
    const maxDays = dbUser?.membership_type === 'free' ? 30 : 365
    const actualDays = Math.min(days, maxDays)
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - actualDays)
    
    const history = await db.collection('lottery_results')
      .find({
        lottery_type: 'kuaile8',
        draw_date: { $gte: startDate }
      })
      .sort({ draw_date: -1 })
      .limit(limit)
      .toArray()
    
    return NextResponse.json({ data: history, days: actualDays })
  })
}
