type SectionDividerProps = {
  /** Use on dark (navy) backgrounds so the fade reads correctly. */
  onDark?: boolean
}

/**
 * Brand divider that mirrors the gold underline in the Kazi logo lockup:
 * a centered gold line that fades out at both ends, with a small diamond accent.
 */
export function SectionDivider({ onDark }: SectionDividerProps) {
  return (
    <div
      className={onDark ? "bg-accent" : "bg-background"}
      role="presentation"
      aria-hidden="true"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-1 sm:px-6 lg:px-8">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
    </div>
  )
}
