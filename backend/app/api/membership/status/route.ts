import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import clientPromise from '@/lib/mongodb'
import { FREE_USER_LIMITS, MEMBER_BENEFITS } from '@/lib/constants'

export async function GET(req: NextRequest) {
  return withAuth(req, async (user) => {
    const client = await clientPromise
    const db = client.db()
    
    const dbUser = await db.collection('users').findOne({ _id: user.id })
    
    if (!dbUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    const isMember = dbUser.membership_type !== 'free'
    const expireAt = dbUser.membership_expire_at
    const daysLeft = expireAt 
      ? Math.max(0, Math.ceil((new Date(expireAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0
    
    return NextResponse.json({
      is_member: isMember,
      membership_type: dbUser.membership_type,
      expire_at: expireAt,
      days_left: daysLeft,
      today_used: dbUser.today_analyze_count || 0,
      benefits: isMember ? MEMBER_BENEFITS : FREE_USER_LIMITS
    })
  })
}
