import { NextResponse } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

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

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Blob storage not configured" }, { status: 503 })
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

    const fileName = `documents/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    // Upload to Vercel Blob via REST API
    const uploadRes = await fetch(
      `https://blob.vercel-storage.com/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-content-type": file.type || "application/octet-stream",
          "x-cache-control-max-age": "31536000",
        },
        body: file,
      },
    )

    if (!uploadRes.ok) {
      const err = await uploadRes.text().catch(() => "Unknown error")
      console.error("Blob upload failed:", err)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const blob = await uploadRes.json()

    return NextResponse.json({ ok: true, url: blob.url, fileName: file.name })
  } catch (err) {
    console.error("File upload failed:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
