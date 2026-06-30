import { NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase-admin"

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  const { id } = await params
  try {
    await getAdminDb().collection("leads").doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete lead failed:", err)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
}

const ALLOWED_STATUSES = new Set(["new", "verified", "contacted", "junk"])

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  const { id } = await params

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const status = String(body.status ?? "").trim()
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    await getAdminDb()
      .collection("leads")
      .doc(id)
      .update({ status, statusUpdatedAt: FieldValue.serverTimestamp() })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update lead status failed:", err)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}
