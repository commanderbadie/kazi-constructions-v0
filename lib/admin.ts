import type { User } from "firebase/auth"

// Owner/admin accounts. Anyone logged in with one of these (verified) emails
// can manage customer projects, documents, and see leads. Real enforcement
// lives in the Firestore security rules (server-side); this client check only
// controls which UI is shown. Authorized by the site owner.
export const ADMIN_EMAILS = [
  "badieuddinkazi@gmail.com",
  "kaziwaheeduddinsiddiqi@gmail.com",
]

export function isAdminUser(user: User | null | undefined): boolean {
  const email = user?.email?.toLowerCase()
  return Boolean(email && ADMIN_EMAILS.includes(email))
}
