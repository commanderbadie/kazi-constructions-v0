"use client"

import { useEffect, useState } from "react"

type Diag = Record<string, unknown>

function Row({ ok, label, detail }: { ok: boolean; label: string; detail?: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className={ok ? "text-emerald-600" : "text-red-600"}>{ok ? "✅" : "❌"}</span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {detail && <p className="mt-0.5 break-all text-xs text-slate-500">{detail}</p>}
      </div>
    </li>
  )
}

export function AdminPanelDiagnostics() {
  const [data, setData] = useState<Diag | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch("/api/admin/diagnostics")
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || "Failed")
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    run()
  }, [])

  return (
    <section>
      <h2 className="mb-1 font-heading text-xl font-extrabold text-slate-900">
        Diagnostics
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Checks that the backend (database + email) is wired up correctly.
      </p>

      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="mb-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Running…" : "Run checks again"}
      </button>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {data && (
        <ul className="space-y-2">
          <Row
            ok={Boolean(data.serviceAccountPresent)}
            label="Service account key present"
            detail={data.serviceAccountPresent ? undefined : "FIREBASE_SERVICE_ACCOUNT is missing"}
          />
          <Row
            ok={data.serviceAccountParses === true}
            label="Service account key is valid JSON"
            detail={typeof data.parseError === "string" ? data.parseError : undefined}
          />
          <Row
            ok={data.firestoreConnect === "ok"}
            label="Database (Firestore) connects"
            detail={typeof data.firestoreError === "string" ? data.firestoreError : undefined}
          />
          <Row
            ok={Boolean(data.gmailConfigured)}
            label="Email (Gmail) configured"
            detail={data.gmailConfigured ? undefined : "GMAIL_USER / GMAIL_APP_PASSWORD missing"}
          />
          {data.gmailConfigured ? (
            <Row
              ok={typeof data.emailSend === "string" && data.emailSend.startsWith("ok")}
              label="Email sending works (test email sent)"
              detail={typeof data.emailError === "string" ? data.emailError : undefined}
            />
          ) : null}
          {data.projectId ? (
            <li className="px-1 text-xs text-slate-400">
              Project: {String(data.projectId)}
            </li>
          ) : null}
        </ul>
      )}
    </section>
  )
}
