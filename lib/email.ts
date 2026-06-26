// Server-side email notifications via Gmail (App Password + Nodemailer).
// Sends to the owner inboxes only. Credentials live in secret env vars and are
// never exposed to the browser. No-ops gracefully if not configured.

import nodemailer from "nodemailer"
import { ADMIN_EMAILS } from "@/lib/admin"

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

type NotifyInput = {
  subject: string
  /** Lines rendered as "Label: value" rows in the email body. */
  rows: { label: string; value: string }[]
  /** Optional longer free-text block (e.g. the customer's message). */
  body?: string
}

export async function notifyOwners(input: NotifyInput): Promise<void> {
  if (!isEmailConfigured()) return

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const rowsHtml = input.rows
    .map(
      (r) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${escapeHtml(
          r.label,
        )}</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(
          r.value,
        )}</td></tr>`,
    )
    .join("")

  const bodyHtml = input.body
    ? `<p style="margin:16px 0 0;white-space:pre-wrap;">${escapeHtml(input.body)}</p>`
    : ""

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;color:#0f172a;max-width:560px;">
      <h2 style="margin:0 0 12px;">${escapeHtml(input.subject)}</h2>
      <table style="border-collapse:collapse;">${rowsHtml}</table>
      ${bodyHtml}
      <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">
        Sent from the Kazi Constructions website.
      </p>
    </div>`

  const text = [
    input.subject,
    "",
    ...input.rows.map((r) => `${r.label}: ${r.value}`),
    ...(input.body ? ["", input.body] : []),
  ].join("\n")

  await transporter.sendMail({
    from: `"Kazi Constructions" <${process.env.GMAIL_USER}>`,
    to: ADMIN_EMAILS.join(", "),
    subject: input.subject,
    text,
    html,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
