import { NextResponse } from "next/server"
import { getAdminAuth, getAdminDb, isAdminSdkConfigured } from "@/lib/firebase-admin"

export const runtime = "nodejs"

// Lets a logged-in customer permanently delete their own account.
// The client sends its Firebase ID token; we verify it server-side, delete the
// user's personal data (enquiries), then delete the auth account itself.
// (Projects & documents are business records keyed by email and are retained.)
export async function POST(req: Request) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json(
      { error: "Account deletion isn't available right now." },
      { status: 503 },
    )
  }

  const authz = req.headers.get("authorization") || ""
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : ""
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let uid: string
  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  try {
    // Delete the customer's own enquiries.
    const db = getAdminDb()
    const snap = await db.collection("enquiries").where("uid", "==", uid).get()
    if (!snap.empty) {
      const batch = db.batch()
      snap.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }

    // Delete the auth account (Admin SDK — no re-login needed).
    await getAdminAuth().deleteUser(uid)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Account deletion failed:", err)
    return NextResponse.json(
      { error: "Could not delete the account. Please try again." },
      { status: 500 },
    )
  }
}
