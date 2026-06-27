// Server-side email via Gmail (App Password + Nodemailer).
// Credentials live in secret env vars and are never exposed to the browser.

import nodemailer from "nodemailer"
import { ADMIN_EMAILS } from "@/lib/admin"

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

/** Low-level send to any recipient(s). Throws if email isn't configured. */
export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
  text: string
}): Promise<void> {
  if (!isEmailConfigured()) throw new Error("Email not configured")
  await transporter().sendMail({
    from: `"Kazi Constructions" <${process.env.GMAIL_USER}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  })
}

type NotifyInput = {
  subject: string
  rows: { label: string; value: string }[]
  body?: string
}

/** Notify the owner inboxes. No-ops if email isn't configured. */
export async function notifyOwners(input: NotifyInput): Promise<void> {
  if (!isEmailConfigured()) return

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

  await sendEmail({ to: ADMIN_EMAILS.join(", "), subject: input.subject, html, text })
}

/** Branded HTML for the email-verification message. */
export function verificationEmailHtml(link: string): string {
  return `
    <div style="font-family:system-ui,Arial,sans-serif;background:#0f1e33;padding:32px;border-radius:16px;max-width:520px;color:#e9eef5;">
      <h1 style="margin:0 0 8px;font-size:22px;color:#ffffff;">Verify your email</h1>
      <p style="margin:0 0 20px;line-height:1.6;color:#c7d2e0;">
        Thanks for creating an account with <strong>Kazi Constructions</strong>.
        Please confirm your email address to activate your account.
      </p>
      <a href="${link}" style="display:inline-block;background:#d4af37;color:#1a1a1a;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:9999px;">
        Verify my email
      </a>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#9fb0c3;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="color:#d4af37;word-break:break-all;">${link}</span>
      </p>
      <p style="margin:20px 0 0;font-size:12px;color:#7c8ba0;">
        If you didn't create this account, you can safely ignore this email.
      </p>
    </div>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
