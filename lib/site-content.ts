// Single source of truth for editable site content.
//
// The public site reads from here (via the useSiteContent hook), and the
// /admin panel edits a copy that is stored in the browser. This keeps the
// project front-end only — no backend or database required. To publish edits
// for all visitors, export the JSON from /admin and commit it into this file
// (or wire up a backend later).

export type Stat = { value: string; label: string }
export type Counter = { end: number; suffix: string; label: string }

export type ServiceIcon =
  | "home"
  | "building"
  | "hammer"
  | "paintbrush"
  | "cone"
  | "compass"

export type Service = {
  icon: ServiceIcon
  title: string
  description: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
}

export type ProjectGallery = "interior" | "circulation" | "none"

export type Project = {
  category: string
  description: string
  image: string
  gallery: ProjectGallery
}

export type Faq = { label: string; answer: string }

export type PopupBadgeIcon =
  | "shield"
  | "medal"
  | "smile"
  | "star"
  | "clock"
  | "check"
export type PopupBadge = { icon: PopupBadgeIcon; value: string; label: string }

export type SiteContent = {
  company: {
    name: string
    tagline: string
    footerBlurb: string
  }
  contact: {
    phoneDisplay: string
    phoneRaw: string // used in tel: links
    whatsappNumber: string // digits only, used in wa.me links
    whatsappMessage: string
    email: string
    addressLine1: string
    addressLine2: string
    shortAddress: string
    mapAddress: string
    officeHoursWeekday: string
    officeHoursSaturday: string
    instagramUrl: string
    linkedinUrl: string
  }
  hero: {
    badge: string
    titleLine1: string
    titleHighlight: string
    paragraph: string
    stats: Stat[]
  }
  about: {
    label: string
    heading: string
    body: string
    mission: string
    vision: string
    highlights: string[]
    counters: Counter[]
  }
  services: Service[]
  testimonials: Testimonial[]
  projects: Project[]
  faqs: Faq[]
  popup: {
    title: string
    subtitle: string
    badges: PopupBadge[]
  }
}

export const STORAGE_KEY = "kazi-site-content-v1"

