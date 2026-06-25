"use client"

import type { ReactNode } from "react"
import { BrandLogo } from "@/components/brand-logo"

/** Shared centered card layout for the auth pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-accent px-4 py-12">
      <a href="/" aria-label="Kazi Constructions home" className="mb-8">
        <BrandLogo inverted showTagline />
      </a>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-xl sm:p-8">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && (
        <p className="mt-6 text-center text-sm text-accent-foreground/70">{footer}</p>
      )}

      <a
        href="/"
        className="mt-4 text-xs font-medium text-accent-foreground/50 transition-colors hover:text-gold"
      >
        ← Back to website
      </a>
    </main>
  )
}

export function GoogleButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        />
      </svg>
      {label}
    </button>
  )
}

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"

export const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"

export const primaryBtnClass =
  "w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
