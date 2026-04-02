import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { signToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const user = await db.collection('users').findOne({ phone })
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: '手机号或密码错误' },
        { status: 401 }
      )
    }
    
    const token = signToken({
      id: user._id.toString(),
      phone: user.phone,
      membershipType: user.membership_type
    })
    
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        membershipType: user.membership_type
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}
