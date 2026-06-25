"use client"

import { useEffect, useState } from "react"
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { getDb, type Project, PROJECT_STATUSES } from "@/lib/firestore"

const fieldClass =
  "w-full rounded-lg border border-white/15 bg-accent/40 px-3 py-2 text-sm text-accent-foreground placeholder:text-accent-foreground/40 outline-none focus:border-gold/60"

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // New-project form
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<string>("Planning")
  const [progress, setProgress] = useState("0")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(collection(getDb(), "projects"))
      const list = snap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }),
      )
      list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
      setProjects(list)
    } catch (err) {
      console.error("Could not load projects:", err)
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
      await addDoc(collection(getDb(), "projects"), {
        customerEmail: email.trim().toLowerCase(),
        title: title.trim(),
        status,
        progress: Number(progress) || 0,
        updates: note.trim()
          ? [{ text: note.trim(), at: new Date().toISOString() }]
          : [],
        createdAt: serverTimestamp(),
      })
      setEmail("")
      setTitle("")
      setStatus("Planning")
      setProgress("0")
      setNote("")
      await load()
    } catch (err) {
      console.error(err)
      setError("Could not create the project. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-gold-foreground">
          Owner
        </span>
        <h2 className="font-heading text-lg font-bold text-accent-foreground">
          Manage customer projects
        </h2>
      </div>
      <p className="mt-1 text-sm text-accent-foreground/60">
        Create a project for a customer (by their account email) and keep its
        status updated. They'll see it on their own account page.
      </p>

      {/* Create form */}
      <form
        onSubmit={createProject}
        className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-accent/30 p-4 sm:grid-cols-2"
      >
        <input
          className={fieldClass}
          placeholder="Customer email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={fieldClass}
          placeholder="Project title (e.g. Lakeview Villa)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className={fieldClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s} className="text-black">
              {s}
            </option>
          ))}
        </select>
        <input
          className={fieldClass}
          type="number"
          min={0}
          max={100}
          placeholder="Progress %"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <input
          className={`${fieldClass} sm:col-span-2`}
          placeholder="First update note (optional) — e.g. 'Site survey complete'"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {error && (
          <p className="text-sm text-red-300 sm:col-span-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold/90 disabled:opacity-60 sm:col-span-2"
        >
          {busy ? "Creating…" : "Create project"}
        </button>
      </form>

      {/* All projects */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground/50">
          All projects ({projects.length})
        </h3>
        {loading ? (
          <p className="mt-3 text-sm text-accent-foreground/60">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="mt-3 text-sm text-accent-foreground/60">
            No projects yet — create one above.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {projects.map((p) => (
              <AdminProjectCard key={p.id} project={p} onChanged={load} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function AdminProjectCard({
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

  async function save() {
    setBusy(true)
    try {
      await updateDoc(doc(getDb(), "projects", project.id), {
        status,
        progress: Number(progress) || 0,
      })
      await onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  async function addNote() {
    if (!note.trim()) return
    setBusy(true)
    try {
      await updateDoc(doc(getDb(), "projects", project.id), {
        updates: arrayUnion({ text: note.trim(), at: new Date().toISOString() }),
      })
      setNote("")
      await onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete project "${project.title}"? This can't be undone.`))
      return
    setBusy(true)
    try {
      await deleteDoc(doc(getDb(), "projects", project.id))
      await onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="rounded-xl border border-white/10 bg-accent/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-accent-foreground">{project.title}</p>
          <p className="text-xs text-accent-foreground/50">
            {project.customerEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="text-xs font-semibold text-red-300 hover:text-red-200 disabled:opacity-60"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-xs text-accent-foreground/60">
          Status
          <select
            className={`${fieldClass} mt-1`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s} className="text-black">
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-accent-foreground/60">
          Progress %
          <input
            type="number"
            min={0}
            max={100}
            className={`${fieldClass} mt-1 w-24`}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Save
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className={fieldClass}
          placeholder="Add an update note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          onClick={addNote}
          disabled={busy}
          className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-accent-foreground/80 hover:border-gold hover:text-gold disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {project.updates && project.updates.length > 0 && (
        <ul className="mt-3 space-y-1">
          {[...project.updates]
            .sort((a, b) => (a.at < b.at ? 1 : -1))
            .map((u, i) => (
              <li key={i} className="text-xs text-accent-foreground/70">
                <span className="text-accent-foreground/40">
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
