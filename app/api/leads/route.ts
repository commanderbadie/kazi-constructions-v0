import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase-admin"
import { notifyOwners } from "@/lib/email"
import { validateIndianMobile } from "@/lib/phone"

export const runtime = "nodejs"

// Public endpoint (used by the lead popup). Visitors aren't logged in, so this
// writes server-side via the Admin SDK — the `leads` collection is never
// exposed to the client. Includes a honeypot + a light per-IP rate limit.
//
// It also handles two follow-up actions keyed by the lead's short ref code:
//   - action: "qualify"          → attach budget / timeline / plot answers
//   - action: "whatsapp_clicked" → flag that the visitor opened WhatsApp
// These let us enrich a lead AFTER it's first created, without losing it.

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

/** Find a single lead document by its short ref code. */
async function findLeadByRef(ref: string) {
  const snap = await getAdminDb()
    .collection("leads")
    .where("ref", "==", ref)
    .limit(1)
    .get()
  return snap.empty ? null : snap.docs[0]
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

  const action = clean(body.action, 30)

  // ---- Follow-up actions (enrich an existing lead by ref) -----------------
  if (action === "qualify" || action === "whatsapp_clicked") {
    const ref = clean(body.ref, 20)
    if (!ref || !isAdminSdkConfigured()) {
      return NextResponse.json({ ok: true })
    }
    try {
      const doc = await findLeadByRef(ref)
      if (!doc) return NextResponse.json({ ok: true })

      if (action === "whatsapp_clicked") {
        await doc.ref.update({
          whatsappClicked: true,
          whatsappClickedAt: FieldValue.serverTimestamp(),
        })
        return NextResponse.json({ ok: true })
      }

      // action === "qualify"
      const timeline = clean(body.timeline, 40)
      const budget = clean(body.budget, 40)
      const registered = clean(body.registered, 20)
      await doc.ref.update({
        timeline,
        budget,
        registered,
        qualified: true,
        qualifiedAt: FieldValue.serverTimestamp(),
      })

      // Let the owners know the lead added their details (non-fatal).
      try {
        const data = doc.data()
        await notifyOwners({
          subject: `Lead ${ref} added project details`,
          rows: [
            { label: "Name", value: data.name || "—" },
            { label: "Phone", value: data.phone || "—" },
            { label: "Timeline", value: timeline || "—" },
            { label: "Budget", value: budget || "—" },
            { label: "Plot registered", value: registered || "—" },
            { label: "Ref", value: ref },
          ],
        })
      } catch (err) {
        console.error("Notify owners (qualify) failed:", err)
      }
      return NextResponse.json({ ok: true })
    } catch (err) {
      console.error("Lead update failed:", err)
      return NextResponse.json({ ok: true })
    }
  }

  // ---- Create a new lead --------------------------------------------------

  // Honeypot: real users never fill this hidden field; bots do.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true })
  }

  const name = clean(body.name, 120)
  const rawPhone = clean(body.phone, 40)
  const location = clean(body.location, 200)
  const ref = clean(body.ref, 20)

  if (!name || !rawPhone) {
    return NextResponse.json({ ok: true })
  }

  // Server-side junk/format guard (defense in depth alongside the client).
  const phoneCheck = validateIndianMobile(rawPhone)
  if (!phoneCheck.ok) {
    // Looks fake — silently succeed without saving so bots get no signal.
    return NextResponse.json({ ok: true })
  }
  const phone = phoneCheck.phone

  // If the server key isn't set yet, don't error the visitor — just skip saving.
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ ok: true })
  }

  // Rate limit: 1 lead per phone number per 15 minutes
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000)
    const existing = await getAdminDb()
      .collection("leads")
      .where("phone", "==", phone)
      .where("createdAt", ">=", fifteenMinsAgo)
      .limit(1)
      .get()

    if (!existing.empty) {
      // Already submitted within 15 minutes — silently succeed
      return NextResponse.json({ ok: true })
    }
  } catch (err) {
    // If the check fails, still allow the lead through (don't block the visitor)
    console.error("Lead duplicate check failed:", err)
  }

  try {
    await getAdminDb()
      .collection("leads")
      .add({
        name,
        phone,
        location,
        ref: ref || null,
        status: "new",
        whatsappClicked: false,
        qualified: false,
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
        { label: "Ref", value: ref || "—" },
      ],
    })
  } catch (err) {
    console.error("Notify owners (lead) failed:", err)
  }

  return NextResponse.json({ ok: true })
}
