// Cloud Firestore (the database) for customer-portal data.
// Lazily initialized off the same Firebase app used for auth.

import { getFirestore, type Firestore } from "firebase/firestore"
import { getFirebaseApp } from "@/lib/firebase"

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp())
}

export type Enquiry = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: { seconds: number; nanoseconds: number } | null
}
