"use client"

import { useState } from "react"
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

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#e3ddd0] bg-cover bg-center shadow-sm"
      style={{ backgroundImage: "url(/marble-header.svg)" }}
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" aria-label="Kazi Constructions home">
          <BrandLogo className="gap-3" />
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={
                i === 0
                  ? "relative text-[15px] font-semibold text-accent after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-gold after:content-['']"
                  : "text-[15px] font-medium text-accent/80 transition-colors hover:text-accent"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            size="lg"
            nativeButton={false}
            className="rounded-lg border border-gold/60 bg-accent px-6 text-accent-foreground shadow-md hover:bg-accent/90"
            render={<a href="#contact" />}
          >
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-accent md:hidden"
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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
