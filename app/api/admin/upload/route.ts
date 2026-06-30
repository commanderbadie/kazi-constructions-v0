import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"
import { getAdminStorage, isAdminSdkConfigured } from "@/lib/firebase-admin"

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

// Max file size: 10MB
const MAX_SIZE = 10 * 1024 * 1024

export async function POST(req: Request) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      )
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `documents/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    // Upload to Firebase Storage
    const bucket = getAdminStorage().bucket()
    const fileRef = bucket.file(fileName)

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
    })

    // Make file publicly accessible
    await fileRef.makePublic()

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    return NextResponse.json({ ok: true, url: publicUrl, fileName: file.name })
  } catch (err) {
    console.error("File upload failed:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
