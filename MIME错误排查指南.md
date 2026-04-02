# MIME类型错误排查指南

## 🐛 错误信息

```
Failed to load module script: Expected a JavaScript module script 
but the server responded with a MIME type of "". 
Strict MIME type checking is enforced for module scripts per HTML spec.
```

---

## 🔍 问题原因

这个错误通常由以下原因引起：

1. **构建输出目录配置错误** - Cloudflare找不到构建文件
2. **文件路径问题** - 资源文件路径不正确
3. **MIME类型未设置** - 服务器没有返回正确的Content-Type

---

## ✅ 解决方案

### 方案1: 检查Cloudflare Pages配置（最重要）

在Cloudflare Dashboard中检查：

**Build output directory 必须是**:
```
h5/dist
```

**不是**:
- ❌ `dist`
- ❌ `/dist`
- ❌ `./dist`
- ❌ `h5/dist/`

### 方案2: 检查Build command

**Build command 必须是**:
```
cd h5 && npm install && npm run build
```

**完整配置**:
```
Framework preset: None
Build command: cd h5 && npm install && npm run build
Build output directory: h5/dist
Root directory: (留空)
```

### 方案3: 添加配置文件（已完成）

我已经创建了：
- ✅ `h5/public/_redirects` - 路由配置
- ✅ `h5/public/_headers` - MIME类型配置
- ✅ `h5/public/_worker.js` - Workers函数

### 方案4: 清除缓存并重新部署

1. 进入Cloudflare Dashboard
2. Workers & Pages → kuaile8
3. Settings → Functions
4. 点击 **Purge build cache**
5. 回到 Deployments
6. 点击 **Retry deployment**

---

## 🔧 详细检查步骤

### 步骤1: 验证本地构建

```bash
cd h5
npm run build
```

检查 `h5/dist/` 目录是否包含：
- ✅ `index.html`
- ✅ `assets/` 目录
- ✅ `assets/*.js` 文件
- ✅ `assets/*.css` 文件
- ✅ `_redirects` 文件
- ✅ `_headers` 文件

### 步骤2: 检查Cloudflare配置

登录 https://dash.cloudflare.com

1. Workers & Pages → kuaile8
2. Settings → Builds & deployments
3. 检查配置：

```
Build configuration
├─ Build command: cd h5 && npm install && npm run build
├─ Build output directory: h5/dist
└─ Root directory: (empty)

Environment variables
└─ NODE_VERSION = 18
```

### 步骤3: 查看构建日志

1. Deployments 标签
2. 点击最新的部署
3. 查看 **Build log**
4. 确认：
   - ✅ `Success: Finished initializing build environment`
   - ✅ `added 202 packages`
   - ✅ `✓ built in XXXms`
   - ✅ `Success: Deployed to Cloudflare's global network`

### 步骤4: 检查部署的文件

在构建日志的最后，应该看到：

```
Uploading...
  ✓ index.html
  ✓ _redirects
  ✓ _headers
  ✓ assets/index-xxx.js
  ✓ assets/index-xxx.css
  ✓ assets/react-vendor-xxx.js
  ✓ assets/vendor-xxx.js
```

---

## 🎯 最可能的问题

### 问题: Build output directory 配置错误

**检查方法**:
1. Cloudflare Dashboard → kuaile8 → Settings
2. Builds & deployments
3. 查看 **Build output directory**

**正确配置**:
```
h5/dist
```

**如果配置错误，修改步骤**:
1. 点击 **Edit configuration**
2. 修改 **Build output directory** 为 `h5/dist`
3. 点击 **Save**
4. 回到 Deployments → **Retry deployment**

---

## 🔄 强制重新部署

### 方法1: 通过Dashboard

1. Deployments 标签
2. 点击最新部署
3. 点击 **Retry deployment**
4. 勾选 **Clear build cache**
5. 点击 **Retry**

### 方法2: 推送新提交

```bash
# 创建一个空提交触发重新部署
git commit --allow-empty -m "chore: 触发重新部署"
git push
```

### 方法3: 使用CLI重新部署

```bash
cd h5
npm run build
npx wrangler pages deploy dist --project-name=kuaile8
```

---

## 📋 完整配置检查清单

在Cloudflare Pages配置页面，确认以下配置：

- [ ] **Project name**: `kuaile8`
- [ ] **Production branch**: `main`
- [ ] **Framework preset**: `None`
- [ ] **Build command**: `cd h5 && npm install && npm run build`
- [ ] **Build output directory**: `h5/dist` （注意：不是 `dist`）
- [ ] **Root directory**: 留空或 `/`
- [ ] **Environment variables**: `NODE_VERSION=18`

---

## 🆘 如果还是不行

### 临时解决方案: 使用CLI部署

```bash
# 1. 本地构建
cd h5
npm install
npm run build

# 2. 使用Wrangler部署
npx wrangler pages deploy dist --project-name=kuaile8

# 3. 获得访问地址
# https://kuaile8.pages.dev
```

这样可以绕过Dashboard配置问题，直接部署构建好的文件。

---

## 💡 调试技巧

### 查看实际部署的文件

1. 访问 `https://kuaile8.pages.dev/index.html`
2. 按F12打开开发者工具
3. Network 标签
4. 刷新页面
5. 查看哪个文件返回了空的MIME类型

### 检查文件是否存在

尝试直接访问：
- `https://kuaile8.pages.dev/assets/index-xxx.js`
- `https://kuaile8.pages.dev/_redirects`
- `https://kuaile8.pages.dev/_headers`

如果返回404，说明构建输出目录配置错误。

---

## 🎯 推荐操作

**立即执行**:

1. **检查配置**
   - 进入 Cloudflare Dashboard
   - Settings → Builds & deployments
   - 确认 **Build output directory** 是 `h5/dist`

2. **清除缓存重新部署**
   - Deployments → 最新部署
   - Retry deployment
   - 勾选 Clear build cache

3. **如果还不行，使用CLI部署**
   ```bash
   cd h5
   npm run build
   npx wrangler pages deploy dist --project-name=kuaile8
   ```

---

**最关键的配置就是 Build output directory 必须是 `h5/dist`！** 🎯
