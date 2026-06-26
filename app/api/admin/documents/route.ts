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

function normalizeUrl(url: string): string {
  const t = url.trim()
  if (!t) return ""
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  try {
    const snap = await getAdminDb().collection("documents").get()
    const documents = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        customerEmail: data.customerEmail ?? "",
        title: data.title ?? "",
        url: data.url ?? "",
        createdAt: data.createdAt
          ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
          : null,
      }
    })
    documents.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    return NextResponse.json({ documents })
  } catch (err) {
    console.error("List documents failed:", err)
    return NextResponse.json({ error: "Failed to load documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const customerEmail = String(body.customerEmail || "").trim().toLowerCase()
  const title = String(body.title || "").trim()
  const url = normalizeUrl(String(body.url || ""))
  if (!customerEmail || !title || !url) {
    return NextResponse.json(
      { error: "Customer email, title, and link are required." },
      { status: 400 },
    )
  }

  try {
    const ref = await getAdminDb().collection("documents").add({
      customerEmail,
      title,
      url,
      createdAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true, id: ref.id })
  } catch (err) {
    console.error("Create document failed:", err)
    return NextResponse.json({ error: "Failed to add document" }, { status: 500 })
  }
}
