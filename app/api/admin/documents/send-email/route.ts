import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"
import { sendEmail, isEmailConfigured } from "@/lib/email"

export const runtime = "nodejs"

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie") || ""
  const found = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
  return found ? decodeURIComponent(found.slice(name.length + 1)) : undefined
}

async function requireAdmin(req: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false
  return verifySessionToken(getCookie(req, SESSION_COOKIE), secret)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isEmailConfigured()) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const customerEmail = String(body.customerEmail || "").trim().toLowerCase()
  const title = String(body.title || "").trim()
  const url = String(body.url || "").trim()
  const customerName = String(body.customerName || "Customer").trim()

  if (!customerEmail || !title || !url) {
    return NextResponse.json(
      { error: "Email, title, and document URL are required." },
      { status: 400 },
    )
  }

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;background:#0f1e33;padding:32px;border-radius:16px;max-width:520px;color:#e9eef5;">
      <h1 style="margin:0 0 8px;font-size:22px;color:#ffffff;">Document shared with you</h1>
      <p style="margin:0 0 20px;line-height:1.6;color:#c7d2e0;">
        Hi ${escapeHtml(customerName)},<br><br>
        <strong>Kazi Constructions</strong> has shared a document with you:
      </p>
      <div style="background:#1a2d4d;border-radius:12px;padding:16px;margin:0 0 20px;">
        <p style="margin:0;font-size:16px;font-weight:700;color:#d4af37;">${escapeHtml(title)}</p>
      </div>
      <a href="${url}" style="display:inline-block;background:#d4af37;color:#1a1a1a;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:9999px;">
        Download / View Document
      </a>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#9fb0c3;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="color:#d4af37;word-break:break-all;">${url}</span>
      </p>
      <p style="margin:20px 0 0;font-size:12px;color:#7c8ba0;">
        — Kazi Constructions<br>
        Architects · Engineers · Consultants
      </p>
    </div>`

  const text = [
    `Document shared with you`,
    ``,
    `Hi ${customerName},`,
    ``,
    `Kazi Constructions has shared a document with you:`,
    `${title}`,
    ``,
    `Download / View: ${url}`,
    ``,
    `— Kazi Constructions`,
  ].join("\n")

  try {
    await sendEmail({
      to: customerEmail,
      subject: `Kazi Constructions — ${title}`,
      html,
      text,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Send document email failed:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
