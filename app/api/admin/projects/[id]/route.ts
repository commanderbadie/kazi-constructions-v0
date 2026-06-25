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

// Update a project: status / progress, or append an update note.
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
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (typeof body.status === "string") update.status = body.status
  if (body.progress !== undefined) update.progress = Number(body.progress) || 0

  const note = typeof body.note === "string" ? body.note.trim() : ""
  if (note) {
    update.updates = FieldValue.arrayUnion({
      text: note,
      at: new Date().toISOString(),
    })
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  try {
    await getAdminDb().collection("projects").doc(id).update(update)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Update project failed:", err)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// Delete a project.
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
    await getAdminDb().collection("projects").doc(id).delete()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Delete project failed:", err)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
