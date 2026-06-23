import { Building2 } from "lucide-react"

const columns = [
  {
    title: "Company",
    links: ["About", "Projects", "Careers", "Contact"],
  },
  {
    title: "Services",
    links: ["Residential", "Commercial", "Renovation", "Consultancy"],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-gold-foreground">
                <Building2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-extrabold uppercase tracking-tight">
                Kazi <span className="text-gold">Constructions</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-accent-foreground/60">
              Building dreams into reality with premium craftsmanship, modern
              engineering, and unwavering integrity since 2004.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-accent-foreground/60 transition-colors hover:text-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-accent-foreground/15 pt-6 text-center text-sm text-accent-foreground/50">
          <p>&copy; {new Date().getFullYear()} Kazi Constructions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
