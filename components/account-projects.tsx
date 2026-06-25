"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { getDb, type Project } from "@/lib/firestore"

function statusColor(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-emerald-500/15 text-emerald-300"
    case "In Progress":
      return "bg-blue-500/15 text-blue-300"
    case "On Hold":
      return "bg-amber-500/15 text-amber-300"
    default:
      return "bg-white/10 text-accent-foreground/70"
  }
}

export function AccountProjects({ email }: { email: string }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const q = query(
          collection(getDb(), "projects"),
          where("customerEmail", "==", email.toLowerCase()),
        )
        const snap = await getDocs(q)
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }),
        )
        list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        if (active) setProjects(list)
      } catch (err) {
        console.error("Could not load projects:", err)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [email])

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="font-heading text-lg font-bold text-accent-foreground">
        Your projects
      </h2>

      {loading ? (
        <p className="mt-3 text-sm text-accent-foreground/60">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-accent-foreground/70">
          No projects yet. Once our team starts a project with you, you'll be
          able to track its progress right here.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {projects.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-white/10 bg-accent/40 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-heading text-base font-bold text-accent-foreground">
                  {p.title}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(p.status)}`}
                >
                  {p.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-accent-foreground/60">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, p.progress))}%` }}
                  />
                </div>
              </div>

              {/* Updates timeline */}
              {p.updates && p.updates.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                    Updates
                  </p>
                  <ul className="mt-2 space-y-2">
                    {[...p.updates]
                      .sort((a, b) => (a.at < b.at ? 1 : -1))
                      .map((u, i) => (
                        <li key={i} className="text-sm text-accent-foreground/80">
                          <span className="text-accent-foreground/50">
                            {new Date(u.at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                            {" — "}
                          </span>
                          {u.text}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
