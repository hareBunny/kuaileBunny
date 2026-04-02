import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from '@/lib/jwt'

export type AuthUser = JWTPayload

export async function requireAuth(req: NextRequest): Promise<AuthUser | null> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return null
  }
  
  return verifyToken(token)
}

export async function withAuth(
  req: NextRequest,
  handler: (user: AuthUser) => Promise<NextResponse>
) {
  const user = await requireAuth(req)
  
  if (!user) {
    return NextResponse.json(
      { error: '请先登录', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }
  
  return handler(user)
}
