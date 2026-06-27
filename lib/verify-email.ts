import { sendEmailVerification, type User } from "firebase/auth"

// Sends the verification email via our business Gmail (better inbox delivery).
// Falls back to Firebase's built-in sender if our endpoint isn't available
// (e.g. Gmail/Admin not configured), so a verification email is always sent.
export async function sendVerification(user: User): Promise<void> {
  try {
    const token = await user.getIdToken()
    const res = await fetch("/api/auth/send-verification", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) return
    throw new Error("fallback")
  } catch {
    // Fallback: Firebase's default sender.
    await sendEmailVerification(user)
  }
}
