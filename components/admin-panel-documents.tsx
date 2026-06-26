"use client"

import { useEffect, useState } from "react"

type Doc = {
  id: string
  customerEmail: string
  title: string
  url: string
}

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"

export function AdminPanelDocuments() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/documents")
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to load documents")
      setDocs(data.documents || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !title.trim() || !url.trim()) {
      setError("Customer email, title, and link are all required.")
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email, title, url }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to add document")
      setEmail("")
      setTitle("")
      setUrl("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add document")
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string, title: string) {
    if (!window.confirm(`Remove "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      // ignore
    }
  }

  return (
    <section>
      <h2 className="mb-1 font-heading text-xl font-extrabold text-slate-900">
        Customer Documents
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Share a document/quote with a customer by pasting a link (Google Drive,
        Dropbox, etc.). They see only their own.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form
        onSubmit={add}
        className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
      >
        <input
          className={field}
          type="email"
          placeholder="Customer email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={field}
          placeholder="Document title (e.g. Quotation PDF)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className={`${field} sm:col-span-2`}
          placeholder="Link (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? "Adding…" : "Add document"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          All documents ({docs.length})
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No documents yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="min-w-0">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-slate-900 hover:underline"
                  >
                    {d.title}
                  </a>
                  <p className="truncate text-xs text-slate-500">
                    {d.customerEmail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(d.id, d.title)}
                  className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
