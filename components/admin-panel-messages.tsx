"use client"

import { useEffect, useState } from "react"

type Message = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: { seconds: number } | null
}

export function AdminPanelMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/messages")
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to load messages")
      setMessages(data.messages || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setRead(id: string, read: boolean) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      // ignore
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this message?")) return
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      // ignore
    }
  }

  function fmt(ts: Message["createdAt"]): string {
    if (!ts) return "—"
    return new Date(ts.seconds * 1000).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const pending = messages.filter((m) => !m.read).length

  return (
    <section>
      <div className="mb-1 flex items-center gap-3">
        <h2 className="font-heading text-xl font-extrabold text-slate-900">
          Messages
        </h2>
        {pending > 0 && (
          <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
            {pending} pending
          </span>
        )}
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Support messages from logged-in customers. You're also emailed each one.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-slate-500">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border p-4 ${
                m.read
                  ? "border-slate-200 bg-white"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!m.read && (
                    <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                  )}
                  <span className="font-semibold text-slate-900">
                    {m.name || "Customer"}
                  </span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-slate-400">{fmt(m.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {m.message}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                <a
                  href={`mailto:${m.email}?subject=Re:%20Your%20message%20to%20Kazi%20Constructions`}
                  className="text-slate-700 hover:underline"
                >
                  Reply by email
                </a>
                <button
                  type="button"
                  onClick={() => setRead(m.id, !m.read)}
                  className="text-slate-700 hover:underline"
                >
                  {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
