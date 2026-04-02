export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  // 获取响应
  const response = await next();
  
  // 克隆响应以便修改headers
  const newResponse = new Response(response.body, response);
  
  // 设置正确的MIME类型
  if (url.pathname.endsWith('.js') || url.pathname.includes('/assets/') && url.pathname.includes('.js')) {
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
