import type { Metadata } from "next"
import { PageNavbar } from "@/components/page-navbar"
import { PackagesTable } from "@/components/packages-table"
import { HowItWorks } from "@/components/how-it-works"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Packages | Kazi Constructions",
  description:
    "Compare Kazi Constructions home-build packages — Basic, Classic, Premium and Royale — across materials and specifications.",
}

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Our Packages
            </span>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Choose the build that{" "}
              <span className="font-normal italic text-primary">fits you</span>
            </h1>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Transparent, all-inclusive pricing with quality materials at every
              tier. Compare specifications side by side and pick what suits your
              home and budget.
            </p>
          </div>
          <a
            href="/#contact"
            className="mt-2 inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg sm:self-center"
          >
            Let&apos;s Build
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10">
          <HowItWorks />
        </div>

        <div className="mt-10">
          <PackagesTable />
        </div>

        {/* Closing CTA */}
        <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl bg-accent px-6 py-12 text-center text-accent-foreground">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            Not sure which package is right for you?
          </h2>
          <p className="max-w-md text-accent-foreground/75">
            Talk to our experts and we&apos;ll help you choose the perfect fit
            for your dream home.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            className="h-auto rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            render={<a href="/#contact" />}
          >
            Get a Free Consultation
          </Button>
        </div>
      </main>
    </div>
  )
}
