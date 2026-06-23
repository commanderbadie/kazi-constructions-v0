import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  /** Use the inverted lockup (light text) on dark backgrounds. */
  inverted?: boolean
  showTagline?: boolean
}

export function BrandLogo({ className, inverted, showTagline }: BrandLogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/kazi-logo-transparent.png"
        alt="Kazi Constructions logo"
        className="h-12 w-12 shrink-0 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-extrabold uppercase tracking-tight",
            inverted ? "text-accent-foreground" : "text-accent",
          )}
        >
          Kazi <span className="text-primary">Constructions</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              "mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
              inverted ? "text-accent-foreground/60" : "text-muted-foreground",
            )}
          >
            Architects · Engineers · Consultants
          </span>
        )}
      </span>
    </span>
  )
}
