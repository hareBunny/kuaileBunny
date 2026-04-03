/**
 * 快乐8历史数据批量爬取 - MXNZP API
 * 用于初始化数据库，获取近一年的历史数据
 */

import https from 'https';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

// 配置
const CONFIG = {
  APP_ID: process.env.MXNZP_APP_ID || 'ceoplkrvuljhijpk',
  APP_SECRET: process.env.MXNZP_APP_SECRET || 'lCG5xp0E8UgzMtmwcUw2xUByGShH6csg',
  API_URL: 'https://www.mxnzp.com/api/lottery/common/history',
  CODE: 'kl8',
  DELAY: 1500, // 请求间隔（毫秒），避免超过QPS限制
};

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
 * 获取历史数据（按日期）
 */
async function getHistoryByDate(date) {
  try {
    // 格式化日期: YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];
    const url = `${CONFIG.API_URL}?code=${CONFIG.CODE}&date=${dateStr}&app_id=${CONFIG.APP_ID}&app_secret=${CONFIG.APP_SECRET}`;
    
    console.log(`  请求日期: ${dateStr}`);
    
    const response = await httpsGet(url);
    
    if (response.code !== 1) {
      // 如果是没有数据，不算错误
      if (response.msg && response.msg.includes('暂无数据')) {
        console.log(`  ⚠️  ${dateStr} 暂无数据`);
        return [];
      }
      throw new Error(`API返回错误: ${response.msg || '未知错误'}`);
    }
    
    const data = response.data;
    
    if (!data || data.length === 0) {
      console.log(`  ⚠️  ${dateStr} 无数据`);
      return [];
    }
    
    console.log(`  ✓ 获取到 ${data.length} 条数据`);
    return data;
  } catch (error) {
    console.error(`  ❌ 获取失败:`, error.message);
    return [];
  }
}

/**
 * 解析开奖号码
 */
function parseNumbers(openCode) {
  const numbers = openCode.split(',').map(num => parseInt(num.trim()));
  if (numbers.length !== 20) {
    throw new Error(`号码数量不正确: ${numbers.length}，应该是20个`);
  }
  return numbers;
}

/**
 * 批量保存到数据库
 */
async function saveBatchToDatabase(dataList) {
  if (dataList.length === 0) {
    return 0;
  }
  
  let successCount = 0;
  
  for (const data of dataList) {
    try {
      const numbers = parseNumbers(data.openCode);
      const sum = numbers.reduce((a, b) => a + b, 0);
      const drawDate = new Date(data.time).getTime();
      const createdAt = Date.now();
      const numbersJson = JSON.stringify(numbers);
      
      const sql = `INSERT INTO lottery_results (lottery_type, draw_no, draw_date, numbers, sum, created_at) VALUES ('kuaile8', '${data.expect}', ${drawDate}, '${numbersJson}', ${sum}, ${createdAt}) ON CONFLICT(draw_no) DO UPDATE SET numbers = excluded.numbers, sum = excluded.sum, draw_date = excluded.draw_date`;
      
      const command = `wrangler d1 execute kuaile8 --remote --command="${sql}"`;
      await execPromise(command);
      
      successCount++;
      process.stdout.write('.');
    } catch (error) {
      console.error(`\n  ❌ 保存失败 (期号: ${data.expect}):`, error.message);
    }
  }
  
  return successCount;
}

/**
 * 生成日期范围
 */
function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * 主函数
 */
async function main() {
  console.log('=== 快乐8历史数据批量爬取 ===\n');
  
  // 检查配置
  if (!CONFIG.APP_SECRET) {
    console.error('❌ 错误: 未设置 APP_SECRET');
    process.exit(1);
  }
  
  // 获取命令行参数
  const args = process.argv.slice(2);
  let days = 365; // 默认一年
  
  if (args.length > 0) {
    days = parseInt(args[0]);
    if (isNaN(days) || days <= 0) {
      console.error('❌ 错误: 天数参数无效');
      console.log('用法: node mxnzp-history.js [天数]');
      console.log('示例: node mxnzp-history.js 30  # 获取最近30天');
      process.exit(1);
    }
  }
  
  console.log(`配置信息:`);
  console.log(`  APP_ID: ${CONFIG.APP_ID}`);
  console.log(`  获取天数: ${days} 天`);
  console.log(`  请求间隔: ${CONFIG.DELAY}ms`);
  console.log('');
  
  // 计算日期范围
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  console.log(`日期范围:`);
  console.log(`  开始: ${startDate.toISOString().split('T')[0]}`);
  console.log(`  结束: ${endDate.toISOString().split('T')[0]}`);
  console.log('');
  
  const dates = generateDateRange(startDate, endDate);
  console.log(`共需要爬取 ${dates.length} 天的数据\n`);
  
  // 确认
  console.log('⚠️  注意:');
  console.log(`  - 预计耗时: ${Math.ceil(dates.length * CONFIG.DELAY / 1000 / 60)} 分钟`);
  console.log(`  - 请求次数: ${dates.length} 次`);
  console.log(`  - 请确保网络稳定`);
  console.log('');
  
  // 开始爬取
  console.log('开始爬取...\n');
  
  let totalData = 0;
  let totalSaved = 0;
  let processedDays = 0;
  
  const startTime = Date.now();
  
  for (const date of dates) {
    processedDays++;
    const progress = ((processedDays / dates.length) * 100).toFixed(1);
    
    console.log(`[${processedDays}/${dates.length}] (${progress}%)`);
    
    // 获取数据
    const dataList = await getHistoryByDate(date);
    totalData += dataList.length;
    
    // 保存数据
    if (dataList.length > 0) {
      process.stdout.write('  保存中: ');
      const saved = await saveBatchToDatabase(dataList);
      totalSaved += saved;
      console.log(` ✓ 保存 ${saved}/${dataList.length} 条`);
    }
    
    // 延迟，避免超过QPS限制
    if (processedDays < dates.length) {
      await sleep(CONFIG.DELAY);
    }
    
    console.log('');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(1);
  
  console.log('=== 完成 ===\n');
  console.log(`统计信息:`);
  console.log(`  处理天数: ${processedDays} 天`);
  console.log(`  获取数据: ${totalData} 条`);
  console.log(`  保存成功: ${totalSaved} 条`);
  console.log(`  耗时: ${duration} 分钟`);
  console.log('');
  
  if (totalSaved > 0) {
    console.log('✅ 历史数据爬取完成！');
    console.log('\n可以运行以下命令查看数据:');
    console.log('  wrangler d1 execute kuaile8 --remote --command="SELECT COUNT(*) as total FROM lottery_results"');
  } else {
    console.log('⚠️  未保存任何数据，请检查API配置');
  }
}

// 运行
main().catch(error => {
  console.error('\n❌ 执行失败:', error.message);
  process.exit(1);
});
