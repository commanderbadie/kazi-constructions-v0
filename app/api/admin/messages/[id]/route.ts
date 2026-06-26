import { NextResponse } from "next/server"
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

// Mark a message read/unread.
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
    body = {}
  }
  try {
    await getAdminDb()
      .collection("messages")
      .doc(id)
      .update({ read: body.read !== false })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update message failed:", err)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
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
    await getAdminDb().collection("messages").doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete message failed:", err)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
