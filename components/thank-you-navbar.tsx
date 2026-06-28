"use client"

import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { useSiteContent } from "@/lib/use-site-content"

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
]

export function ThankYouNavbar() {
  const { contact } = useSiteContent()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent-foreground/10 bg-accent/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" aria-label="Kazi Constructions home">
          <BrandLogo className="gap-3" inverted showTagline />
        </a>

        <nav
          className="hidden items-center gap-9 lg:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-accent-foreground/75 transition-colors duration-300 hover:text-accent-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:${contact.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-semibold text-accent-foreground/85 transition-colors hover:text-accent-foreground"
          >
            <Phone className="h-4 w-4 text-gold" />
            {contact.phoneDisplay}
          </a>
          <Button
            size="lg"
            nativeButton={false}
            className="h-auto rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-colors duration-300 hover:bg-primary/90"
            render={<a href="/#contact" />}
          >
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-accent-foreground transition-colors lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-accent-foreground/10 bg-accent lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-accent-foreground/80 transition-colors hover:bg-accent-foreground/10 hover:text-accent-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${contact.phoneRaw}`}
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              <Phone className="h-4 w-4 text-gold" />
              {contact.phoneDisplay}
            </a>
            <Button
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
              nativeButton={false}
              render={<a href="/#contact" onClick={() => setOpen(false)} />}
            >
              Get a Quote
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
