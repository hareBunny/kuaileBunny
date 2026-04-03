/**
 * 测试MXNZP API
 */

import https from 'https';

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
    // 测试1: 尝试不传期号（获取最新）
    console.log('1️⃣ 测试获取最新快乐8数据（不传期号）...');
    let url = `https://www.mxnzp.com/api/lottery/common/latest?code=kl8&app_id=${APP_ID}&app_secret=${APP_SECRET}`;
    
    console.log('尝试URL: /api/lottery/common/latest');
    let response = await httpsGet(url);
    
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
      
      // 测试2: 使用获取到的期号再次查询
      console.log('\n\n2️⃣ 测试使用期号查询...');
      const expect = response.data.expect;
      url = `https://www.mxnzp.com/api/lottery/common/aim_lottery?code=kl8&expect=${expect}&app_id=${APP_ID}&app_secret=${APP_SECRET}`;
      
      const response2 = await httpsGet(url);
      console.log('响应状态码:', response2.code);
      console.log('响应消息:', response2.msg);
      
      if (response2.code === 1) {
        console.log('✅ 指定期号查询成功！');
      }
    } else {
      console.log('\n❌ API调用失败');
      console.log('错误信息:', response.msg);
      
      // 尝试生成一个期号
      console.log('\n\n2️⃣ 尝试使用今天的期号...');
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const expect = `${year}${month}${day}001`; // 假设第一期
      
      console.log('生成期号:', expect);
      url = `https://www.mxnzp.com/api/lottery/common/aim_lottery?code=kl8&expect=${expect}&app_id=${APP_ID}&app_secret=${APP_SECRET}`;
      
      response = await httpsGet(url);
      console.log('\n响应状态码:', response.code);
      console.log('响应消息:', response.msg);
      
      if (response.code === 1) {
        console.log('\n✅ API调用成功！');
        console.log('\n返回数据:');
        console.log('  期号:', response.data.expect);
        console.log('  号码:', response.data.openCode);
        console.log('  时间:', response.data.time);
      }
    }
    
    console.log('\n=== 测试完成 ===');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

test();
