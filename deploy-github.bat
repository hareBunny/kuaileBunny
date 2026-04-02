@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ===================================
echo 快乐8百宝箱 - GitHub部署
echo ===================================
echo.

REM 检查是否已经是git仓库
if exist ".git" (
    echo ⚠️  检测到已存在的Git仓库
    set /p reinit="是否要重新初始化？(y/n): "
    if /i "!reinit!"=="y" (
        echo 删除现有Git仓库...
        rmdir /s /q .git
    ) else (
        echo 使用现有Git仓库
        git status
        echo.
        set /p continue="是否继续推送到GitHub？(y/n): "
        if /i not "!continue!"=="y" (
            echo 取消部署
            exit /b 0
        )
        git add .
        git commit -m "update: 更新项目代码"
        git push
        exit /b 0
    )
)

REM 初始化Git仓库
echo 1️⃣ 初始化Git仓库...
git init
if errorlevel 1 (
    echo ❌ Git初始化失败，请确保已安装Git
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git仓库初始化完成
echo.

REM 添加所有文件
echo 2️⃣ 添加文件到Git...
git add .
echo ✓ 文件添加完成
echo.

REM 提交
echo 3️⃣ 提交代码...
git commit -m "feat: 快乐8百宝箱初始版本" -m "- H5前端（React + TypeScript + Vite）" -m "- Cloudflare Workers后端" -m "- 数据爬虫系统（支持多种API）" -m "- 完整的法律声明和免责条款" -m "- 微信小程序（备用）"
echo ✓ 代码提交完成
echo.

REM 设置主分支
echo 4️⃣ 设置主分支为main...
git branch -M main
echo ✓ 主分支设置完成
echo.

REM 添加远程仓库
echo 5️⃣ 添加远程仓库...
git remote add origin https://github.com/hareBunny/kuaileBunny.git
echo ✓ 远程仓库添加完成
echo.

REM 推送到GitHub
echo 6️⃣ 推送到GitHub...
echo ⚠️  如果是首次推送，可能需要输入GitHub用户名和密码
echo    建议使用Personal Access Token作为密码
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ===================================
    echo ❌ 推送失败
    echo ===================================
    echo.
    echo 可能的原因：
    echo 1. 远程仓库不存在或无权限
    echo 2. 需要配置GitHub认证
    echo 3. 网络连接问题
    echo.
    echo 解决方案：
    echo 1. 确认仓库已创建：https://github.com/hareBunny/kuaileBunny
    echo 2. 配置Git凭据：
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    echo 3. 使用Personal Access Token：
    echo    https://github.com/settings/tokens
    echo.
) else (
    echo.
    echo ===================================
    echo ✅ 部署成功！
    echo ===================================
    echo.
    echo 📦 仓库地址：
    echo    https://github.com/hareBunny/kuaileBunny
    echo.
    echo 🌐 下一步：
    echo    1. 访问 Cloudflare Dashboard
    echo    2. 进入 Pages 创建项目
    echo    3. 连接 GitHub 仓库
    echo    4. 配置构建设置（见 cloudflare-pages-config.md）
    echo.
)

pause
