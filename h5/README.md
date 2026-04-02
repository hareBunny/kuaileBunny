# 快乐8百宝箱 H5

基于 React + TypeScript + Vite 的移动端 H5 应用

## 功能特性

### 免费功能
- 最新开奖查询
- 历史数据查看（近7天）
- 基础统计分析

### 会员功能
- 高级数据分析
- AI智能预测
- 走势图表
- 数据导出

## 技术栈

- React 19
- TypeScript
- Vite 8
- React Router DOM
- Zustand（状态管理）
- Axios（HTTP 客户端）

## 快速开始

### 安装依赖

```bash
cd h5
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
h5/
├── public/              # 静态资源
├── src/
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx    # 首页（专区列表）
│   │   ├── Kuaile8.tsx # 快乐8工具页
│   │   ├── Latest.tsx  # 最新开奖
│   │   ├── History.tsx # 历史数据
│   │   ├── BasicStats.tsx # 基础统计
│   │   ├── Profile.tsx # 个人中心
│   │   └── Membership.tsx # 会员开通
│   ├── App.tsx         # 根组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── index.html
├── vite.config.ts
└── package.json
```

## 部署方案

### 1. Vercel 部署（推荐）

```bash
npm install -g vercel
vercel
```

### 2. Nginx 部署

```bash
npm run build
# 将 dist 目录上传到服务器
```

Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 静态托管

可部署到：
- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## API 接口

后端接口地址配置在 `vite.config.ts` 的 proxy 中：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

生产环境需要修改为实际的后端地址。

## 移动端适配

- 使用 viewport 禁止缩放
- 响应式布局
- 触摸优化
- 适配 iOS 和 Android

## 浏览器支持

- iOS Safari 12+
- Android Chrome 80+
- 微信内置浏览器

## 许可证

MIT
