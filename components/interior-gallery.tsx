"use client"

import { useCallback, useEffect, useState } from "react"
import { Reveal } from "@/components/reveal"

const images = [
  { src: "/gallery/interior/modular-kitchen.jpg", alt: "Modular kitchen interior" },
  { src: "/gallery/interior/interior-pics.jpg", alt: "Interior living space" },
  { src: "/gallery/interior/dressing-table-4.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-5.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-8.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-9.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-10.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-12.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-13.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-14.jpg", alt: "Bespoke dressing table design" },
  { src: "/gallery/interior/dressing-table-16.jpg", alt: "Bespoke dressing table design" },
]

export function InteriorGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [],
  )
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + images.length) % images.length,
      ),
    [],
  )

  useEffect(() => {
    if (!isOpen) return

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close, next, prev])

  return (
    <section id="interiors" className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Interiors
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
              Interior fit-outs &{" "}
              <span className="font-normal italic text-primary">finishes</span>
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Custom joinery, modular kitchens and bespoke furniture crafted to
              elevate every space. Tap any image to view it larger.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>button]:mb-4">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group block w-full break-inside-avoid overflow-hidden rounded-xl border border-border bg-card shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`View ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {isOpen && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Interior image viewer"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <img
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </section>
  )
}
