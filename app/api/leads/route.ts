import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase-admin"
import { notifyOwners } from "@/lib/email"

export const runtime = "nodejs"

// Public endpoint (used by the lead popup). Visitors aren't logged in, so this
// writes server-side via the Admin SDK — the `leads` collection is never
// exposed to the client. Includes a honeypot + a light per-IP rate limit.

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 6
const hits = new Map<string, { count: number; resetAt: number }>()

function allow(ip: string): boolean {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  rec.count += 1
  return rec.count <= MAX_PER_WINDOW
}

function clean(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max)
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (!allow(ip)) {
    // Quietly succeed so the UI still shows its thank-you; just don't save.
    return NextResponse.json({ ok: true })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  // Honeypot: real users never fill this hidden field; bots do.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const phone = clean(body.phone, 40)
  const location = clean(body.location, 200)

  if (!name || !phone) {
    return NextResponse.json({ ok: true })
  }

  // If the server key isn't set yet, don't error the visitor — just skip saving.
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ ok: true })
  }

  // Rate limit: 1 lead per phone number per 12 hours
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)
    const existing = await getAdminDb()
      .collection("leads")
      .where("phone", "==", phone)
      .where("createdAt", ">=", twelveHoursAgo)
      .limit(1)
      .get()

    if (!existing.empty) {
      // Already submitted within 12 hours — silently succeed
      return NextResponse.json({ ok: true })
    }
  } catch (err) {
    // If the check fails, still allow the lead through (don't block the visitor)
    console.error("Lead duplicate check failed:", err)
  }

  try {
    await getAdminDb().collection("leads").add({
      name,
      phone,
      location,
      source: "popup",
      createdAt: FieldValue.serverTimestamp(),
    })
  } catch (err) {
    console.error("Save lead failed:", err)
    // Still return ok so the visitor sees the thank-you.
  }

  // Email the owners about the new lead (non-fatal).
  try {
    await notifyOwners({
      subject: "New lead from the website popup",
      rows: [
        { label: "Name", value: name },
        { label: "Phone", value: phone },
        { label: "Location", value: location || "—" },
      ],
    })
  } catch (err) {
    console.error("Notify owners (lead) failed:", err)
  }

  return NextResponse.json({ ok: true })
}
