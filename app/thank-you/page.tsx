import { Suspense } from "react"
import type { Metadata } from "next"
import { ThankYouNavbar } from "@/components/thank-you-navbar"
import { ThankYouContent } from "@/components/thank-you-content"

export const metadata: Metadata = {
  title: "Thank You | Kazi Constructions",
  description:
    "Thanks for reaching out to Kazi Constructions. Our team will be in touch with you shortly.",
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-accent text-accent-foreground">
      <ThankYouNavbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
              <span className="text-sm text-accent-foreground/60">Loading…</span>
            </div>
          }
        >
          <ThankYouContent />
        </Suspense>
      </main>
    </div>
  )
}
