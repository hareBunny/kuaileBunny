@echo off
chcp 65001 >nul

echo ===================================
echo Cloudflare Pages CLI部署
echo ===================================
echo.

echo 1️⃣ 进入H5目录...
cd h5

echo 2️⃣ 安装依赖...
call npm install

echo 3️⃣ 构建项目...
call npm run build

if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo.
echo ✅ 构建成功！
echo.
echo 构建输出目录: h5/dist
dir dist
echo.

echo 4️⃣ 部署到Cloudflare Pages...
echo.
echo 请确保已安装wrangler: npm install -g wrangler
echo 请确保已登录: wrangler login
echo.
pause

npx wrangler pages deploy dist --project-name=kuaile8

if errorlevel 1 (
    echo.
    echo ❌ 部署失败
    echo.
    echo 请检查：
    echo 1. 是否已安装wrangler: npm install -g wrangler
    echo 2. 是否已登录: wrangler login
    echo 3. 项目名称是否正确
    echo.
) else (
    echo.
    echo ===================================
    echo ✅ 部署成功！
    echo ===================================
    echo.
    echo 访问地址: https://kuaile8.pages.dev
    echo.
)

cd ..
pause
