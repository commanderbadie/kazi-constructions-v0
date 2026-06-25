"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth"
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase"

type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  signOut: async () => {},
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isFirebaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [configured])

  // Re-pull the latest user record (e.g. after the user verifies their email).
  async function refresh() {
    if (!configured) return
    const auth = getFirebaseAuth()
    if (auth.currentUser) {
      await auth.currentUser.reload()
      setUser({ ...auth.currentUser } as User)
    }
  }

  async function signOut() {
    if (!configured) return
    await fbSignOut(getFirebaseAuth())
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
