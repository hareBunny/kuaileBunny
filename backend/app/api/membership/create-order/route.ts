import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import clientPromise from '@/lib/mongodb'
import { MEMBERSHIP_PRICES } from '@/lib/constants'

export async function POST(req: NextRequest) {
  return withAuth(req, async (user) => {
    const { productType } = await req.json()
    
    if (!MEMBERSHIP_PRICES[productType as keyof typeof MEMBERSHIP_PRICES]) {
      return NextResponse.json({ error: '无效的产品类型' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const orderNo = `KL${Date.now()}`
    const amount = MEMBERSHIP_PRICES[productType as keyof typeof MEMBERSHIP_PRICES]
    
    await db.collection('membership_orders').insertOne({
      user_id: user.id,
      order_no: orderNo,
      product_type: productType,
      amount,
      payment_method: 'wechat',
      status: 'pending',
      created_at: new Date()
    })
    
    // TODO: 调用支付接口生成支付链接
    const paymentUrl = `${process.env.PAYMENT_API_URL}/pay?order_no=${orderNo}&amount=${amount}`
    
    return NextResponse.json({
      order_no: orderNo,
      amount,
      payment_url: paymentUrl
    })
  })
}
