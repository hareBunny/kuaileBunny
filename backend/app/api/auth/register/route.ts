import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { signToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { phone, password, nickname } = await req.json()
    
    const client = await clientPromise
    const db = client.db()
    
    const existing = await db.collection('users').findOne({ phone })
    if (existing) {
      return NextResponse.json(
        { error: '手机号已注册' },
        { status: 400 }
      )
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await db.collection('users').insertOne({
      phone,
      password: hashedPassword,
      nickname: nickname || `用户${phone.slice(-4)}`,
      membership_type: 'free',
      total_analyze_count: 0,
      today_analyze_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    })
    
    const token = signToken({
      id: result.insertedId.toString(),
      phone,
      membershipType: 'free'
    })
    
    return NextResponse.json({
      token,
      user: {
        id: result.insertedId,
        phone,
        nickname: nickname || `用户${phone.slice(-4)}`,
        membershipType: 'free'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
}
