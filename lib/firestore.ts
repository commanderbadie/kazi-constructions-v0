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

export type ProjectUpdate = { text: string; at: string }

export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
] as const

export type Project = {
  id: string
  customerEmail: string
  title: string
  status: string
  progress: number
  updates: ProjectUpdate[]
  createdAt: { seconds: number; nanoseconds: number } | null
}
