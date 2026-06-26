"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { getDb, type CustomerDoc } from "@/lib/firestore"

export function AccountDocuments({ email }: { email: string }) {
  const [docs, setDocs] = useState<CustomerDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const q = query(
          collection(getDb(), "documents"),
          where("customerEmail", "==", email.toLowerCase()),
        )
        const snap = await getDocs(q)
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<CustomerDoc, "id">) }),
        )
        list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        if (active) setDocs(list)
      } catch (err) {
        console.error("Could not load documents:", err)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [email])

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="font-heading text-lg font-bold text-accent-foreground">
        Documents & quotes
      </h2>

      {loading ? (
        <p className="mt-3 text-sm text-accent-foreground/60">Loading…</p>
      ) : docs.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-accent-foreground/70">
          No documents yet. Quotes and files our team shares with you will appear
          here.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {docs.map((d) => (
            <li key={d.id}>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-accent/40 px-4 py-3 transition-colors hover:border-gold/50"
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden="true">📄</span>
                  <span className="text-sm font-medium text-accent-foreground">
                    {d.title}
                  </span>
                </span>
                <span className="text-xs font-semibold text-gold">View →</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
