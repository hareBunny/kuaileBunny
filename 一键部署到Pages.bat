@echo off
chcp 65001 >nul
echo ========================================
echo 一键部署H5前端到Cloudflare Pages
echo ========================================
echo.
echo 注意：这会部署到Pages（静态网站托管）
echo      不是Workers（API服务）
echo.
echo 当前错误：你访问的是workers.dev域名
echo 正确地址：应该是pages.dev域名
echo.
pause

echo.
echo [1/5] 检查wrangler...
where wrangler >nul 2>&1
if errorlevel 1 (
    echo ⚠️  未找到wrangler，正在安装...
    call npm install -g wrangler
    if errorlevel 1 (
        echo ❌ 安装失败，请手动安装: npm install -g wrangler
        pause
        exit /b 1
    )
)
echo ✅ wrangler已安装

echo.
echo [2/5] 检查登录状态...
wrangler whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠️  未登录，请在浏览器中完成授权...
    wrangler login
    if errorlevel 1 (
        echo ❌ 登录失败
        pause
        exit /b 1
    )
)
echo ✅ 已登录Cloudflare

echo.
echo [3/5] 进入h5目录并安装依赖...
cd h5
if errorlevel 1 (
    echo ❌ 无法进入h5目录
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    cd ..
    pause
    exit /b 1
)

echo.
echo [4/5] 构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    cd ..
    pause
    exit /b 1
)

echo.
echo ========================================
echo 构建成功！文件列表：
echo ========================================
dir /b dist
echo.
dir /b dist\assets
echo.

echo [5/5] 部署到Cloudflare Pages...
echo.
echo 📦 正在上传文件到Pages...
echo.
call npx wrangler pages deploy dist --project-name=kuaile8
if errorlevel 1 (
    echo.
    echo ❌ 部署失败
    echo.
    echo 可能的原因：
    echo 1. 项目名称冲突 - 尝试修改项目名称
    echo 2. 权限不足 - 检查Cloudflare账号权限
    echo 3. 网络问题 - 检查网络连接
    echo.
    echo 你也可以在Dashboard中手动创建Pages项目：
    echo 1. 访问 https://dash.cloudflare.com
    echo 2. Workers ^& Pages → Create application → Pages
    echo 3. Connect to Git → 选择你的GitHub仓库
    echo 4. 配置构建设置（见文档）
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo 🎉 部署成功！
echo ========================================
echo.
echo ✅ 你的网站已部署到Cloudflare Pages
echo.
echo 📍 访问地址: https://kuaile8.pages.dev
echo.
echo 提示：
echo - 这是Pages地址（.pages.dev），不是Workers地址（.workers.dev）
echo - Pages用于托管静态网站（HTML/JS/CSS）
echo - Workers用于运行后端API
echo - 首次部署可能需要几分钟生效
echo - 可以在Dashboard查看部署状态
echo.
echo 🔗 Dashboard: https://dash.cloudflare.com
echo.
pause
