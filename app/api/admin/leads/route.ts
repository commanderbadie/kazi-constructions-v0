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

export async function GET(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }
  try {
    const snap = await getAdminDb().collection("leads").get()
    const leads = snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name ?? "",
        phone: data.phone ?? "",
        location: data.location ?? "",
        source: data.source ?? "",
        createdAt: data.createdAt
          ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
          : null,
      }
    })
    leads.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    return NextResponse.json({ leads })
  } catch (err) {
    console.error("List leads failed:", err)
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 })
  }
}
