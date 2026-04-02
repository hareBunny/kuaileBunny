import axios from 'axios'

console.log('=== 快乐8 API 测试工具 ===\n')

// 测试数字星空API
async function testSzxkAPI() {
  console.log('1️⃣ 测试数字星空API (szxk365.com)')
  console.log('-----------------------------------')
  
  const apikey = process.env.SZXK_API_KEY || 'YOUR_API_KEY'
  
  if (apikey === 'YOUR_API_KEY') {
    console.log('❌ 未配置API KEY')
    console.log('   请设置环境变量: export SZXK_API_KEY=your_key')
    console.log('   或访问 https://szxk365.com 注册获取\n')
    return false
  }
  
  try {
    const url = 'https://szxk365.com/api/openapi.lottery/kjxx'
    console.log(`请求: ${url}`)
    console.log(`参数: apikey=${apikey.substring(0, 8)}..., code=kl8\n`)
    
    const response = await axios.get(url, {
      params: { apikey, code: 'kl8' },
      timeout: 10000
    })
    
    const result = response.data
    
    if (result.code === 1) {
      console.log('✅ 测试成功！')
      console.log(`期号: ${result.data.issue}`)
      console.log(`号码: ${result.data.red}`)
      console.log(`日期: ${result.data.drawdate}\n`)
      return true
    } else {
      console.log(`❌ API返回错误: ${result.msg}\n`)
      return false
    }
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}\n`)
    return false
  }
}

// 测试极速数据API
async function testJisuAPI() {
  console.log('2️⃣ 测试极速数据API (jisuapi.com)')
  console.log('-----------------------------------')
  
  const appkey = process.env.JISU_APP_KEY || 'YOUR_APP_KEY'
  
  if (appkey === 'YOUR_APP_KEY') {
    console.log('❌ 未配置APP KEY')
    console.log('   请设置环境变量: export JISU_APP_KEY=your_key')
    console.log('   或访问 https://www.jisuapi.com 注册获取\n')
    return false
  }
  
  try {
    const url = 'https://api.jisuapi.com/caipiao/query'
    console.log(`请求: ${url}`)
    console.log(`参数: appkey=${appkey.substring(0, 8)}..., caipiaoid=13\n`)
    
    const response = await axios.get(url, {
      params: { appkey, caipiaoid: '13' },
      timeout: 10000
    })
    
    const result = response.data
    
    if (result.status === 0) {
      console.log('✅ 测试成功！')
      console.log(`期号: ${result.result.issueno}`)
      console.log(`号码: ${result.result.number}`)
      console.log(`日期: ${result.result.opendate}\n`)
      return true
    } else {
      console.log(`❌ API返回错误: ${result.msg}\n`)
      return false
    }
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}\n`)
    return false
  }
}

// 测试接口盒子API
async function testApihzAPI() {
  console.log('3️⃣ 测试接口盒子API (apihz.cn)')
  console.log('-----------------------------------')
  
  const id = process.env.APIHZ_ID || 'YOUR_ID'
  const key = process.env.APIHZ_KEY || 'YOUR_KEY'
  
  if (id === 'YOUR_ID' || key === 'YOUR_KEY') {
    console.log('❌ 未配置API ID/KEY')
    console.log('   请设置环境变量:')
    console.log('   export APIHZ_ID=your_id')
    console.log('   export APIHZ_KEY=your_key')
    console.log('   或访问 https://www.apihz.cn 注册获取\n')
    return false
  }
  
  try {
    const url = 'https://cn.apihz.cn/api/caipiao/kuaile8.php'
    console.log(`请求: ${url}`)
    console.log(`参数: id=${id}, key=${key.substring(0, 8)}...\n`)
    
    const response = await axios.get(url, {
      params: { id, key },
      timeout: 10000
    })
    
    const result = response.data
    
    if (result.qihao && result.number) {
      console.log('✅ 测试成功！')
      console.log(`期号: ${result.qihao}`)
      console.log(`号码: ${result.number}`)
      console.log(`时间: ${result.time}\n`)
      return true
    } else {
      console.log(`❌ API返回错误: ${result.msg || JSON.stringify(result)}\n`)
      return false
    }
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}\n`)
    return false
  }
}

// 运行所有测试
async function runAllTests() {
  const results = []
  
  results.push(await testSzxkAPI())
  results.push(await testJisuAPI())
  results.push(await testApihzAPI())
  
  console.log('=== 测试总结 ===')
  console.log(`数字星空API: ${results[0] ? '✅ 可用' : '❌ 不可用'}`)
  console.log(`极速数据API: ${results[1] ? '✅ 可用' : '❌ 不可用'}`)
  console.log(`接口盒子API: ${results[2] ? '✅ 可用' : '❌ 不可用'}`)
  
  const available = results.filter(r => r).length
  console.log(`\n可用API数量: ${available}/3`)
  
  if (available === 0) {
    console.log('\n⚠️  所有API都不可用，请先配置API KEY')
    console.log('推荐使用数字星空API: https://szxk365.com')
  } else {
    console.log('\n✅ 至少有一个API可用，可以开始爬取数据！')
  }
}

// 运行测试
runAllTests().catch(console.error)
