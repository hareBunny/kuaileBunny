export interface JWTPayload {
  id: string
  phone: string
  membershipType: string
  exp?: number
}

export async function signToken(payload: Omit<JWTPayload, 'exp'>, secret: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const jwtPayload = {
    ...payload,
    exp: now + 7 * 24 * 60 * 60 // 7天过期
  }
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))
  
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret)
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const [encodedHeader, encodedPayload, signature] = parts
    
    // 验证签名
    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, secret)
    if (signature !== expectedSignature) {
      return null
    }
    
    // 解析 payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload
    
    // 检查过期时间
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload
  } catch (error) {
    return null
  }
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )
  
  return base64UrlEncode(signature)
}

function base64UrlEncode(data: string | ArrayBuffer): string {
  let base64: string
  
  if (typeof data === 'string') {
    base64 = btoa(data)
  } else {
    const bytes = new Uint8Array(data)
    const binary = String.fromCharCode(...bytes)
    base64 = btoa(binary)
  }
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64UrlDecode(data: string): string {
  let base64 = data
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  while (base64.length % 4) {
    base64 += '='
  }
  
  return atob(base64)
}
