"use client"

import { useSearchParams } from "next/navigation"
import { ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteContent } from "@/lib/use-site-content"

const DEFAULT_MESSAGE =
  "Thank you for filling in your details. Our team will get in touch with you shortly."

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.215zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export function ThankYouContent() {
  const params = useSearchParams()
  const { contact } = useSiteContent()

  const message = params.get("message") || DEFAULT_MESSAGE
  const name = params.get("name")?.trim() || ""
  const firstName = name.split(/\s+/)[0] || ""
  const phone = params.get("phone")?.trim() || ""
  const city = params.get("city")?.trim() || ""

  const summaryBits = [phone, city].filter(Boolean)

  const whatsappHref = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    contact.whatsappMessage,
  )}`

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* Faint blueprint backdrop for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
        style={{
          backgroundImage: "url(/blueprint-grid.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* Animated gold success check */}
        <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
          <span
            aria-hidden="true"
            className="kazi-success-ring absolute inset-0 rounded-full border border-gold/50"
          />
          <span className="kazi-success-icon flex h-24 w-24 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-11 w-11 text-gold"
              aria-hidden="true"
            >
              <path className="kazi-check-path" d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        </div>

        <span
          className="animate-fade-blur inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold"
          style={{ animationDelay: "0.1s" }}
        >
          Request Received
        </span>

        <h1
          className="animate-fade-blur mt-6 font-heading text-4xl font-extrabold uppercase leading-[1] tracking-tight text-accent-foreground sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.2s" }}
        >
          Thank You{firstName ? `, ${firstName}` : ""}!
        </h1>

        <p
          className="animate-fade-blur mt-5 max-w-xl text-lg leading-relaxed text-accent-foreground/75"
          style={{ animationDelay: "0.35s" }}
        >
          {message}
        </p>

        {summaryBits.length > 0 && (
          <p
            className="animate-fade-blur mt-5 text-sm font-medium text-accent-foreground/60"
            style={{ animationDelay: "0.45s" }}
          >
            We&apos;ll reach out to you
            {phone ? (
              <>
                {" "}
                at <span className="font-semibold text-gold">{phone}</span>
              </>
            ) : null}
            {city ? (
              <>
                {" "}
                <span className="text-accent-foreground/40">·</span>{" "}
                <span className="font-semibold text-accent-foreground/80">
                  {city}
                </span>
              </>
            ) : null}
          </p>
        )}

        <div
          className="animate-fade-blur mt-9 flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.6s" }}
        >
          <Button
            size="lg"
            nativeButton={false}
            className="h-auto rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            render={<a href="/" />}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            className="h-auto rounded-full border-accent-foreground/40 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
            render={<a href={`tel:${contact.phoneRaw}`} />}
          >
            <Phone className="h-4 w-4" />
            Call Us
          </Button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-auto items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#1ebe57]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
