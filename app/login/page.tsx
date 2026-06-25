"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
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

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace("/account")
  }, [loading, user, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!isFirebaseConfigured()) {
      setError("Login isn't available yet. Please check back shortly.")
      return
    }
    setBusy(true)
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
      router.replace("/account")
    } catch (err) {
      setError(friendlyAuthError((err as { code?: string }).code))
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    setNotice(null)
    if (!isFirebaseConfigured()) {
      setError("Login isn't available yet. Please check back shortly.")
      return
    }
    setBusy(true)
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider)
      router.replace("/account")
    } catch (err) {
      setError(friendlyAuthError((err as { code?: string }).code))
    } finally {
      setBusy(false)
    }
  }

  async function handleForgotPassword() {
    setError(null)
    setNotice(null)
    if (!email.trim()) {
      setError("Enter your email above first, then click 'Forgot password'.")
      return
    }
    if (!isFirebaseConfigured()) {
      setError("Password reset isn't available yet. Please check back shortly.")
      return
    }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim())
      setNotice("Password reset email sent — check your inbox.")
    } catch (err) {
      setError(friendlyAuthError((err as { code?: string }).code))
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your Kazi Constructions account."
      footer={
        <>
          New here?{" "}
          <a href="/signup" className="font-semibold text-gold hover:underline">
            Create an account
          </a>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} disabled={busy} label="Continue with Google" />

      <Divider />

      <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass + " mb-0"} htmlFor="password">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            {notice}
          </p>
        )}

        <button type="submit" disabled={busy} className={primaryBtnClass}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  )
}
