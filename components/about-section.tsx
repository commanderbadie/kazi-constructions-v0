import { Target, Eye, CheckCircle2 } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CountUp } from "@/components/count-up"

const highlights = [
  "Licensed, bonded, and fully insured",
  "On-time and on-budget delivery",
  "Sustainable, quality-first materials",
  "Dedicated project managers",
]

const counters = [
  { end: 20, suffix: "+", label: "Years of Experience" },
  { end: 450, suffix: "+", label: "Completed Projects" },
  { end: 600, suffix: "+", label: "Happy Clients" },
  { end: 18, suffix: "", label: "Ongoing Projects" },
]

export function AboutSection() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="relative">
          <img
            src="/about-site.svg"
            alt="Kazi Constructions team reviewing blueprints on a job site"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <div className="absolute -bottom-6 -right-2 hidden rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-lg sm:block lg:-right-6">
            <p className="font-heading text-3xl font-extrabold">20+</p>
            <p className="text-sm font-medium">Years of building trust</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            About Kazi Constructions
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
            Our Commitment
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            At Kazi Constructions, we believe in quality, transparency, and
            trust. Every project we undertake is a reflection of our engineering
            excellence and architectural creativity — built to last and designed
            to inspire. Led by Kazi Waheeduddin Siddiqi, B.Tech (Civil), M.Tech
            (Civil), GHMC Licensed Engineer and Autodesk Certified Draftsman.
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
        </Reveal>
      </div>

      {/* Animated counters */}
      <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {counters.map((counter) => (
              <div
                key={counter.label}
                className="flex flex-col items-center justify-center bg-card px-4 py-10 text-center"
              >
                <dt className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">
                  <CountUp end={counter.end} suffix={counter.suffix} />
                </dt>
                <dd className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {counter.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
