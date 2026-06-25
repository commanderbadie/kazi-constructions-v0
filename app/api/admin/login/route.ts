import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth"

// Run on the Node.js runtime so we have a stable place for the (best-effort)
// in-memory rate limiter and access to env vars.
export const runtime = "nodejs"

// Lightweight per-IP throttle. Note: serverless instances are ephemeral, so
// this is a basic speed bump, not a distributed limiter. For stronger limits,
// back this with Vercel KV / Upstash (free tier).
const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 5
const attempts = new Map<string, { count: number; resetAt: number }>()

function allow(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  rec.count += 1
  return rec.count <= MAX_ATTEMPTS
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (!allow(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 },
    )
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!adminPassword || !secret) {
    return NextResponse.json(
      {
        error:
          "Server is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET environment variables.",
      },
      { status: 500 },
    )
  }

  let password = ""
  try {
    const body = await req.json()
    if (typeof body?.password === "string") password = body.password
  } catch {
    // ignore malformed body — treated as empty password below
  }

  const ok = await verifyPassword(password, adminPassword)

  // Small constant delay to blunt rapid brute-forcing.
  await new Promise((r) => setTimeout(r, 300))

  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }

  // Success — reset this IP's counter and issue a session cookie.
  attempts.delete(ip)

  const token = await createSessionToken(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
  return res
}
