"use client"

import { useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { getDb, type CustomerDoc } from "@/lib/firestore"

const fieldClass =
  "w-full rounded-lg border border-white/15 bg-accent/40 px-3 py-2 text-sm text-accent-foreground placeholder:text-accent-foreground/40 outline-none focus:border-gold/60"

function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ""
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function AdminDocuments() {
  const [docs, setDocs] = useState<CustomerDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(collection(getDb(), "documents"))
      const list = snap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as Omit<CustomerDoc, "id">) }),
      )
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setDocs(list)
    } catch (err) {
      console.error("Could not load documents:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addDocument(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const finalUrl = normalizeUrl(url)
    if (!email.trim() || !title.trim() || !finalUrl) {
      setError("Customer email, title, and link are all required.")
      return
    }
    setBusy(true)
    try {
      await addDoc(collection(getDb(), "documents"), {
        customerEmail: email.trim().toLowerCase(),
        title: title.trim(),
        url: finalUrl,
        createdAt: serverTimestamp(),
      })
      setEmail("")
      setTitle("")
      setUrl("")
      await load()
    } catch (err) {
      console.error(err)
      setError("Could not add the document. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  async function removeDoc(id: string, title: string) {
    if (!window.confirm(`Remove "${title}"?`)) return
    try {
      await deleteDoc(doc(getDb(), "documents", id))
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-gold-foreground">
          Owner
        </span>
        <h2 className="font-heading text-lg font-bold text-accent-foreground">
          Share documents & quotes
        </h2>
      </div>
      <p className="mt-1 text-sm text-accent-foreground/60">
        Paste a link to a document (Google Drive, Dropbox, etc.). The customer
        will see it on their account.
      </p>

      <form
        onSubmit={addDocument}
        className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-accent/30 p-4 sm:grid-cols-2"
      >
        <input
          className={fieldClass}
          type="email"
          placeholder="Customer email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Document title (e.g. Quotation PDF)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={`${fieldClass} sm:col-span-2`}
          placeholder="Link (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold/90 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? "Adding…" : "Add document"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/50">
          All documents ({docs.length})
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-accent-foreground/60">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="mt-3 text-sm text-accent-foreground/60">
            No documents yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-accent/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-accent-foreground">
                    {d.title}
                  </p>
                  <p className="truncate text-xs text-accent-foreground/50">
                    {d.customerEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDoc(d.id, d.title)}
                  className="shrink-0 text-xs font-semibold text-red-300 hover:text-red-200"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
