import { SiteNavbar } from "@/components/site-navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { PackagesSection } from "@/components/packages-section"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import { SectionDivider } from "@/components/section-divider"
import { FloatingWidgets } from "@/components/floating-widgets"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main>
        <HeroSection />
        <SectionDivider />
        <AboutSection />
        <ProcessSection />
        <TestimonialsSection />
        <SectionDivider />
        <ServicesSection />
        <SectionDivider />
        <ProjectsSection />
        <SectionDivider />
        <PackagesSection />
        <SectionDivider />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingWidgets />
    </div>
  )
}
