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

// Only allow requests carrying a valid /admin-panel session cookie.
async function requireAdmin(req: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false
  return verifySessionToken(getCookie(req, SESSION_COOKIE), secret)
}

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "Project management isn't configured yet. Set the FIREBASE_SERVICE_ACCOUNT environment variable.",
    },
    { status: 503 },
  )
}

// List all projects (admin only).
export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) return notConfigured()

  try {
    const snap = await getAdminDb().collection("projects").get()
    const projects = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        customerEmail: data.customerEmail ?? "",
        title: data.title ?? "",
        status: data.status ?? "Planning",
        progress: data.progress ?? 0,
        updates: data.updates ?? [],
        createdAt: data.createdAt
          ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
          : null,
      }
    })
    projects.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    return NextResponse.json({ projects })
  } catch (err) {
    console.error("List projects failed:", err)
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 })
  }
}

// Create a project (admin only).
export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) return notConfigured()

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const customerEmail = String(body.customerEmail || "").trim().toLowerCase()
  const title = String(body.title || "").trim()
  if (!customerEmail || !title) {
    return NextResponse.json(
      { error: "Customer email and title are required." },
      { status: 400 },
    )
  }

  const note = String(body.note || "").trim()
  try {
    const ref = await getAdminDb().collection("projects").add({
      customerEmail,
      title,
      status: String(body.status || "Planning"),
      progress: Number(body.progress) || 0,
      updates: note ? [{ text: note, at: new Date().toISOString() }] : [],
      createdAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true, id: ref.id })
  } catch (err) {
    console.error("Create project failed:", err)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
