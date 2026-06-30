"use client"

import { useEffect, useRef, useState } from "react"

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
  const [success, setSuccess] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

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

  function flash(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  async function uploadFile(): Promise<string | null> {
    if (!file) return null
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Upload failed")
      return data.url as string
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed")
      return null
    } finally {
      setUploading(false)
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !title.trim()) {
      setError("Customer email and title are required.")
      return
    }
    if (!file && !url.trim()) {
      setError("Please upload a file or paste a link.")
      return
    }

    setBusy(true)
    try {
      let docUrl = url.trim()

      // If file is selected, upload it first
      if (file) {
        const uploadedUrl = await uploadFile()
        if (!uploadedUrl) {
          setBusy(false)
          return
        }
        docUrl = uploadedUrl
      }

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email, title, url: docUrl }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to add document")

      flash("Document added successfully!")
      setEmail("")
      setTitle("")
      setUrl("")
      setFile(null)
      if (fileRef.current) fileRef.current.value = ""
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add document")
    } finally {
      setBusy(false)
    }
  }

  async function sendToCustomer(doc: Doc) {
    setSendingEmail(doc.id)
    setError(null)
    try {
      const res = await fetch("/api/admin/documents/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: doc.customerEmail,
          title: doc.title,
          url: doc.url,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to send email")
      flash(`Email sent to ${doc.customerEmail}!`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send email")
    } finally {
      setSendingEmail(null)
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
        Upload files or paste links to share with customers. Send them an email
        notification with one click.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <form
        onSubmit={add}
        className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={field}
            type="email"
            placeholder="Customer email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={field}
            placeholder="Document title (e.g. Floor Plan PDF)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* File upload */}
        <div className="rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition-colors hover:border-slate-400">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              setFile(f)
              if (f) setUrl("") // Clear link if file is selected
            }}
            className="hidden"
            id="doc-file-input"
          />
          <label
            htmlFor="doc-file-input"
            className="cursor-pointer"
          >
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5 text-emerald-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-sm font-medium text-slate-700">{file.name}</span>
                <span className="text-xs text-slate-400">
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            ) : (
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mx-auto h-8 w-8 text-slate-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Click to browse files
                </p>
                <p className="text-xs text-slate-400">
                  PDF, DOC, Images, ZIP — up to 10MB
                </p>
              </div>
            )}
          </label>
        </div>

        {/* OR paste a link */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase text-slate-400">or paste a link</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <input
          className={field}
          placeholder="https://drive.google.com/..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (e.target.value) {
              setFile(null)
              if (fileRef.current) fileRef.current.value = ""
            }
          }}
        />

        <button
          type="submit"
          disabled={busy || uploading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {uploading ? "Uploading file…" : busy ? "Adding…" : "Add document"}
        </button>
      </form>

      {/* Document list */}
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
                <div className="min-w-0 flex-1">
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
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => sendToCustomer(d)}
                    disabled={sendingEmail === d.id}
                    className="rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                  >
                    {sendingEmail === d.id ? "Sending…" : "Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(d.id, d.title)}
                    className="text-xs font-semibold text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
