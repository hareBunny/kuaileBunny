/**
 * 快乐8数据爬虫 - MXNZP API
 * API文档: https://www.mxnzp.com
 */

import https from 'https';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// 配置
const CONFIG = {
  APP_ID: process.env.MXNZP_APP_ID || 'ceoplkrvuljhijpk',
  APP_SECRET: process.env.MXNZP_APP_SECRET || 'lCG5xp0E8UgzMtmwcUw2xUByGShH6csg',
  API_URL: 'https://www.mxnzp.com/api/lottery/common/latest',
  CODE: 'kl8', // 快乐8
};

/**
 * 发起HTTPS请求
 */
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

/**
 * 获取最新开奖数据
 */
async function getLatestData() {
  try {
    // 构建URL - 使用latest接口获取最新数据
    const url = `${CONFIG.API_URL}?code=${CONFIG.CODE}&app_id=${CONFIG.APP_ID}&app_secret=${CONFIG.APP_SECRET}`;
    
    console.log('请求URL:', url.replace(CONFIG.APP_SECRET, '***'));
    
    const response = await httpsGet(url);
    
    // 检查响应
    if (response.code !== 1) {
      throw new Error(`API返回错误: ${response.msg || '未知错误'}`);
    }
    
    const data = response.data;
    
    if (!data) {
      throw new Error('API返回数据为空');
    }
    
    return {
      expect: data.expect,
      openCode: data.openCode,
      time: data.time,
      name: data.name,
      code: data.code
    };
  } catch (error) {
    console.error('获取数据失败:', error.message);
    throw error;
  }
}

/**
 * 解析开奖号码
 */
function parseNumbers(openCode) {
  // openCode格式: "01,05,08,12,15,18,22,25,28,32,35,38,42,45,48,52,55,58,62,65"
  const numbers = openCode.split(',').map(num => parseInt(num.trim()));
  
  if (numbers.length !== 20) {
    throw new Error(`号码数量不正确: ${numbers.length}，应该是20个`);
  }
  
  return numbers;
}

/**
 * 保存到数据库
 */
async function saveToDatabase(data) {
  try {
    const numbers = parseNumbers(data.openCode);
    const sum = numbers.reduce((a, b) => a + b, 0);
    
    // 转换时间格式
    const drawDate = new Date(data.time).getTime();
    const createdAt = Date.now();
    
    // 构建SQL（单行，避免换行问题）
    const numbersJson = JSON.stringify(numbers);
    const sql = `INSERT INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('kuaile8', '${data.expect}', ${drawDate}, '${numbersJson}', ${sum}, ${createdAt}) ON CONFLICT(draw_no) DO UPDATE SET numbers = excluded.numbers, sum = excluded.sum, draw_date = excluded.draw_date`;
    
    // 执行SQL
    const command = `wrangler d1 execute kuaile8 --remote --command="${sql}"`;
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr && !stderr.includes('Executing on remote database')) {
      console.error('数据库错误:', stderr);
      throw new Error('保存到数据库失败');
    }
    
    console.log('✓ 保存成功');
    return true;
  } catch (error) {
    console.error('保存失败:', error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('=== 快乐8数据爬虫 (MXNZP API) ===\n');
  
  // 检查配置
  if (!CONFIG.APP_SECRET) {
    console.error('❌ 错误: 未设置 APP_SECRET');
    console.log('\n请设置环境变量:');
    console.log('  set MXNZP_APP_SECRET=your_secret');
    console.log('\n或者直接修改脚本中的 APP_SECRET 配置');
    process.exit(1);
  }
  
  const now = new Date();
  console.log('执行时间:', now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  console.log('');
  
  try {
    // 获取最新数据
    console.log('获取最新开奖数据...');
    const data = await getLatestData();
    
    console.log('\n获取到数据:');
    console.log('期号:', data.expect);
    console.log('号码:', data.openCode);
    console.log('时间:', data.time);
    console.log('名称:', data.name);
    
    // 保存到数据库
    console.log('\n保存到数据库...');
    await saveToDatabase(data);
    
    console.log('\n=== 完成 ===');
  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  }
}

// 运行
main();

export { getLatestData, parseNumbers, saveToDatabase };
