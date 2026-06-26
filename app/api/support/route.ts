import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminAuth, getAdminDb, isAdminSdkConfigured } from "@/lib/firebase-admin"
import { notifyOwners } from "@/lib/email"

export const runtime = "nodejs"

// Logged-in customer sends a support message. Saves it to the inbox AND emails
// the owners. Visitor identity is verified server-side via their ID token.

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
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
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Messaging isn't available right now." }, { status: 503 })
  }

  const authz = req.headers.get("authorization") || ""
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : ""
  if (!token) {
    return NextResponse.json({ error: "Please log in to send a message." }, { status: 401 })
  }

  let uid = ""
  let email = ""
  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    uid = decoded.uid
    email = decoded.email || ""
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  if (!allow(uid)) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429 },
    )
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const name = String(body.name || "").trim().slice(0, 120)
  const message = String(body.message || "").trim().slice(0, 4000)
  if (!message) {
    return NextResponse.json({ error: "Please type a message." }, { status: 400 })
  }

  try {
    await getAdminDb().collection("messages").add({
      uid,
      name,
      email,
      message,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    })
  } catch (err) {
    console.error("Save message failed:", err)
    return NextResponse.json({ error: "Couldn't send your message." }, { status: 500 })
  }

  // Email the owners (non-fatal if it fails).
  try {
    await notifyOwners({
      subject: "New support message from a customer",
      rows: [
        { label: "From", value: name || email || "Customer" },
        { label: "Email", value: email || "—" },
      ],
      body: message,
    })
  } catch (err) {
    console.error("Notify owners (support) failed:", err)
  }

  return NextResponse.json({ ok: true })
}
