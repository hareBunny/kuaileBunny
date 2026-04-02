/**
 * 向线上D1数据库添加演示数据
 */

// 生成随机快乐8号码
function generateNumbers() {
  const numbers = [];
  while (numbers.length < 20) {
    const num = Math.floor(Math.random() * 80) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

// 生成期号
function generateIssue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const issue = String(Math.floor(Math.random() * 100)).padStart(3, '0');
  return `${year}${month}${day}${issue}`;
}

// 生成开奖时间
function generateDrawTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// 生成多条数据
function generateDemoData(count = 10) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const numbers = generateNumbers();
    const sum = numbers.reduce((a, b) => a + b, 0);
    
    data.push({
      issue: generateIssue(),
      numbers: numbers.join(','),
      sum: sum,
      draw_time: generateDrawTime()
    });
  }
  return data;
}

// 输出SQL语句
const demoData = generateDemoData(10);

console.log('=== 向线上D1数据库添加演示数据 ===\n');
console.log('请在Cloudflare Dashboard中执行以下SQL:\n');
console.log('1. 访问: https://dash.cloudflare.com');
console.log('2. Workers & Pages → D1 → kuaile8');
console.log('3. 点击 "Console" 标签');
console.log('4. 复制并执行以下SQL:\n');
console.log('```sql');

demoData.forEach(item => {
  console.log(`INSERT INTO lottery_results (issue, numbers, sum, draw_time) VALUES ('${item.issue}', '${item.numbers}', ${item.sum}, '${item.draw_time}');`);
});

console.log('```\n');
console.log('或者使用wrangler命令行:\n');
console.log('```bash');
demoData.forEach(item => {
  console.log(`wrangler d1 execute kuaile8 --remote --command="INSERT INTO lottery_results (issue, numbers, sum, draw_time) VALUES ('${item.issue}', '${item.numbers}', ${item.sum}, '${item.draw_time}')"`);
});
console.log('```\n');

console.log('=== 生成的演示数据 ===\n');
demoData.forEach((item, index) => {
  console.log(`${index + 1}. 期号: ${item.issue}`);
  console.log(`   号码: ${item.numbers}`);
  console.log(`   总和: ${item.sum}`);
  console.log(`   时间: ${item.draw_time}\n`);
});
