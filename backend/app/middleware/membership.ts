import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { requireAuth, AuthUser } from './auth'

export interface MembershipCheckResult {
  allowed: boolean
  user: AuthUser
  needMembership?: boolean
  expired?: boolean
}

export async function requireMembership(
  req: NextRequest,
  requiredLevel: 'basic' | 'premium' = 'premium'
): Promise<MembershipCheckResult | NextResponse> {
  const user = await requireAuth(req)
  if (!user) {
    return NextResponse.json(
      { error: '请先登录', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }
  
  const client = await clientPromise
  const db = client.db()
  const dbUser = await db.collection('users').findOne(
    { _id: user.id },
    { projection: { membership_type: 1, membership_expire_at: 1 } }
  )
  
  if (dbUser?.membership_type === 'free') {
    return NextResponse.json(
      { 
        error: '此功能需要开通会员',
        code: 'NEED_MEMBERSHIP',
        needMembership: true 
      },
      { status: 403 }
    )
  }
  
  if (dbUser?.membership_expire_at && new Date() > new Date(dbUser.membership_expire_at)) {
    return NextResponse.json(
      { 
        error: '会员已过期，请续费',
        code: 'MEMBERSHIP_EXPIRED',
        expired: true 
      },
      { status: 403 }
    )
  }
  
  await db.collection('membership_logs').insertOne({
    user_id: user.id,
    action: 'analyze',
    feature_name: requiredLevel === 'premium' ? 'advanced_stats' : 'basic',
    result: 'allowed',
    created_at: new Date()
  })
  
  return { allowed: true, user }
}
