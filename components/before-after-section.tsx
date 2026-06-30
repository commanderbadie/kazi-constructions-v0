"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, MoveHorizontal } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { cn } from "@/lib/utils"

type Comparison = {
  title: string
  category: string
  location: string
  /** Left side — the 3D elevation/design render */
  before: string
  /** Right side — the built construction reality */
  after: string
}

const comparisons: Comparison[] = [
  {
    title: "Nizambad Residence",
    category: "Residential",
    location: "Nizambad",
    before: "/gallery/nizambad/17.jpg",
    after: "/gallery/nizambad/1.jpg",
  },
  {
    title: "Shamshabad Home",
    category: "Renovation",
    location: "Shamshabad, Hyderabad",
    before: "/gallery/shamshabad/3.jpg",
    after: "/gallery/shamshabad/7.jpg",
  },
  {
    title: "Attapur Masjid",
    category: "Commercial",
    location: "Attapur, Hyderabad",
    before: "/gallery/attapur-masjid/1.jpg",
    after: "/gallery/attapur-masjid/4.jpg",
  },
]

/**
 * A single draggable before/after comparison.
 * Left of the handle reveals the 3D design; right reveals the built reality.
 */
function CompareSlider({ item, active }: { item: Comparison; active: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  const setFromClientX = useCallback((clientX: number) => {
    const node = containerRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  // Global listeners while dragging so the handle keeps tracking even when the
  // pointer leaves the image bounds.
  useEffect(() => {
    if (!dragging) return

    function onMove(e: PointerEvent) {
      e.preventDefault()
      setFromClientX(e.clientX)
    }
    function onUp() {
      setDragging(false)
    }

    window.addEventListener("pointermove", onMove, { passive: false })
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [dragging, setFromClientX])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setPos((p) => Math.max(0, p - 4))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setPos((p) => Math.min(100, p + 4))
    } else if (e.key === "Home") {
      e.preventDefault()
      setPos(0)
    } else if (e.key === "End") {
      e.preventDefault()
      setPos(100)
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        // Begin dragging from anywhere on the image for a natural feel.
        setDragging(true)
        setFromClientX(e.clientX)
      }}
      className={cn(
        "group/compare relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-xl bg-navy sm:aspect-[16/10]",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
      )}
    >
      {/* Base layer — Built Reality (right side) */}
      <img
        src={item.after}
        alt={`${item.title} — built reality`}
        loading={active ? "eager" : "lazy"}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* Top layer — 3D Design, clipped to the left of the handle */}
      <img
        src={item.before}
        alt={`${item.title} — 3D design render`}
        loading={active ? "eager" : "lazy"}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Soft vignette for legibility of labels */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/35 via-transparent to-navy/35" />

      {/* Corner labels */}
      <span
        className={cn(
          "pointer-events-none absolute left-3 top-3 rounded-full border border-gold/60 bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold backdrop-blur-sm transition-opacity duration-300 sm:left-4 sm:top-4",
          pos < 12 ? "opacity-0" : "opacity-100",
        )}
      >
        3D Design
      </span>
      <span
        className={cn(
          "pointer-events-none absolute right-3 top-3 rounded-full border border-white/40 bg-navy/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-opacity duration-300 sm:right-4 sm:top-4",
          pos > 88 ? "opacity-0" : "opacity-100",
        )}
      >
        Built Reality
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-gold shadow-[0_0_12px_2px_color-mix(in_oklch,var(--gold)_70%,transparent)]"
        style={{ left: `${pos}%` }}
      />

      {/* Drag handle / knob */}
      <button
        type="button"
        aria-label={`Compare 3D design and built reality for ${item.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        role="slider"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.stopPropagation()
          setDragging(true)
        }}
        className={cn(
          "absolute top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy/90 text-gold shadow-lg outline-none backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
          dragging ? "scale-110 cursor-grabbing" : "cursor-grab",
        )}
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Drag hint pill — fades out once the user interacts */}
      <span
        className={cn(
          "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-gold-foreground shadow-md transition-all duration-500 sm:bottom-4",
          dragging || pos !== 50
            ? "translate-y-2 opacity-0"
            : "opacity-100 group-hover/compare:opacity-90",
        )}
      >
        Drag to compare
      </span>
    </div>
  )
}

export function BeforeAfterSection() {
  const [index, setIndex] = useState(0)
  const count = comparisons.length

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  )

  return (
    <section
      id="transformations"
      className="bg-background py-20 lg:py-28"
      aria-roledescription="carousel"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            From blueprint to building
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            3D Design to Reality
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Drag the slider to reveal how our 3D elevations become precisely
            built structures — proof of design intent delivered on site.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="relative">
            {/* Carousel viewport */}
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {comparisons.map((item, i) => (
                  <div
                    key={item.title}
                    className="w-full shrink-0 px-0"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}: ${item.title}`}
                    aria-hidden={i !== index}
                  >
                    <div className="overflow-hidden rounded-2xl border border-gold/25 bg-card shadow-xl shadow-navy/5">
                      <CompareSlider item={item} active={i === index} />
                      {/* Caption bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/15 px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                          <h3 className="truncate font-heading text-lg font-bold text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {item.location}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous project"
              className="absolute -left-3 top-[38%] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy/90 text-gold shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:-left-5 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next project"
              className="absolute -right-3 top-[38%] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-navy/90 text-gold shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:-right-5 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-7 flex items-center justify-center gap-3">
            {comparisons.map((item, i) => (
              <button
                key={item.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${item.title}`}
                aria-current={i === index}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
                  i === index
                    ? "w-8 bg-gold"
                    : "w-2.5 bg-navy/25 hover:bg-navy/45",
                )}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
