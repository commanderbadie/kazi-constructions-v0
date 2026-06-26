"use client"

import { useEffect, useState } from "react"

type Lead = {
  id: string
  name: string
  phone: string
  location: string
  source: string
  createdAt: { seconds: number } | null
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
        Visitors who submitted the popup. Reach out to them to start a project.
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
                <th className="px-4 py-2.5">When</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l) => (
                <tr key={l.id} className="text-slate-800">
                  <td className="px-4 py-2.5 font-medium">{l.name}</td>
                  <td className="px-4 py-2.5">
                    <a
                      href={`tel:${l.phone}`}
                      className="text-slate-900 hover:underline"
                    >
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-2.5">{l.location || "—"}</td>
                  <td className="px-4 py-2.5 text-slate-500">{fmt(l.createdAt)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => remove(l.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
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
