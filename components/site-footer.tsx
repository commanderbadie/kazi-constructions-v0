import { BrandLogo } from "@/components/brand-logo"

type FooterLink = { label: string; href: string }

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const companyLinks: FooterLink[] = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Our Process", href: "#process" },
]

const sectorLinks: FooterLink[] = [
  { label: "Residential", href: "#projects" },
  { label: "Commercial", href: "#projects" },
  { label: "Civil & Infrastructure", href: "#services" },
  { label: "Why Choose Us", href: "#about" },
]

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.215zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-accent-foreground/70 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <BrandLogo inverted showTagline />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-accent-foreground/70">
              Building landmarks of enduring excellence since 1998. Architecture,
              engineering and luxury construction under one accountable roof.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/kazi_constructions"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Kazi Constructions on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-foreground/25 text-accent-foreground/80 transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/918801958508"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Kazi Constructions on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-foreground/25 text-accent-foreground/80 transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <FooterColumn title="Company" links={companyLinks} />
          </div>

          <div className="lg:col-span-3">
            <FooterColumn title="Sectors" links={sectorLinks} />
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-accent-foreground/70">
              <li>
                <a
                  href="mailto:builders.kazi@gmail.com"
                  className="transition-colors hover:text-gold"
                >
                  builders.kazi@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918801958508"
                  className="transition-colors hover:text-gold"
                >
                  +91 88019 58508
                </a>
              </li>
              <li className="leading-relaxed">
                4-25-2/3/3, Suleman Nagar, Rajendra Nagar, Hyderabad
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-accent-foreground/15 pt-6 text-center text-sm text-accent-foreground/50">
          <p>
            &copy; {new Date().getFullYear()} Kazi Constructions. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
