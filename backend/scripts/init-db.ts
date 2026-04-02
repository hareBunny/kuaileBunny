/**
 * 数据库初始化脚本
 * 运行方式: npx ts-node scripts/init-db.ts
 */

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kuaile8'

async function initDatabase() {
  console.log('开始初始化数据库...')
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('✓ 连接数据库成功')
    
    const db = client.db()
    
    // 创建集合
    const collections = [
      'users',
      'lottery_results',
      'membership_orders',
      'membership_logs'
    ]
    
    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext()
      if (!exists) {
        await db.createCollection(collectionName)
        console.log(`✓ 创建集合: ${collectionName}`)
      } else {
        console.log(`- 集合已存在: ${collectionName}`)
      }
    }
    
    // 创建索引
    console.log('\n创建索引...')
    
    // users 索引
    await db.collection('users').createIndex({ phone: 1 }, { unique: true })
    await db.collection('users').createIndex({ membership_type: 1 })
    await db.collection('users').createIndex({ membership_expire_at: 1 })
    console.log('✓ users 索引创建完成')
    
    // lottery_results 索引
    await db.collection('lottery_results').createIndex(
      { lottery_type: 1, draw_no: 1 },
      { unique: true }
    )
    await db.collection('lottery_results').createIndex({ draw_date: -1 })
    await db.collection('lottery_results').createIndex({ lottery_type: 1, draw_date: -1 })
    console.log('✓ lottery_results 索引创建完成')
    
    // membership_orders 索引
    await db.collection('membership_orders').createIndex({ order_no: 1 }, { unique: true })
    await db.collection('membership_orders').createIndex({ user_id: 1 })
    await db.collection('membership_orders').createIndex({ status: 1 })
    await db.collection('membership_orders').createIndex({ created_at: -1 })
    console.log('✓ membership_orders 索引创建完成')
    
    // membership_logs 索引
    await db.collection('membership_logs').createIndex({ user_id: 1 })
    await db.collection('membership_logs').createIndex({ created_at: -1 })
    console.log('✓ membership_logs 索引创建完成')
    
    // 插入测试数据（可选）
    console.log('\n插入测试数据...')
    
    const testUser = await db.collection('users').findOne({ phone: '13800138000' })
    if (!testUser) {
      await db.collection('users').insertOne({
        phone: '13800138000',
        password: '$2a$10$YourHashedPasswordHere', // 需要使用 bcrypt 加密
        nickname: '测试用户',
        membership_type: 'free',
        total_analyze_count: 0,
        today_analyze_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      })
      console.log('✓ 插入测试用户')
    } else {
      console.log('- 测试用户已存在')
    }
    
    console.log('\n✅ 数据库初始化完成！')
    
  } catch (error) {
    console.error('❌ 初始化失败:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// 运行初始化
initDatabase()
