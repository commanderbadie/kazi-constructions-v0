"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function SiteNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [overLight, setOverLight] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([])

  // Toggle the solid (marble) header once the user scrolls past the hero top,
  // and go transparent again while the header band overlaps the Services section.
  useEffect(() => {
    const HEADER = 80 // h-20
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const services = document.getElementById("services")
      if (services) {
        const r = services.getBoundingClientRect()
        setOverLight(r.top <= HEADER && r.bottom >= HEADER)
      } else {
        setOverLight(false)
      }
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Track which section is in view to drive the sliding underline.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => Boolean(el))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = navLinks.findIndex((l) => l.href === `#${visible.target.id}`)
          if (idx !== -1) setActiveIndex(idx)
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Position the underline beneath the active link; recompute on resize.
  useEffect(() => {
    const updateIndicator = () => {
      const el = linkRefs.current[activeIndex]
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    updateIndicator()
    window.addEventListener("resize", updateIndicator)
    return () => window.removeEventListener("resize", updateIndicator)
  }, [activeIndex])

  // Transparent at the very top (over the dark hero) and again over the
  // light Services section; solid marble everywhere in between.
  const transparent = !scrolled || overLight
  // Light text only while the header sits over the dark hero.
  const onDark = !scrolled

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[#e3ddd0] bg-cover bg-center shadow-sm"
      }`}
      style={!transparent ? { backgroundImage: "url(/marble-header.svg)" } : undefined}
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" aria-label="Kazi Constructions home">
          <BrandLogo className="gap-3" inverted={onDark} />
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link, i) => {
            const isActive = i === activeIndex
            return (
              <a
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[i] = el
                }}
                className={`text-[15px] transition-colors duration-300 ${
                  isActive
                    ? onDark
                      ? "font-semibold text-accent-foreground"
                      : "font-semibold text-accent"
                    : onDark
                      ? "font-medium text-accent-foreground/70 hover:text-accent-foreground"
                      : "font-medium text-accent/75 hover:text-accent"
                }`}
              >
                {link.label}
              </a>
            )
          })}

          {/* Sliding gold underline */}
          <span
            aria-hidden="true"
            className="absolute -bottom-2 h-0.5 rounded-full bg-gold transition-all duration-500 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </nav>

        <div className="hidden md:block">
          <Button
            size="lg"
            nativeButton={false}
            className={`rounded-lg border px-6 shadow-md transition-colors duration-300 ${
              onDark
                ? "border-gold bg-gold text-gold-foreground hover:bg-gold/90"
                : "border-gold/60 bg-accent text-accent-foreground hover:bg-accent/90"
            }`}
            render={<a href="#contact" />}
          >
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-md p-2 transition-colors duration-300 md:hidden ${
            onDark ? "text-accent-foreground" : "text-accent"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  i === activeIndex
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              className="mt-2 border border-gold/60 bg-accent text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<a href="#contact" onClick={() => setOpen(false)} />}
            >
              Get a Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
