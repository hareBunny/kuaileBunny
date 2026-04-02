# Cloudflare Pages 白屏问题 - 终极解决方案

## 🐛 问题描述

**错误信息**:
```
main.tsx:1 Failed to load module script: Expected a JavaScript module script 
but the server responded with a MIME type of "".
```

**现象**: 
- 页面完全白屏
- 浏览器控制台显示上述错误
- 错误指向 `main.tsx:1`（源文件，不是构建文件）

---

## 🎯 根本原因

Cloudflare Pages在尝试加载**源文件**（main.tsx）而不是**构建后的文件**（/assets/index-xxx.js）。

这说明Cloudflare找不到构建输出，回退到了源代码目录。

**100%确定的原因**: Cloudflare Dashboard中的 **Build output directory** 配置错误。

---

## ✅ 解决方案（按优先级）

### 🥇 方案1: 修正Dashboard配置（推荐）

这是最根本的解决方案。

#### 步骤：

1. **登录Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com
   - Workers & Pages → kuaile8

2. **检查当前配置**
   - 点击 **Settings** 标签
   - 点击 **Builds & deployments**
   - 查看 **Build configuration**

3. **修改配置**
   
   点击 **Edit configuration**，确保配置如下：

   ```
   Framework preset: None
   Build command: cd h5 && npm install && npm run build
   Build output directory: h5/dist
   Root directory: (留空)
   Node version: 18
   ```

   **关键点**: `Build output directory` 必须精确输入 `h5/dist`
   - ✅ 正确: `h5/dist`
   - ❌ 错误: `dist`
   - ❌ 错误: `/dist`
   - ❌ 错误: `./h5/dist`
   - ❌ 错误: `h5/dist/`

4. **保存并重新部署**
   - 点击 **Save**
   - 回到 **Deployments** 标签
   - 点击最新部署
   - 点击 **Retry deployment**
   - 勾选 **Clear build cache**

5. **等待部署完成**
   - 构建时间: 约2-3分钟
   - 查看构建日志确认成功

6. **验证**
   - 访问 https://kuaile8.pages.dev
   - 页面应该正常显示
   - 控制台无错误

---

### 🥈 方案2: 使用CLI直接部署（快速解决）

如果Dashboard配置有问题，可以用CLI绕过。

#### 前提条件：

```bash
# 安装wrangler（如果未安装）
npm install -g wrangler

# 登录Cloudflare账号（首次使用）
wrangler login
```

#### 部署步骤：

**Windows用户**:
```bash
# 运行部署脚本
deploy-pages-cli.bat
```

**手动部署**:
```bash
cd h5
npm install
npm run build
npx wrangler pages deploy dist --project-name=kuaile8
```

#### 优点：
- ✅ 绕过Dashboard配置问题
- ✅ 直接上传构建好的文件
- ✅ 立即生效
- ✅ 可以看到详细的上传进度

#### 注意：
- 首次使用需要在浏览器中授权
- 确保项目名称 `kuaile8` 与Dashboard中的一致
- CLI部署后，Dashboard中的配置不会改变

---

### 🥉 方案3: 重新创建Pages项目

如果上述方案都不行，可能是项目配置损坏。

#### 步骤：

1. **删除现有项目**
   - Cloudflare Dashboard → Workers & Pages
   - 找到 kuaile8 项目
   - Settings → 滚动到底部 → Delete project

2. **重新创建**
   - 点击 **Create application**
   - 选择 **Pages** → **Connect to Git**
   - 选择 GitHub 仓库: `hareBunny/kuaileBunny`
   - 配置构建设置：
     ```
     Framework preset: None
     Build command: cd h5 && npm install && npm run build
     Build output directory: h5/dist
     Root directory: (留空)
     ```
   - 添加环境变量: `NODE_VERSION = 18`
   - 点击 **Save and Deploy**

3. **等待首次部署完成**

---

## 🔍 诊断步骤

### 检查1: 验证本地构建

```bash
cd h5
npm run build
```

检查 `h5/dist/index.html` 内容：

```html
<script type="module" crossorigin src="/assets/index-B4qVRkUI.js"></script>
```

✅ 路径应该是 `/assets/xxx.js`，不是 `/src/main.tsx`

### 检查2: 查看Cloudflare构建日志

