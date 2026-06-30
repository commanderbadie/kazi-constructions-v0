"use client"

import { useEffect, useState } from "react"

type Lead = {
  id: string
  name: string
  phone: string
  location: string
  source: string
  ref: string
  status: string
  whatsappClicked: boolean
  qualified: boolean
  timeline: string
  budget: string
  registered: string
  createdAt: { seconds: number } | null
}

const STATUS_STYLES: Record<string, string> = {
  verified: "bg-emerald-100 text-emerald-700",
  contacted: "bg-blue-100 text-blue-700",
  junk: "bg-slate-200 text-slate-500",
  new: "bg-amber-100 text-amber-700",
}

export function AdminPanelLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/leads")
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to load leads")
      setLeads(data.leads || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function remove(id: string) {
    if (!window.confirm("Delete this lead?")) return
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      // ignore
    }
  }

  async function setStatus(id: string, status: string) {
    // Optimistic update for snappy feedback.
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
    } catch {
      await load() // revert to server truth on failure
    }
  }

  function fmt(ts: Lead["createdAt"]): string {
    if (!ts) return "—"
    return new Date(ts.seconds * 1000).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section>
      <h2 className="mb-1 font-heading text-xl font-extrabold text-slate-900">
        Leads
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Visitors who submitted the popup. Verified (messaged on WhatsApp) leads
        are your hottest — reach out to those first.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : leads.length === 0 ? (
        <p className="text-sm text-slate-500">No leads yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Phone</th>
                <th className="px-4 py-2.5">Location</th>
                <th className="px-4 py-2.5">Budget</th>
                <th className="px-4 py-2.5">Timeline</th>
                <th className="px-4 py-2.5">Plot</th>
                <th className="px-4 py-2.5">WhatsApp</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">When</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="text-slate-800">
                  <td className="px-4 py-2.5 font-medium">
                    {l.name}
                    {l.ref && (
                      <span className="ml-1.5 text-xs font-normal text-slate-400">
                        {l.ref}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <a
                      href={`tel:${l.phone}`}
                      className="text-slate-900 hover:underline"
                    >
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-2.5">{l.location || "—"}</td>
                  <td className="px-4 py-2.5">{l.budget || "—"}</td>
                  <td className="px-4 py-2.5">{l.timeline || "—"}</td>
                  <td className="px-4 py-2.5">{l.registered || "—"}</td>
                  <td className="px-4 py-2.5">
                    {l.whatsappClicked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Tapped
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                        STATUS_STYLES[l.status] ?? STATUS_STYLES.new
                      }`}
                    >
                      {l.status || "new"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{fmt(l.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      {l.status !== "verified" && (
                        <button
                          type="button"
                          onClick={() => setStatus(l.id, "verified")}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                        >
                          Verify
                        </button>
                      )}
                      {l.status !== "junk" && (
                        <button
                          type="button"
                          onClick={() => setStatus(l.id, "junk")}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                        >
                          Junk
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(l.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
