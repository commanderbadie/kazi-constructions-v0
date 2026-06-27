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
      className={onDark ? "bg-accent/90 backdrop-blur-md" : "bg-transparent"}
      role="presentation"
      aria-hidden="true"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <span className="kazi-divider-line h-0.5 flex-1 rounded-full bg-gradient-to-r from-transparent via-gold/70 to-gold" />
        <span className="kazi-divider-diamond h-2 w-2 rotate-45 rounded-[1px] bg-gold" />
        <span className="kazi-divider-line h-0.5 flex-1 rounded-full bg-gradient-to-l from-transparent via-gold/70 to-gold" />
      </div>
    </div>
  )
}
