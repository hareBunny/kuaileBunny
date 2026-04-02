export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 获取资源
    let response = await env.ASSETS.fetch(request);
    
    // 如果是404，返回index.html（SPA路由）
    if (response.status === 404) {
      response = await env.ASSETS.fetch(new URL('/index.html', request.url));
    }
    
    // 设置正确的MIME类型
    const headers = new Headers(response.headers);
    
    if (url.pathname.endsWith('.js')) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
    } else if (url.pathname.endsWith('.css')) {
      headers.set('Content-Type', 'text/css; charset=utf-8');
    } else if (url.pathname.endsWith('.html')) {
      headers.set('Content-Type', 'text/html; charset=utf-8');
    }
    
    // 添加安全头
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
