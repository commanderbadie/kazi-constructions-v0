import { NextResponse } from "next/server"
import { getAdminAuth, isAdminSdkConfigured } from "@/lib/firebase-admin"
import { isEmailConfigured, sendEmail, verificationEmailHtml } from "@/lib/email"

export const runtime = "nodejs"

// Sends the email-verification link via the business Gmail (better inbox
// delivery than Firebase's default sender). The client passes its freshly
// issued ID token; we verify it, generate the official Firebase link for that
// account, and email it.

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3
const hits = new Map<string, { count: number; resetAt: number }>()
function allow(key: string): boolean {
  const now = Date.now()
  const rec = hits.get(key)
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  rec.count += 1
  return rec.count <= MAX_PER_WINDOW
}

export async function POST(req: Request) {
  // If either piece isn't set up, signal the client to fall back to Firebase's
  // built-in sender.
  if (!isAdminSdkConfigured() || !isEmailConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  const authz = req.headers.get("authorization") || ""
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : ""
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let email = ""
  let verified = false
  let uid = ""
  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    email = decoded.email || ""
    verified = decoded.email_verified === true
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  if (!email) {
    return NextResponse.json({ error: "No email on account" }, { status: 400 })
  }
  if (verified) {
    return NextResponse.json({ ok: true, alreadyVerified: true })
  }
  if (!allow(uid)) {
    return NextResponse.json(
      { error: "Please wait a moment before requesting another email." },
      { status: 429 },
    )
  }

  try {
    const link = await getAdminAuth().generateEmailVerificationLink(email)
    await sendEmail({
      to: email,
      subject: "Verify your email — Kazi Constructions",
      html: verificationEmailHtml(link),
      text: `Verify your email for Kazi Constructions: ${link}`,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Send verification email failed:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
