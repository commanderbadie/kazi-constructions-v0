// Server-side Firebase Admin SDK — lets the password-protected /admin panel
// read & write customer projects in Firestore without anyone signing in with a
// Google/email account. Uses a service-account key stored as a SECRET env var
// (FIREBASE_SERVICE_ACCOUNT). This runs ONLY on the server (never the browser).

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

export function isAdminSdkConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT)
}

function getAdminApp(): App {
  const existing = getApps()
  if (existing.length) return existing[0]

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set")
  }

  // The value is the full service-account JSON (downloaded from Firebase).
  const parsed = JSON.parse(raw)
  // Some hosts escape the private key's newlines — normalize just in case.
  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n")
  }

  return initializeApp({ credential: cert(parsed) })
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}
