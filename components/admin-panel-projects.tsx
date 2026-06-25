"use client"

import { useEffect, useState } from "react"

type Project = {
  id: string
  customerEmail: string
  title: string
  status: string
  progress: number
  updates: { text: string; at: string }[]
  createdAt: { seconds: number } | null
}

const STATUSES = ["Planning", "In Progress", "On Hold", "Completed"]

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"

export function AdminPanelProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("Planning")
  const [progress, setProgress] = useState("0")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/projects")
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to load projects")
      setProjects(data.projects || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !title.trim()) {
      setError("Customer email and project title are required.")
      return
    }
    setBusy(true)
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail: email, title, status, progress, note }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Failed to create project")
      setEmail("")
      setTitle("")
      setStatus("Planning")
      setProgress("0")
      setNote("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create project")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h2 className="mb-1 font-heading text-xl font-extrabold text-slate-900">
        Customer Projects
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Create and update projects for customers. They see their own project
        (and only theirs) on their account page.
      </p>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Create form */}
      <form
        onSubmit={createProject}
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
          placeholder="Project title (e.g. Lakeview Villa)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className={field}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className={field}
          type="number"
          min={0}
          max={100}
          placeholder="Progress %"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <input
          className={`${field} sm:col-span-2`}
          placeholder="First update note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? "Creating…" : "Create project"}
        </button>
      </form>

      {/* List */}
      <div className="mt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          All projects ({projects.length})
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No projects yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {projects.map((p) => (
              <ProjectRow key={p.id} project={p} onChanged={load} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function ProjectRow({
  project,
  onChanged,
}: {
  project: Project
  onChanged: () => Promise<void>
}) {
  const [status, setStatus] = useState(project.status)
  const [progress, setProgress] = useState(String(project.progress))
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)

  async function patch(payload: Record<string, unknown>) {
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      if (payload.note !== undefined) setNote("")
      await onChanged()
    } catch {
      // ignore; could surface a toast
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return
    setBusy(true)
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      await onChanged()
    } catch {
      // ignore
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{project.title}</p>
          <p className="text-xs text-slate-500">{project.customerEmail}</p>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="text-xs font-semibold text-red-600 hover:text-red-500 disabled:opacity-60"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-xs text-slate-500">
          Status
          <select
            className={`${field} mt-1`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500">
          Progress %
          <input
            type="number"
            min={0}
            max={100}
            className={`${field} mt-1 w-24`}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => patch({ status, progress })}
          disabled={busy}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          Save
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className={field}
          placeholder="Add an update note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          onClick={() => note.trim() && patch({ note })}
          disabled={busy}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {project.updates && project.updates.length > 0 && (
        <ul className="mt-3 space-y-1">
          {[...project.updates]
            .sort((a, b) => (a.at < b.at ? 1 : -1))
            .map((u, i) => (
              <li key={i} className="text-xs text-slate-500">
                <span className="text-slate-400">
                  {new Date(u.at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  —{" "}
                </span>
                {u.text}
              </li>
            ))}
        </ul>
      )}
    </li>
  )
}
