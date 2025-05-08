import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  // Añade aquí otros orígenes permitidos en producción
]

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Maneja las solicitudes preflight OPTIONS
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
    return response
  }

  const response = NextResponse.next()

  // Aplica los headers CORS para todas las demás solicitudes
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
  }

  return response
}

// Configura las rutas que deben ser manejadas por el middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/api/productos/:path*'
  ],
}