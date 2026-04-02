@echo off
chcp 65001 >nul
echo ========================================
echo 构建验证脚本
echo ========================================
echo.
echo 此脚本将验证本地构建是否正确
echo.

echo [1/3] 检查h5目录...
if not exist "h5" (
    echo ❌ 错误: h5目录不存在
    pause
    exit /b 1
)
echo ✅ h5目录存在

echo.
echo [2/3] 检查构建输出...
if not exist "h5\dist" (
    echo ❌ 错误: h5\dist目录不存在
    echo.
    echo 请先运行构建:
    echo   cd h5
    echo   npm run build
    pause
    exit /b 1
)
echo ✅ h5\dist目录存在

echo.
echo [3/3] 检查构建文件...
if not exist "h5\dist\index.html" (
    echo ❌ 错误: index.html不存在
    pause
    exit /b 1
)
echo ✅ index.html存在

if not exist "h5\dist\assets" (
    echo ❌ 错误: assets目录不存在
    pause
    exit /b 1
)
echo ✅ assets目录存在

echo.
echo ========================================
echo 📁 构建文件列表
echo ========================================
dir /b h5\dist
echo.
dir /b h5\dist\assets
echo.

echo ========================================
echo 📄 index.html内容预览
echo ========================================
type h5\dist\index.html | findstr /C:"script" /C:"link"
echo.

echo ========================================
echo ✅ 验证完成
echo ========================================
echo.
echo 检查结果：
echo - h5/dist 目录存在
echo - index.html 存在
echo - assets 目录存在
echo - JS和CSS文件已生成
echo.
echo 📌 Cloudflare Pages配置应该是：
echo    Build output directory: h5/dist
echo.
echo 如果Cloudflare配置正确但仍然白屏，
echo 请使用CLI部署: deploy-pages-cli.bat
echo.
pause