export const defaultContent: SiteContent = {
  company: {
    name: "Kazi Constructions",
    tagline: "Architects · Engineers · Consultants",
    footerBlurb:
      "Building landmarks of enduring excellence since 2018. Architecture, engineering and luxury construction under one accountable roof.",
  },
  contact: {
    phoneDisplay: "+91 88019 58508",
    phoneRaw: "+918801958508",
    whatsappNumber: "918801958508",
    whatsappMessage:
      "Hello Kazi Constructions! I'd like to enquire about your construction services.",
    email: "kaziwaheeduddinsiddiqi@gmail.com",
    addressLine1: "4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar",
    addressLine2: "Rajendra Nagar, Attapure, Hyderabad – 500052",
    shortAddress: "4-25-2/3/3, Suleman Nagar, Rajendra Nagar, Hyderabad",
    mapAddress:
      "KAZI CONSTRUCTIONS, Suleman Nagar, Chintalmet, Hyderabad, Telangana 500052",
    officeHoursWeekday: "Mon–Fri: 9:00am – 5:00pm",
    officeHoursSaturday: "Sat: 10:00am – 1:00pm",
    instagramUrl: "https://instagram.com/kazi_constructions",
    linkedinUrl:
      "https://www.linkedin.com/in/kazi-waheeduddin-siddiqi-1a4569138",
  },
  hero: {
    badge: "Architects · Engineers · Consultants",
    titleLine1: "Build Your",
    titleHighlight: "Dream Home",
    paragraph:
      "Kazi Constructions delivers residential, commercial, and industrial projects with precision engineering, transparent costing, and uncompromising craftsmanship across Hyderabad.",
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "25+", label: "Projects Delivered" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "1-on-1", label: "Project Consultation" },
    ],
  },
  about: {
    label: "About Kazi Constructions",
    heading: "Our Commitment",
    body:
      "At Kazi Constructions, we believe in quality, transparency, and trust. Every project we undertake is a reflection of our engineering excellence and architectural creativity — built to last and designed to inspire. Led by Kazi Waheeduddin Siddiqi, B.Tech (Civil), M.Tech (Civil), GHMC Licensed Engineer and Autodesk Certified Draftsman.",
    mission:
      "To craft durable, sustainable structures that empower communities and elevate the way people live and work.",
    vision:
      "To be the region's most trusted construction partner, known for innovation, integrity, and exceptional quality.",
    highlights: [
      "Licensed, bonded, and fully insured",
      "On-time and on-budget delivery",
      "Sustainable, quality-first materials",
      "Dedicated project managers",
    ],
    counters: [
      { end: 10, suffix: "+", label: "Years of Experience" },
      { end: 49, suffix: "+", label: "Completed Projects" },
      { end: 141, suffix: "+", label: "Happy Clients" },
      { end: 5, suffix: "", label: "Ongoing Projects" },
    ],
  },
  services: [
    {
      icon: "home",
      title: "Residential Construction",
      description:
        "Custom homes, villas, and apartments built with precision craftsmanship and lasting quality.",
    },
    {
      icon: "building",
      title: "Commercial Construction",
      description:
        "Offices, retail, and mixed-use developments engineered for performance and durability.",
    },
    {
      icon: "hammer",
      title: "Renovation & Remodeling",
      description:
        "Transform existing spaces with structural upgrades, modern remodels, and restorations.",
    },
    {
      icon: "paintbrush",
      title: "Interior & Exterior Works",
      description:
        "Complete finishing, facade, and interior fit-outs that bring every space to life.",
    },
    {
      icon: "cone",
      title: "Infrastructure Projects",
      description:
        "Roads, drainage, and large-scale civil works delivered to exacting engineering standards.",
    },
    {
      icon: "compass",
      title: "Engineering Consultancy",
      description:
        "Expert civil and structural analysis, design, and certification you can rely on.",
    },
  ],
  testimonials: [
    {
      quote:
        "Kazi delivered our headquarters ahead of schedule and beyond our expectations. Their engineering discipline is exceptional.",
      name: "Elena Vasquez",
      role: "Private Client",
      initials: "EV",
    },
    {
      quote:
        "From design to handover, every promise was kept. The craftsmanship in our estate is simply unmatched.",
      name: "James Whitlock",
      role: "Private Client",
      initials: "JW",
    },
    {
      quote:
        "A rare partner that combines luxury finish with serious civil engineering capability. We trust them completely.",
      name: "Dr. Amara Okoye",
      role: "Private Client",
      initials: "AO",
    },
  ],
  projects: [
    {
      category: "Residential",
      description:
        "A close-up look at our residential work — on-site construction progress, interiors and finished living spaces.",
      image: "/gallery/circulation/circulation-1.jpg",
      gallery: "circulation",
    },
    {
      category: "Commercial",
      description:
        "Commercial builds — office towers and workspaces with structural steel and energy-efficient facades.",
      image: "/projects/commercial-tower.svg",
      gallery: "none",
    },
    {
      category: "Renovation",
      description:
        "Renovation & retrofit work — structural strengthening and full interior remodels that transform existing spaces.",
      image: "/projects/renovation-loft.svg",
      gallery: "none",
    },
    {
      category: "Commercial",
      description:
        "Retail, dining and mixed-use developments delivered on schedule with full site coordination.",
      image: "/projects/retail-plaza.svg",
      gallery: "none",
    },
    {
      category: "Interior",
      description:
        "Interior fit-outs — modular kitchens, custom joinery, dressing units and premium finishes.",
      image: "/gallery/interior/interior-1.jpg",
      gallery: "interior",
    },
  ],
  faqs: [
    {
      label: "What services do you offer?",
      answer:
        "We handle residential & commercial construction, turnkey design-build, renovation & remodeling, industrial & warehouse builds, architectural design, project management, and civil/structural consultancy.",
    },
    {
      label: "How do I get a quote?",
      answer:
        "Fill out the 'Get in touch' form in our Contact section with your project details, or message us on WhatsApp — we'll reply with a free, no-obligation quote.",
    },
    {
      label: "How can I contact you?",
      answer:
        "Call us at +91 8801958508, email kaziwaheeduddinsiddiqi@gmail.com, or find us on Instagram @kazi_constructions. We're based in Rajendra Nagar, Hyderabad.",
    },
    {
      label: "Where are you located?",
      answer:
        "4-25-2/3/3, Wadi-E-Mahmood, Suleman Nagar, Rajendra Nagar, PVNR Pillar No.242, Hyderabad - 500052.",
    },
  ],
  popup: {
    title:
      "Don't leave yet! Resolve your queries with our construction expert",
    subtitle: "Trusted Builders for End-to-End Home Construction",
    badges: [
      { icon: "shield", value: "Licensed", label: "GHMC Certified" },
      { icon: "medal", value: "10+ Years", label: "Experience" },
      { icon: "smile", value: "140+", label: "Happy Clients" },
    ],
  },
}

// Image options the admin can choose from for project covers. These are files
// that already exist in /public, so no upload (backend) is required.
export const galleryLengths: Record<Exclude<ProjectGallery, "none">, number> = {
  interior: 11,
  circulation: 9,
}

export function buildGallery(kind: ProjectGallery): string[] {
  if (kind === "none") return []
  const length = galleryLengths[kind]
  return Array.from(
    { length },
    (_, i) => `/gallery/${kind}/${kind}-${i + 1}.jpg`,
  )
}
