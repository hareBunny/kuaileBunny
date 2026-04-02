@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ===================================
echo 快乐8百宝箱 - 一键部署脚本
echo ===================================
echo.
echo 本脚本将帮助你完成：
echo 1. 推送代码到GitHub
echo 2. 部署H5前端到Cloudflare Pages
echo 3. 部署后端到Cloudflare Workers
echo 4. 配置数据爬虫
echo.
pause
echo.

REM ===================================
REM 第一步：GitHub部署
REM ===================================
echo ===================================
echo 第一步：部署到GitHub
echo ===================================
echo.

if exist ".git" (
    echo ✓ Git仓库已存在
    git status
) else (
    echo 初始化Git仓库...
    git init
    git add .
    git commit -m "feat: 快乐8百宝箱初始版本"
    git branch -M main
    git remote add origin https://github.com/hareBunny/kuaileBunny.git
)

echo.
echo 推送到GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ GitHub推送失败
    echo.
    echo 请检查：
    echo 1. GitHub仓库是否已创建
    echo 2. Git凭据是否配置
    echo 3. 网络连接是否正常
    echo.
    echo 手动推送命令：
    echo git push -u origin main
    echo.
    pause
    exit /b 1
)

echo ✓ GitHub部署完成
echo.

REM ===================================
REM 第二步：Cloudflare Pages部署
REM ===================================
echo ===================================
echo 第二步：部署H5前端到Cloudflare Pages
echo ===================================
echo.

echo 请选择部署方式：
echo 1. 通过Cloudflare Dashboard（推荐）
echo 2. 使用Wrangler CLI
echo.
set /p deploy_method="请输入选项 (1/2): "

if "%deploy_method%"=="2" (
    echo.
    echo 使用Wrangler CLI部署...
    echo.
    
    REM 检查wrangler
    where wrangler >nul 2>&1
    if errorlevel 1 (
        echo 安装Wrangler...
        npm install -g wrangler
    )
    
    REM 登录
    echo 登录Cloudflare...
    wrangler login
    
    REM 构建前端
    echo.
    echo 构建H5前端...
    cd h5
    call npm install
    call npm run build
    
    if errorlevel 1 (
        echo ❌ 构建失败
        cd ..
        pause
        exit /b 1
    )
    
    REM 部署
    echo.
    echo 部署到Cloudflare Pages...
    npx wrangler pages deploy dist --project-name=kuaile8
    
    cd ..
    echo ✓ H5前端部署完成
) else (
    echo.
    echo 请按照以下步骤在Cloudflare Dashboard中部署：
    echo.
    echo 1. 访问 https://dash.cloudflare.com
    echo 2. 点击 Workers ^& Pages
    echo 3. 点击 Create application
    echo 4. 选择 Pages -^> Connect to Git
    echo 5. 选择 GitHub -^> hareBunny/kuaileBunny
    echo 6. 配置构建设置：
    echo    - 项目名称: kuaile8
    echo    - 构建命令: cd h5 ^&^& npm install ^&^& npm run build
    echo    - 输出目录: h5/dist
    echo    - 环境变量: NODE_VERSION=18
    echo 7. 点击 Save and Deploy
    echo.
    echo 完成后按任意键继续...
    pause >nul
    echo ✓ H5前端部署完成
)

echo.

REM ===================================
REM 第三步：Cloudflare Workers部署
REM ===================================
echo ===================================
echo 第三步：部署后端到Cloudflare Workers
echo ===================================
echo.

cd backend-cloudflare

REM 检查wrangler
where wrangler >nul 2>&1
if errorlevel 1 (
    echo 安装Wrangler...
    npm install -g wrangler
)

REM 登录
echo 确保已登录Cloudflare...
wrangler whoami
if errorlevel 1 (
    wrangler login
)

echo.
echo 请按照以下步骤配置后端：
echo.
echo 1. 创建D1数据库（如果还没创建）：
echo    wrangler d1 create kuaile8
echo.
echo 2. 创建KV命名空间（如果还没创建）：
echo    wrangler kv:namespace create CACHE
echo.
echo 3. 更新 wrangler.toml 中的 database_id 和 kv id
echo.
echo 4. 初始化数据库：
echo    wrangler d1 execute kuaile8 --file=./schema.sql --remote
echo.
echo 5. 配置密钥：
echo    wrangler secret put JWT_SECRET
echo    wrangler secret put CRON_SECRET
echo.
echo 是否已完成以上配置？
set /p backend_ready="(y/n): "

if /i "%backend_ready%"=="y" (
    echo.
    echo 部署Workers...
    call wrangler deploy
    
    if errorlevel 1 (
        echo ❌ Workers部署失败
        cd ..
        pause
        exit /b 1
    )
    
    echo ✓ Workers部署完成
) else (
    echo.
    echo 请先完成配置，然后手动运行：
    echo cd backend-cloudflare
    echo wrangler deploy
)

cd ..
echo.

REM ===================================
REM 第四步：配置爬虫
REM ===================================
echo ===================================
echo 第四步：配置数据爬虫
echo ===================================
echo.

echo 爬虫需要在服务器上运行，请按照以下步骤：
echo.
echo 1. 注册API KEY：
echo    访问 https://szxk365.com 注册获取免费API KEY
echo.
echo 2. 在服务器上配置环境变量：
echo    export SZXK_API_KEY=your_api_key
echo.
echo 3. 启动定时任务：
echo    cd backend-cloudflare/crawler
echo    npm install
echo    npm run pm2:start
echo.
echo 4. 验证运行：
echo    pm2 status
echo    pm2 logs kuaile8-crawler
echo.
echo 详细文档：
echo - 爬虫快速入门.md
echo - 服务器部署指南.md
echo.

REM ===================================
REM 完成
REM ===================================
echo ===================================
echo ✅ 部署流程完成！
echo ===================================
echo.
echo 📦 GitHub仓库：
echo    https://github.com/hareBunny/kuaileBunny
echo.
echo 🌐 访问地址：
echo    H5前端: https://kuaile8.pages.dev
echo    后端API: https://your-worker.workers.dev
echo.
echo 📚 相关文档：
echo    - README.md
echo    - 快速部署指南.md
echo    - cloudflare-pages-config.md
echo    - Cloudflare部署指南.md
echo.
echo 🎉 恭喜！系统已部署完成！
echo.
pause
