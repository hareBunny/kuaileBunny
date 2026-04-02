export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // 如果是API请求，代理到Workers后端
  if (url.pathname.startsWith('/api/')) {
    // 后端Workers地址
    const backendUrl = 'https://kuaile8-backend.2268043137.workers.dev';
    
    // 构建新的URL（保留完整路径，因为后端也有/api前缀）
    const targetUrl = `${backendUrl}${url.pathname}${url.search}`;
    
    console.log('Proxying API request:', url.pathname, '→', targetUrl);
    
    // 创建新的请求
    const apiRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });
    
    try {
      // 转发请求到后端
      const response = await fetch(apiRequest);
      
      // 创建新响应并添加CORS头
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      return newResponse;
    } catch (error) {
      console.error('API proxy error:', error);
      return new Response(JSON.stringify({ error: 'API请求失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // 非API请求，正常处理
  const response = await next();
  const newResponse = new Response(response.body, response);
  
  // 设置正确的MIME类型
  if (url.pathname.endsWith('.js') || (url.pathname.includes('/assets/') && url.pathname.includes('.js'))) {
    newResponse.headers.set('Content-Type', 'application/javascript; charset=utf-8');
  } else if (url.pathname.endsWith('.css')) {
    newResponse.headers.set('Content-Type', 'text/css; charset=utf-8');
  } else if (url.pathname.endsWith('.html') || url.pathname === '/') {
    newResponse.headers.set('Content-Type', 'text/html; charset=utf-8');
  }
  
  // 添加安全头
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  
  return newResponse;
}
