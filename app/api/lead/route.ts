import { NextResponse } from "next/server"

export const runtime = "nodejs"

type LeadPayload = {
  name?: string
  phone?: string
  email?: string
  location?: string
  message?: string
  source?: string
}

export async function POST(request: Request) {
  let data: LeadPayload

  try {
    data = (await request.json()) as LeadPayload
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    )
  }

  const { name, phone, email, location, message, source } = data

  // Name + at least one way to reach them is required.
  if (!name || (!phone && !email)) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    )
  }

  const sourceLabel =
    source === "popup"
      ? "Lead popup"
      : source === "consultation"
        ? "Consultation form"
        : "Website"

  const lines = [
    `New enquiry from the Kazi Constructions website`,
    `Source: ${sourceLabel}`,
    "",
    `Name: ${name}`,
    phone ? `Phone: ${phone}` : null,
    email ? `Email: ${email}` : null,
    location ? `Plot location: ${location}` : null,
    message ? `Message: ${message}` : null,
    "",
    `Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
  ].filter(Boolean) as string[]

  const text = lines.join("\n")

  // Fallback: always log so leads are recoverable from Vercel function logs
  // even before email delivery is configured.
  console.log("[lead]\n" + text)

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.LEAD_TO_EMAIL || "kaziwaheeduddinsiddiqi@gmail.com"
  const fromEmail =
    process.env.LEAD_FROM_EMAIL || "Kazi Constructions <onboarding@resend.dev>"

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email || undefined,
          subject: `New website lead: ${name}${location ? ` (${location})` : ""}`,
          text,
        }),
      })

      if (!res.ok) {
        const detail = await res.text()
        console.error("[lead] email delivery failed", res.status, detail)
        return NextResponse.json(
          { ok: false, error: "Could not send right now" },
          { status: 502 },
        )
      }
    } catch (err) {
      console.error("[lead] email delivery error", err)
      return NextResponse.json(
        { ok: false, error: "Could not send right now" },
        { status: 502 },
      )
    }
  }

  return NextResponse.json({ ok: true })
}
