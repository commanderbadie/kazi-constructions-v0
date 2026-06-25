// Firebase client initialization for customer authentication.
//
// All values come from NEXT_PUBLIC_FIREBASE_* environment variables. Firebase
// web config is *public by design* (it's safe to expose in the browser) — real
// protection comes from Firebase's Authorized Domains + security rules.
//
// Initialization is lazy (only runs when first called) so nothing executes
// during the server-side prerender/build.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/** True when the required Firebase env vars are present. */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp())
}

export const googleProvider = new GoogleAuthProvider()

/**
 * Turns Firebase's error codes into friendly, human-readable messages.
 */
export function friendlyAuthError(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right."
    case "auth/missing-password":
      return "Please enter your password."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead."
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password."
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again."
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before finishing."
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Please allow popups and retry."
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with a different sign-in method."
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again."
    case "auth/configuration-not-found":
    case "auth/invalid-api-key":
      return "Sign-in isn't configured yet. Please try again shortly."
    default:
      return "Something went wrong. Please try again."
  }
}
