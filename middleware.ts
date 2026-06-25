import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  SESSION_COOKIE,
  ACCESS_COOKIE,
  verifySessionToken,
  verifyPassword,
} from "@/lib/auth"

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}

// How long the secret access key is remembered after it's supplied once.
const ACCESS_COOKIE_MAX_AGE = 60 * 30 // 30 minutes — plenty of time to sign in

// Renders the standard 404 page (with a real 404 status) so the admin area
// looks like it simply doesn't exist to anyone without the secret link.
function notFound(req: NextRequest) {
  return NextResponse.rewrite(new URL("/_kazi_not_found", req.url))
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // --- Is this request already logged in? ---
  const sessionSecret = process.env.ADMIN_SESSION_SECRET
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const authed = sessionSecret
    ? await verifySessionToken(token, sessionSecret)
    : false

  // --- Does this request carry the secret access key? ---
  // The key "reveals the door". If ADMIN_ACCESS_KEY isn't configured we fall
  // back to non-stealth behavior so a misconfiguration can't lock the owner
  // out (the password is still required either way).
  const accessKey = process.env.ADMIN_ACCESS_KEY
  const keyInUrl = searchParams.get("key")
  const providedKey = keyInUrl || req.cookies.get(ACCESS_COOKIE)?.value || ""
  const keyOk = accessKey ? await verifyPassword(providedKey, accessKey) : true

  // Persist the key in an httpOnly cookie when it first arrives via ?key=...,
  // so it survives navigation and the login POST/redirect flow.
  function withAccessCookie(res: NextResponse) {
    if (accessKey && keyInUrl && keyOk) {
      res.cookies.set(ACCESS_COOKIE, providedKey, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_COOKIE_MAX_AGE,
      })
    }
    return res
  }

  // --- The login screen ---
  if (pathname === "/admin/login") {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    if (!keyOk) {
      return notFound(req)
    }
    // Strip ?key=... from the address bar once it's captured in the cookie.
    if (keyInUrl) {
      const clean = req.nextUrl.clone()
      clean.searchParams.delete("key")
      return withAccessCookie(NextResponse.redirect(clean))
    }
    return NextResponse.next()
  }

  // --- The admin app and any subpaths ---
  if (authed) {
    return NextResponse.next()
  }

  if (!keyOk) {
    // No valid session and no secret key → pretend the page doesn't exist.
    return notFound(req)
  }

  // Has the secret but isn't signed in yet → send to the login screen.
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = "/admin/login"
  loginUrl.search = ""
  const res = NextResponse.redirect(loginUrl)
  if (token) {
    // Clear any stale/invalid session cookie.
    res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 })
  }
  return withAccessCookie(res)
}
