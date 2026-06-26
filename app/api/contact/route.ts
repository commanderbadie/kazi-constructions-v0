import { NextResponse } from "next/server"
import { notifyOwners } from "@/lib/email"

export const runtime = "nodejs"

// Public: emails the owners when the homepage contact form is submitted.
// (Saving to enquiry history still happens client-side for logged-in users.)

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
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

function clean(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max)
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  if (!allow(ip)) return NextResponse.json({ ok: true })

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  // Honeypot
  if (clean(body.website, 100)) return NextResponse.json({ ok: true })

  const name = clean(body.name, 120)
  const email = clean(body.email, 160)
  const phone = clean(body.phone, 40)
  const message = clean(body.message, 4000)
  if (!name || !message) return NextResponse.json({ ok: true })

  try {
    await notifyOwners({
      subject: "New consultation request from the website",
      rows: [
        { label: "Name", value: name },
        { label: "Email", value: email || "—" },
        { label: "Phone", value: phone || "—" },
      ],
      body: message,
    })
  } catch (err) {
    console.error("Notify owners (contact) failed:", err)
  }

  return NextResponse.json({ ok: true })
}
