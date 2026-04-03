@echo off
chcp 65001 >nul
echo ========================================
echo 快乐8历史数据爬取 - 近一年
echo ========================================
echo.
echo ⚠️  重要提示:
echo   - 将爬取近365天的历史数据
echo   - 预计耗时: 约10小时
echo   - 请求次数: 365次
echo   - 请确保网络稳定
echo   - 建议在夜间运行
echo.
echo 💡 如果只需要测试，可以运行:
echo    crawl-history-test.bat (爬取7天)
echo.
set /p confirm=确认开始爬取一年数据? (Y/N): 

if /i not "%confirm%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo 开始爬取...
echo.

cd backend-cloudflare\crawler
node mxnzp-history.js 365

echo.
echo ========================================
echo 完成！
echo ========================================
echo.
echo 查看数据统计:
echo   wrangler d1 execute kuaile8 --remote --command="SELECT COUNT(*) as total FROM lottery_results"
echo.
pause
