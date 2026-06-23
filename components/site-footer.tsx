import { Phone, Mail, MapPin, AtSign } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

export function SiteFooter() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo inverted showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-accent-foreground/60">
              Build your dream home with quality, transparency, and trust —
              residential, commercial, and industrial construction across
              Hyderabad.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-accent-foreground/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-accent-foreground/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  4-25-2/3/3, Suleman Nagar, Rajendra Nagar, Attapur, Hyderabad
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+918801958508" className="hover:text-gold">
                  +91 8801958508
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:builders.kazi@gmail.com" className="hover:text-gold">
                  builders.kazi@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <AtSign className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href="https://instagram.com/kazi_constructions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  kazi_constructions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-accent-foreground/15 pt-6 text-center text-sm text-accent-foreground/50">
          <p>
            &copy; {new Date().getFullYear()} Kazi Constructions. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
