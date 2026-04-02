import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/app/middleware/auth'
import clientPromise from '@/app/lib/mongodb'

export async function GET(req: NextRequest) {
  return withAuth(req, async (user) => {
    try {
      const client = await clientPromise
      const db = client.db()
      
      const dbUser = await db.collection('users').findOne(
        { _id: user.id },
        { 
          projection: { 
            password: 0  // 不返回密码
          } 
        }
      )
      
      if (!dbUser) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 })
      }
      
      return NextResponse.json({
        user: {
          id: dbUser._id,
          phone: dbUser.phone,
          nickname: dbUser.nickname,
          membershipType: dbUser.membership_type,
          membershipExpireAt: dbUser.membership_expire_at,
          todayAnalyzeCount: dbUser.today_analyze_count || 0,
          totalAnalyzeCount: dbUser.total_analyze_count || 0,
          createdAt: dbUser.created_at
        }
      })
    } catch (error) {
      console.error('Get user error:', error)
      return NextResponse.json({ error: '查询失败' }, { status: 500 })
    }
  })
}
