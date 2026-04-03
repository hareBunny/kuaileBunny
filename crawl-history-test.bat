@echo off
chcp 65001 >nul
echo ========================================
echo 快乐8历史数据爬取 - 测试（7天）
echo ========================================
echo.
echo 将爬取最近7天的历史数据
echo 预计耗时: 约2分钟
echo.
pause

cd backend-cloudflare\crawler
node mxnzp-history.js 7

echo.
echo ========================================
echo 完成！
echo ========================================
echo.
echo 查看数据:
echo   wrangler d1 execute kuaile8 --remote --command="SELECT COUNT(*) as total FROM lottery_results"
echo.
pause
