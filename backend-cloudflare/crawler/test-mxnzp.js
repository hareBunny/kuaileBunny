/**
 * 测试MXNZP API
 */

const https = require('https');

const APP_ID = 'ceoplkrvuljhijpk';
const APP_SECRET = process.env.MXNZP_APP_SECRET || ''; // 从环境变量获取

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('JSON解析失败: ' + e.message));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function test() {
  console.log('=== 测试MXNZP API ===\n');
  
  if (!APP_SECRET) {
    console.error('❌ 错误: 未设置 APP_SECRET');
    console.log('\n请设置环境变量:');
    console.log('  set MXNZP_APP_SECRET=your_secret');
    console.log('\n然后运行:');
    console.log('  node test-mxnzp.js');
    process.exit(1);
  }
  
  console.log('APP_ID:', APP_ID);
  console.log('APP_SECRET:', APP_SECRET.substring(0, 4) + '***');
  console.log('');
  
  try {
    // 测试获取最新数据
    console.log('1️⃣ 测试获取最新快乐8数据...');
    const url = `https://www.mxnzp.com/api/lottery/common/aim_lottery?code=kl8&app_id=${APP_ID}&app_secret=${APP_SECRET}`;
    
    const response = await httpsGet(url);
    
    console.log('\n响应状态码:', response.code);
    console.log('响应消息:', response.msg);
    
    if (response.code === 1) {
      console.log('\n✅ API调用成功！');
      console.log('\n返回数据:');
      console.log('  期号:', response.data.expect);
      console.log('  号码:', response.data.openCode);
      console.log('  时间:', response.data.time);
      console.log('  名称:', response.data.name);
      
      // 解析号码
      const numbers = response.data.openCode.split(',').map(n => parseInt(n.trim()));
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      console.log('\n  号码数组:', numbers);
      console.log('  号码总和:', sum);
      console.log('  号码数量:', numbers.length);
      
      if (numbers.length === 20) {
        console.log('\n✅ 号码格式正确（20个号码）');
      } else {
        console.log('\n⚠️  警告: 号码数量不正确，应该是20个');
      }
    } else {
      console.log('\n❌ API调用失败');
      console.log('错误信息:', response.msg);
      
      if (response.msg && response.msg.includes('app_secret')) {
        console.log('\n💡 提示: APP_SECRET可能不正确，请检查');
      }
    }
    
    console.log('\n=== 测试完成 ===');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

test();
