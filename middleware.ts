import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'Parikrama_EV_Super_Secret_2026')

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Admin route protection
      if (pathname.startsWith('/dashboard/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/user', request.url))
      }
      
      // User route protection
      if (pathname.startsWith('/dashboard/user') && payload.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Auth pages protection (redirect logged in users away from login/register)
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard/user', request.url))
    } catch (err) {
      // Token invalid, let them stay on login
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
