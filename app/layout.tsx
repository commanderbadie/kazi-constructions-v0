import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Archivo } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import { LeadPopup } from '@/components/lead-popup'
import { Preloader } from '@/components/preloader'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Kazi Constructions | Build Your Dream Home',
  description:
    'Kazi Constructions delivers premium residential, commercial, and renovation construction services with craftsmanship you can trust.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light ${geistSans.variable} ${archivo.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {/* Fixed, non-repeating marble slab locked to the viewport. Content
            scrolls over this; the marble stays still for a one-slab effect.
            The hero section sits on its own opaque navy background above it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/marble-bg.jpg)" }}
        />
        {/* Soft light veil so text and frosted cards stay readable over the marble. */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-white/35"
        />
        <AuthProvider>
          <Preloader />
          {children}
          <LeadPopup />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
