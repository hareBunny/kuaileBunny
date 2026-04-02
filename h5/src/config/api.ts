// API 配置
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export default API_BASE_URL

// 开发环境：通过 Vite 代理到 http://localhost:8787
// 生产环境：设置环境变量 VITE_API_URL=https://your-domain.com

