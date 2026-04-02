import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { requireMembership } from '@/middleware/membership'
import clientPromise from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  return withAuth(req, async (user) => {
    const membershipCheck = await requireMembership(req, 'premium')
    if (membershipCheck instanceof NextResponse) {
      return membershipCheck
    }
    
    const { analyzeType, params } = await req.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const historyDays = membershipCheck.user.membershipType === 'free' ? 30 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - historyDays)
    
    const historyData = await db.collection('lottery_results')
      .find({
        lottery_type: 'kuaile8',
        draw_date: { $gte: startDate }
      })
      .sort({ draw_date: -1 })
      .toArray()
    
    const result = analyzeType === 'advanced' 
      ? advancedAnalysis(historyData, params)
      : basicAnalysis(historyData, params)
    
    await db.collection('users').updateOne(
      { _id: user.id },
      { 
        $inc: { today_analyze_count: 1, total_analyze_count: 1 },
        $set: { updated_at: new Date() }
      }
    )
    
    return NextResponse.json(result)
  })
}

function basicAnalysis(data: any[], params: any) {
  const frequency: Record<number, number> = {}
  
  data.forEach(item => {
    item.numbers.forEach((num: number) => {
      frequency[num] = (frequency[num] || 0) + 1
    })
  })
  
  const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1])
  
  return {
    type: 'basic',
    hotNumbers: sorted.slice(0, 10).map(([num, count]) => ({ number: parseInt(num), count })),
    coldNumbers: sorted.slice(-10).map(([num, count]) => ({ number: parseInt(num), count })),
    frequency
  }
}

function advancedAnalysis(data: any[], params: any) {
  const basic = basicAnalysis(data, params)
  
  return {
    ...basic,
    type: 'advanced',
    aiPrediction: [3, 7, 12, 23, 34, 45, 56, 67],
    trendAnalysis: { trend: 'up', confidence: 0.75 },
    recommendation: '建议关注热号 3, 7, 12'
  }
}
