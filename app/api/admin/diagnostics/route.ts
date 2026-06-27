import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"
import { isEmailConfigured } from "@/lib/email"

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

// Reports exactly which backend pieces are working, so we can pinpoint issues.
export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const out: Record<string, unknown> = {
    serviceAccountPresent: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
    gmailConfigured: isEmailConfigured(),
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      out.serviceAccountParses = true
      out.projectId = parsed.project_id ?? null
      out.hasPrivateKey = Boolean(parsed.private_key)
      out.hasClientEmail = Boolean(parsed.client_email)
    } catch (e) {
      out.serviceAccountParses = false
      out.parseError = e instanceof Error ? e.message : String(e)
    }

    // Try to actually use the Admin SDK against Firestore.
    if (out.serviceAccountParses) {
      try {
        const { getAdminDb } = await import("@/lib/firebase-admin")
        await getAdminDb().collection("_diagnostics").limit(1).get()
        out.firestoreConnect = "ok"
      } catch (e) {
        out.firestoreConnect = "error"
        out.firestoreError = e instanceof Error ? e.message : String(e)
      }
    }
  }

  // Try sending a test email to the owners (only if configured).
  if (out.gmailConfigured) {
    try {
      const { notifyOwners } = await import("@/lib/email")
      await notifyOwners({
        subject: "Kazi website — email test ✅",
        rows: [{ label: "Status", value: "If you got this, email sending works." }],
      })
      out.emailSend = "ok (test email sent to owners)"
    } catch (e) {
      out.emailSend = "error"
      out.emailError = e instanceof Error ? e.message : String(e)
    }
  }

  return NextResponse.json(out)
}
