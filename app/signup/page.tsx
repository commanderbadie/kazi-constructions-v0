"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import {
  getFirebaseAuth,
  googleProvider,
  isFirebaseConfigured,
  friendlyAuthError,
} from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"
import {
  AuthShell,
  GoogleButton,
  Divider,
  inputClass,
  labelClass,
  primaryBtnClass,
} from "@/components/auth-shell"

export default function SignUpPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Already signed in? Send them to their account.
  useEffect(() => {
    if (!loading && user) router.replace("/account")
  }, [loading, user, router])

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!isFirebaseConfigured()) {
      setError("Sign-up isn't available yet. Please check back shortly.")
      return
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.")
      return
    }

    setBusy(true)
    try {
      const auth = getFirebaseAuth()
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() })
      }
      await sendEmailVerification(cred.user)
      router.replace("/account")
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(friendlyAuthError(code))
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    if (!isFirebaseConfigured()) {
      setError("Sign-up isn't available yet. Please check back shortly.")
      return
    }
    setBusy(true)
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider)
      router.replace("/account")
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(friendlyAuthError(code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Kazi Constructions to manage your enquiries and projects."
      footer={
        <>
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-gold hover:underline">
            Log in
          </a>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={busy} label="Sign up with Google" />

      <Divider />

      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className={primaryBtnClass}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  )
}
