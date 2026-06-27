"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, query, where } from "firebase/firestore"
import { getFirebaseAuth } from "@/lib/firebase"
import { sendVerification } from "@/lib/verify-email"
import { getDb, type Enquiry } from "@/lib/firestore"
import { isAdminUser } from "@/lib/admin"
import { useAuth } from "@/components/auth-provider"
import { useSiteContent } from "@/lib/use-site-content"
import { BrandLogo } from "@/components/brand-logo"
import { AccountProjects } from "@/components/account-projects"
import { AccountDocuments } from "@/components/account-documents"
import { AdminProjects } from "@/components/admin-projects"
import { AdminDocuments } from "@/components/admin-documents"

export default function AccountPage() {
  const router = useRouter()
  const { user, loading, configured, signOut, refresh } = useAuth()
  const { contact } = useSiteContent()
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [enquiriesLoading, setEnquiriesLoading] = useState(true)
  const [supportMsg, setSupportMsg] = useState("")
  const [sendingMsg, setSendingMsg] = useState(false)
  const [msgSent, setMsgSent] = useState(false)

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
      await sendVerification(getFirebaseAuth().currentUser ?? user)
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

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!supportMsg.trim()) return
    setSendingMsg(true)
    setNotice(null)
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken()
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          name: getFirebaseAuth().currentUser?.displayName || "",
          message: supportMsg,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed")
      }
      setSupportMsg("")
      setMsgSent(true)
    } catch {
      setNotice("Couldn't send your message. Please try again.")
    } finally {
      setSendingMsg(false)
    }
  }

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "Permanently delete your account? This removes your login and enquiry history and cannot be undone.",
      )
    )
      return
    setDeleting(true)
    setNotice(null)
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken()
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token ?? ""}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed")
      }
      await signOut()
      window.location.assign("/")
    } catch {
      setNotice(
        "Couldn't delete your account just now. Please try again in a moment.",
      )
      setDeleting(false)
    }
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

  // Gate the whole account until the email is verified — verify first, then in.
  if (needsVerification) {
    return (
      <main className="min-h-screen bg-accent">
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

        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">
            One last step
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-accent-foreground">
            Verify your email to continue
          </h1>
          <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-6">
            <p className="text-sm leading-relaxed text-accent-foreground/80">
              We sent a verification link to{" "}
              <span className="font-semibold text-gold">{user.email}</span>. Please
              click it, then come back and tap{" "}
              <span className="font-semibold">"I've verified"</span>. Your account
              stays locked until your email is confirmed.
            </p>
            <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-accent-foreground/70">
              📩 <span className="font-semibold text-accent-foreground/90">Can't find it?</span>{" "}
              Check your <span className="font-semibold">spam / junk</span> folder.
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
            {notice && (
              <p className="mt-4 rounded-lg bg-primary/15 px-4 py-2.5 text-sm text-accent-foreground">
                {notice}
              </p>
            )}
          </div>
        </div>
      </main>
    )
  }

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

        {/* Project tracking (customer view) */}
        {user.email && <AccountProjects email={user.email} />}

        {/* Documents & quotes (customer view) */}
        {user.email && <AccountDocuments email={user.email} />}

        {/* Owner-only: manage all customer projects */}
        {isAdminUser(user) && <AdminProjects />}

        {/* Owner-only: share documents with customers */}
        {isAdminUser(user) && <AdminDocuments />}

        {/* Help & Support */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-lg font-bold text-accent-foreground">
            Need help?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-accent-foreground/70">
            Send us a message and our team will get back to you. You can also
            reach us directly:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${contact.phoneRaw}`}
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-accent-foreground/85 transition-colors hover:border-gold hover:text-gold"
            >
              Call {contact.phoneDisplay}
            </a>
          </div>

          {msgSent ? (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-medium text-emerald-300">
                ✓ Message sent! Our team will get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setMsgSent(false)}
                className="mt-2 text-xs font-semibold text-accent-foreground/70 hover:text-gold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="mt-5">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-accent-foreground/50">
                Send us a message
              </label>
              <textarea
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
                rows={3}
                placeholder="How can we help?"
                className="w-full rounded-lg border border-white/15 bg-accent/40 px-3 py-2 text-sm text-accent-foreground placeholder:text-accent-foreground/40 outline-none focus:border-gold/60"
              />
              <button
                type="submit"
                disabled={sendingMsg || !supportMsg.trim()}
                className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendingMsg ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Danger zone: delete account */}
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <h2 className="font-heading text-lg font-bold text-red-300">
            Delete account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-accent-foreground/70">
            Permanently delete your account and enquiry history. This can't be
            undone. (Records our team keeps about completed work aren't affected.)
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="mt-4 rounded-lg border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </div>
      </div>
    </main>
  )
}
