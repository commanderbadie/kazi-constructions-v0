import type { User } from "firebase/auth"

// The owner/admin account. Authorized by the site owner. This identifies who
// can create and manage customer projects. Real enforcement lives in the
// Firestore security rules (server-side); this client check only controls
// which UI is shown.
export const ADMIN_EMAIL = "badieuddinkazi@gmail.com"

export function isAdminUser(user: User | null | undefined): boolean {
  return Boolean(
    user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
  )
}
