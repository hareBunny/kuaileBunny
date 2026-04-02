import axios from 'axios'

console.log('=== 快乐8系统完整流程测试 ===\n')

// 测试后端API
async function testBackendAPI() {
  console.log('1️⃣ 测试后端API')
  console.log('-----------------------------------')
  
  try {
    // 测试最新开奖
    console.log('测试: GET /api/kuaile8/latest')
    const latestRes = await axios.get('http://localhost:8787/api/kuaile8/latest')
    console.log('✅ 最新开奖API正常')
    console.log(`   期号: ${latestRes.data.data.draw_no}`)
    console.log(`   号码: ${latestRes.data.data.numbers.join(', ')}`)
    console.log(`   总和: ${latestRes.data.data.sum}\n`)
    
    return true
  } catch (error) {
    console.log(`❌ 后端API测试失败: ${error.message}\n`)
    return false
  }
}

// 测试前端
async function testFrontend() {
  console.log('2️⃣ 测试前端H5')
  console.log('-----------------------------------')
  
  try {
    const response = await axios.get('http://localhost:5173', {
      timeout: 5000,
      validateStatus: () => true
    })
    
    if (response.status === 200) {
      console.log('✅ H5前端正常运行')
      console.log('   访问地址: http://localhost:5173\n')
      return true
    } else {
      console.log(`⚠️  H5前端返回状态码: ${response.status}\n`)
      return false
    }
  } catch (error) {
    console.log(`⚠️  H5前端可能未启动: ${error.message}`)
    console.log('   提示: 运行 npm run dev (在h5目录)\n')
    return false
  }
}

// 测试数据库
async function testDatabase() {
  console.log('3️⃣ 测试数据库')
  console.log('-----------------------------------')
  
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)
    
    const { stdout } = await execAsync('wrangler d1 execute kuaile8 --command="SELECT COUNT(*) as total FROM lottery_results" --local', {
      cwd: '..'
    })
    
    // 尝试多种匹配模式
    let count = 0
    const patterns = [
      /│\s+(\d+)\s+│/,
      /total.*?(\d+)/i,
      /(\d+)\s+rows?/i
    ]
    
    for (const pattern of patterns) {
      const match = stdout.match(pattern)
      if (match) {
        count = parseInt(match[1])
        break
      }
    }
    
    if (count > 0) {
      console.log(`✅ 数据库正常`)
      console.log(`   共有 ${count} 条数据\n`)
      return true
    } else {
      console.log('⚠️  数据库可能为空或无法解析')
      console.log('   提示: 运行 npm run crawl:demo 生成测试数据\n')
      return false
    }
  } catch (error) {
    console.log(`❌ 数据库测试失败: ${error.message}\n`)
    return false
  }
}

// 运行所有测试
async function runAllTests() {
  const results = []
  
  results.push(await testBackendAPI())
  results.push(await testFrontend())
  results.push(await testDatabase())
  
  console.log('=== 测试总结 ===')
  console.log(`后端API: ${results[0] ? '✅ 正常' : '❌ 异常'}`)
  console.log(`H5前端: ${results[1] ? '✅ 正常' : '❌ 异常'}`)
  console.log(`数据库: ${results[2] ? '✅ 正常' : '❌ 异常'}`)
  
  const passed = results.filter(r => r).length
  console.log(`\n通过率: ${passed}/3 (${Math.round(passed/3*100)}%)`)
  
  if (passed === 3) {
    console.log('\n🎉 所有测试通过！系统运行正常！')
    console.log('\n📱 访问地址:')
    console.log('   H5前端: http://localhost:5173')
    console.log('   后端API: http://localhost:8787')
    console.log('\n💡 下一步:')
    console.log('   1. 注册API KEY: https://szxk365.com')
    console.log('   2. 配置环境变量: set SZXK_API_KEY=your_key')
    console.log('   3. 运行真实爬虫: npm run crawl:szxk')
    console.log('   4. 启动定时任务: npm run pm2:start')
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关服务')
  }
}

// 运行测试
runAllTests().catch(console.error)