1. Deployments → 点击最新部署
2. 查看 **Build log**
3. 确认看到：
   ```
   ✓ built in XXXms
   dist/index.html
   dist/assets/index-xxx.js
   ```

### 检查3: 查看部署的文件

在构建日志底部，应该看到上传的文件列表：

```
Uploading...
✨ Success! Uploaded 8 files
  ✓ index.html
  ✓ _redirects
  ✓ _headers
  ✓ assets/index-B4qVRkUI.js
  ✓ assets/react-vendor-DaCcmJTR.js
  ✓ assets/vendor-Denf6LFr.js
  ✓ assets/index-tJL3prd5.css
```

如果看到的是源文件（src/main.tsx），说明配置错误。

### 检查4: 测试部署的文件

直接访问资源文件：

```
https://kuaile8.pages.dev/index.html
https://kuaile8.pages.dev/assets/index-B4qVRkUI.js
```

- 如果返回404 → 文件未上传，配置错误
- 如果返回源代码 → 上传了错误的文件
- 如果返回构建后的代码 → 配置正确，可能是缓存问题

---

## 🎯 推荐操作流程

### 立即执行：

**第一步: 检查Dashboard配置**

1. 访问 https://dash.cloudflare.com
2. Workers & Pages → kuaile8 → Settings → Builds & deployments
3. 查看 **Build output directory**
4. 如果不是 `h5/dist`，立即修改
5. 保存后重新部署

**第二步: 如果还不行，使用CLI部署**

```bash
# Windows
deploy-pages-cli.bat

# 或手动执行
cd h5
npm run build
npx wrangler pages deploy dist --project-name=kuaile8
```

**第三步: 验证部署**

访问 https://kuaile8.pages.dev

---

## 📊 配置对比

### ❌ 错误配置（会导致白屏）

```
Build command: cd h5 && npm install && npm run build
Build output directory: dist  ← 错误！
```

**结果**: Cloudflare在项目根目录找dist，找不到，回退到源代码

### ✅ 正确配置

```
Build command: cd h5 && npm install && npm run build
Build output directory: h5/dist  ← 正确！
```

**结果**: Cloudflare在h5/dist找到构建文件，正常部署

---

## 🆘 常见问题

### Q1: 为什么本地可以运行，部署后白屏？

**A**: 本地运行的是开发服务器（`npm run dev`），会自动处理路径。部署后运行的是静态文件，需要正确的构建输出。

### Q2: 我已经修改了配置，为什么还是白屏？

**A**: 可能的原因：
1. 浏览器缓存 - 按Ctrl+Shift+R强制刷新
2. Cloudflare缓存 - 在Dashboard中Purge cache
3. 配置未生效 - 需要重新部署（Retry deployment）

### Q3: CLI部署和Dashboard部署有什么区别？

**A**: 
- **Dashboard部署**: 连接GitHub，自动构建和部署
- **CLI部署**: 手动构建，直接上传文件

两种方式都可以，但CLI更直接，适合排查问题。

### Q4: 如何确认配置是否正确？

**A**: 查看构建日志，如果看到：
```
✓ built in XXXms
dist/index.html
dist/assets/index-xxx.js
```
说明构建成功。如果上传的文件列表包含 `src/main.tsx`，说明配置错误。

---

## 🎉 成功标志

部署成功后，你应该看到：

1. **首页正常显示**
   - 渐变背景
   - "快乐8专区"和"更多专区"卡片
   - 法律声明弹窗

2. **控制台无错误**
   - 按F12打开开发者工具
   - Console标签应该干净

3. **路由正常工作**
   - 点击"快乐8专区"进入详情页
   - 浏览器前进/后退按钮正常

4. **资源正确加载**
   - Network标签显示所有JS/CSS文件200状态
   - Content-Type正确（application/javascript）

---

## 📞 如果还是不行

请提供以下信息：

1. **Cloudflare Dashboard配置截图**
   - Settings → Builds & deployments

2. **最新的构建日志**
   - Deployments → 最新部署 → View build log

3. **浏览器控制台完整错误**
   - 按F12 → Console标签 → 截图

4. **Network标签信息**
   - 按F12 → Network标签
   - 刷新页面
   - 查看哪个文件返回了空MIME类型
   - 截图或复制文件名

---

**核心要点**: Build output directory 必须是 `h5/dist`，这是99%的问题所在！🎯
