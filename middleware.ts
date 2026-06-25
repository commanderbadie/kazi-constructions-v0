import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

// Protect the admin area. The login page and the auth API are intentionally
// left open so users can actually sign in.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow the login screen itself through.
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const secret = process.env.ADMIN_SESSION_SECRET
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const valid = secret ? await verifySessionToken(token, secret) : false

  if (!valid) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = ""
    if (pathname !== "/admin") {
      url.searchParams.set("from", pathname)
    }
    const res = NextResponse.redirect(url)
    // If a stale/invalid cookie exists, clear it.
    if (token) {
      res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
    }
    return res
  }

  return NextResponse.next()
}
