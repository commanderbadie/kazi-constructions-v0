import { Target, Eye, CheckCircle2 } from "lucide-react"

const highlights = [
  "Licensed, bonded, and fully insured",
  "On-time and on-budget delivery",
  "Sustainable, quality-first materials",
  "Dedicated project managers",
]

export function AboutSection() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative">
          <img
            src="/construction-team-reviewing-blueprints-on-site.jpg"
            alt="Kazi Constructions team reviewing blueprints on a job site"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <div className="absolute -bottom-6 -right-2 hidden rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-lg sm:block lg:-right-6">
            <p className="font-heading text-3xl font-extrabold">20+</p>
            <p className="text-sm font-medium">Years of building trust</p>
          </div>
        </div>

        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            About Kazi Constructions
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            Building spaces that stand the test of time
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            For over two decades, Kazi Constructions has transformed blueprints
            into landmarks. We combine modern engineering, skilled craftsmanship,
            and transparent communication to deliver projects that exceed
            expectations every single time.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <Target className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-bold">Our Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To craft durable, sustainable structures that empower communities
                and elevate the way people live and work.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Eye className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-bold">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                To be the region&apos;s most trusted construction partner, known
                for innovation, integrity, and exceptional quality.
              </p>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
