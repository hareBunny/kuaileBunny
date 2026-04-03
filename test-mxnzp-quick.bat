@echo off
chcp 65001 >nul
echo ========================================
echo MXNZP API 快速测试
echo ========================================
echo.
echo 你的 APP_ID: ceoplkrvuljhijpk
echo.
set /p APP_SECRET=请输入你的 APP_SECRET: 

if "%APP_SECRET%"=="" (
    echo.
    echo ❌ 错误: APP_SECRET不能为空
    pause
    exit /b 1
)

echo.
echo 设置环境变量...
set MXNZP_APP_SECRET=%APP_SECRET%

echo.
echo 运行测试...
cd backend-cloudflare\crawler
node test-mxnzp.js

echo.
pause
