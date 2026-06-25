"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sendEmailVerification } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirebaseAuth } from "@/lib/firebase"
import { getDb, type Enquiry } from "@/lib/firestore"
import { useAuth } from "@/components/auth-provider"
import { BrandLogo } from "@/components/brand-logo"

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, configured, signOut, refresh } = useAuth()
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [enquiriesLoading, setEnquiriesLoading] = useState(true)

  // Not logged in → send to login.
  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/login")
    }
  }, [loading, configured, user, router])

  // Load this customer's enquiry history.
  useEffect(() => {
    if (!user || !configured) return
    let active = true
    ;(async () => {
      setEnquiriesLoading(true)
      try {
        const q = query(
          collection(getDb(), "enquiries"),
          where("uid", "==", user.uid),
        )
        const snap = await getDocs(q)
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<Enquiry, "id">) }),
        )
        // Sort newest first (client-side, so no Firestore index needed).
        list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        if (active) setEnquiries(list)
      } catch (err) {
        console.error("Could not load enquiries:", err)
      } finally {
        if (active) setEnquiriesLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [user, configured])

  function formatDate(ts: Enquiry["createdAt"]): string {
    if (!ts) return "Just now"
    return new Date(ts.seconds * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  async function handleResend() {
    if (!user) return
    setBusy(true)
    setNotice(null)
    try {
      await sendEmailVerification(getFirebaseAuth().currentUser ?? user)
      setNotice("Verification email sent — check your inbox (and spam folder).")
    } catch {
      setNotice("Couldn't send right now. Please wait a minute and try again.")
    } finally {
      setBusy(false)
    }
  }

  async function handleRefresh() {
    setBusy(true)
    setNotice(null)
    await refresh()
    setBusy(false)
  }

  async function handleLogout() {
    await signOut()
    router.replace("/")
  }

  // Loading / redirecting state.
  if (loading || !configured || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-accent text-accent-foreground/70">
        {configured ? "Loading…" : "Account area is being set up…"}
      </main>
    )
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "there"
  const needsVerification = !user.emailVerified

  return (
    <main className="min-h-screen bg-accent">
      {/* Top bar */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="/" aria-label="Kazi Constructions home">
            <BrandLogo inverted />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-accent-foreground/80 transition-colors hover:border-gold hover:text-gold"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-gold">
          My Account
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-accent-foreground sm:text-4xl">
          Welcome, {displayName} 👋
        </h1>

        {/* Email verification gate */}
        {needsVerification && (
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/10 p-6">
            <h2 className="font-heading text-lg font-bold text-accent-foreground">
              Please verify your email
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-accent-foreground/80">
              We sent a verification link to{" "}
              <span className="font-semibold text-gold">{user.email}</span>. Click
              it to unlock your full account. Once done, hit{" "}
              <span className="font-semibold">"I've verified"</span> below.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={busy}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                Resend email
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={busy}
                className="rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-accent-foreground/80 transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
              >
                I've verified — refresh
              </button>
            </div>
          </div>
        )}

        {notice && (
          <p className="mt-4 rounded-lg bg-primary/15 px-4 py-2.5 text-sm text-accent-foreground">
            {notice}
          </p>
        )}

        {/* Account details */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/50">
              Name
            </p>
            <p className="mt-1 text-lg font-semibold text-accent-foreground">
              {user.displayName || "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/50">
              Email
            </p>
            <p className="mt-1 break-all text-lg font-semibold text-accent-foreground">
              {user.email}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user.emailVerified
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {user.emailVerified ? "Verified" : "Not verified"}
            </span>
          </div>
        </div>

        {/* Enquiry history */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-lg font-bold text-accent-foreground">
            Your enquiries
          </h2>

          {enquiriesLoading ? (
            <p className="mt-3 text-sm text-accent-foreground/60">Loading…</p>
          ) : enquiries.length === 0 ? (
            <div className="mt-3">
              <p className="text-sm leading-relaxed text-accent-foreground/70">
                You haven't sent any enquiries yet. When you submit the contact
                form while logged in, it'll show up here.
              </p>
              <a
                href="/#contact"
                className="mt-4 inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold/90"
              >
                Send your first enquiry
              </a>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {enquiries.map((enq) => (
                <li
                  key={enq.id}
                  className="rounded-xl border border-white/10 bg-accent/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Enquiry
                    </span>
                    <span className="text-xs text-accent-foreground/50">
                      {formatDate(enq.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-accent-foreground/85">
                    {enq.message}
                  </p>
                  {enq.phone && (
                    <p className="mt-2 text-xs text-accent-foreground/50">
                      Contact: {enq.phone}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coming soon: project tracking & documents */}
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-transparent p-6">
          <h2 className="font-heading text-lg font-bold text-accent-foreground">
            Project tracking & documents
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-accent-foreground/60">
            Soon you'll be able to track your project's progress and download
            quotes & documents shared by our team. Coming next!
          </p>
        </div>
      </div>
    </main>
  )
}
