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

// --- Packages comparison (the /packages page) --------------------------------
// A cell is `true` (included ✓), `false` (not included ✗) or custom text.
export type PackageCellValue = string | boolean

export type PackageRow = {
  label: string
  spec?: string
  // Aligned by index to `packages.tiers`.
  values: PackageCellValue[]
}

export type PackageCategory = {
  name: string
  note?: string
  rows: PackageRow[]
}

export type PackageHomeType = {
  name: string
  startsAt: string
  // Aligned by index to `packages.tiers`.
  perSqft: string[]
}

export type PackagesContent = {
  cities: string[]
  tiers: string[]
  homeTypes: PackageHomeType[]
  categories: PackageCategory[]
}

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
  packages: PackagesContent
  videos: VideoItem[]
}

export type VideoItem = {
  url: string
  title: string
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
      "Kazi Constructions is a trusted construction, contracting, and engineering consultancy firm based in Hyderabad, delivering residential, commercial, and industrial projects with precision, quality, and accountability. Founded and led by Kazi Waheeduddin Siddiqi, M.Tech (Civil), B.Tech (Civil), GHMC Licensed Engineer, and Autodesk Certified Draftsman, every project is personally guided with expert engineering and meticulous attention to detail.",
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
      "At Kazi Constructions, we are committed to delivering quality construction with integrity, precision, and complete transparency. Since 2017, we have been providing trusted construction contracting and engineering consultancy services across Hyderabad, ensuring every project is executed to the highest professional standards.\n\nOur company combines technical expertise with practical experience. As a construction expert, contractor, and consultant, he personally oversees every project, ensuring quality workmanship, structural safety, regulatory compliance, and timely execution.",
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
  packages: {
    cities: ["Hyderabad"],
    tiers: [
      "Basic ( Excl GST )",
      "Classic ( Excl GST )",
      "Premium ( Excl GST )",
      "Royale ( Excl GST )",
    ],
    homeTypes: [
      {
        name: "Homes",
        startsAt: "₹1799 ( Excl GST )",
        perSqft: [
          "₹1799 ( Excl GST )",
          "₹1899 ( Excl GST )",
          "₹2199 ( Excl GST )",
          "₹2599 ( Excl GST )",
        ],
      },
    ],
    categories: [
      {
        name: "Structure",
        note: "*RCC design mix as advised by the structural engineer.",
        rows: [
          {
            label: "Steel",
            spec: "Fe 550 / Fe 550D",
            values: [
              "Shree - ISI-certified",
              "SHREE / JSW - ISI-certified",
              "TATA / JSW",
              "JSW NEOSTEEL/ SAIL",
            ],
          },
          {
            label: "Cement",
            spec: "43 grade in surface, 53 grade in core",
            values: [
              "ZUARI / DALMIA / BHARATHI",
              "ACC / ULTRATECH",
              "ACC / ULTRATECH",
              "ACC / ULTRATECH / RAMCO SUPERCRETE",
            ],
          },
          {
            label: "Aggregates",
            spec: "20mm & 40mm",
            values: [true, true, true, true],
          },
          {
            label: "Block work",
            spec: '9" (outer), 4.5" (inner) – Standard Red Brick',
            values: [true, true, true, true],
          },
          {
            label: "RCC Mix",
            spec: "M20 or M25",
            values: [true, true, "ACC / ULTRATECH", "ACC / ULTRATECH"],
          },
          {
            label: "Ceiling height",
            spec: "Floor-to-floor height 10ft",
            values: [true, true, true, true],
          },
        ],
      },
      {
        name: "KITCHEN",
        note: "All fittings can be customised at cost",
        rows: [
          {
            label: "Ceramic Wall Dado",
            values: [
              "Upto ₹40 per sqft",
              "Upto ₹60 per sqft",
              "Upto ₹80 per sqft",
              "Upto ₹90 per sqft",
            ],
          },
          {
            label: "Sink",
            values: [
              "Upto ₹3000 (Single bowl SS)",
              "Upto ₹6000 (Single bowl SS)",
              "Upto ₹8000 (Futura, Carysil)",
              "Upto ₹8000 (Futura, Carysil)",
            ],
          },
          {
            label: "Sink Faucet",
            values: ["Upto ₹1300", "Upto ₹2000", "Upto ₹3500", "Upto ₹3500"],
          },
          {
            label: "Sink Accessories",
            values: [
              "ISI Marked",
              "Parryware / Hindware / Jaquar",
              "Parryware / Hindware / Jaquar",
              "Parryware / Hindware / Jaquar",
            ],
          },
        ],
      },
      {
        name: "BATHROOM",
        note: "All fittings can be customised at cost",
        rows: [
          {
            label: "Ceramic Wall Dado",
            values: [
              "Upto ₹40 per sqft",
              "Upto ₹60 per sqft",
              "Upto ₹80 per sqft",
              "Upto ₹90 per sqft",
            ],
          },
          {
            label: "Sanitary & CP fittings",
            values: [
              "Upto ₹30,000 per 1000 sqft (Hindware)",
              "Upto ₹50,000 per 1000 sqft (Parryware)",
              "Upto ₹70,000 per 1000 sqft (Jaquar / equivalent)",
              "Upto ₹80,000 per 1000 sqft (Kohler / equivalent)",
            ],
          },
          {
            label: "CPVC Pipe",
            values: [
              "Prince / Astral",
              "Ashirwad / Astral",
              "Apollo / Supreme / Equivalent",
              "Apollo / Supreme / Equivalent",
            ],
          },
          {
            label: "Bathroom doors",
            spec: "Waterproof flush doors or WPC",
            values: [true, true, true, true],
          },
          {
            label: "Bathroom Accessories",
            values: [
              false,
              false,
              "Mirror, Soap dish, Towel rail - worth of ₹7,000 per 1000 sqft",
              "Mirror, Soap dish, Towel rail - worth of ₹9,000 per 1000 sqft",
            ],
          },
          {
            label: "Provision for Solar water heater",
            values: [false, false, true, true],
          },
        ],
      },
      {
        name: "DOORS & WINDOWS",
        rows: [
          {
            label: "Main Door",
            values: [
              "Flush doors with veneer & frame with salwood upto ₹20,000 including accessories",
              "Teak door & Teak frame upto ₹30,000 including accessories",
              "Teak door & Teak frame upto ₹40,000 including accessories",
              "Teak door & Teak frame upto ₹50,000 including accessories",
            ],
          },
          {
            label: "Internal Doors",
            values: [
              "Membrane / Flush door with laminates upto ₹9,000",
              "Membrane / Flush door with laminates upto ₹9,000",
              "Membrane / Flush door with laminates upto ₹12,000",
              "Membrane / Flush door with laminates upto ₹13,000",
            ],
          },
          {
            label: "Windows",
            spec: "3 Track with 1 Mesh",
            values: [
              "Aluminium windows ₹400 per sqft of Jindal Profiles",
              "UPVC windows ₹575 per sqft of Atlas / Green fourtune / Greentech",
              "UPVC windows ₹750 per sqft of NCL Veka / Prominance / V-tech",
              "UPVC windows ₹1400 per sqft of NCL Veka / Wintech / Karthik UPVC / Simta Astrix",
            ],
          },
          {
            label: "Window grills",
            spec: "Basic design MS Grill ₹180 per sqft",
            values: [true, true, true, true],
          },
        ],
      },
      {
        name: "PAINTING",
        rows: [
          {
            label:
              "Interior Painting (Asian Paints) JK Putty + Primer + Emulsion Paint",
            values: [
              "Tractor Emulsion",
              "Tractor Shyne Emulsion",
              "Apcolite Premium Emulsion",
              "Royale Luxury Emulsion",
            ],
          },
          {
            label: "Exterior Painting (Asian Paints) Primer + Exterior Emulsion",
            values: [
              "Ace Exterior Emulsion",
              "Apex Exterior Emulsion",
              "Apex Exterior Emulsion",
              "Apex Ultima Exterior Emulsion",
            ],
          },
        ],
      },
      {
        name: "FLOORING",
        note: "Laying charges will vary for marble, tiles and granite",
        rows: [
          {
            label: "Living & Dining Flooring",
            values: [
              "Tiles / Granite upto ₹50 per sqft",
              "Tiles / Granite upto ₹100 per sqft",
              "Tiles / Granite / Marble upto ₹140 per sqft",
              "Tiles / Granite / Marble upto ₹160 per sqft",
            ],
          },
          {
            label: "Rooms and Kitchen Flooring",
            values: [
              "Tiles / Granite upto ₹50 per sqft",
              "Tiles / Granite upto ₹80 per sqft",
              "Tiles / Granite upto ₹120 per sqft",
              "Tiles / Granite upto ₹140 per sqft",
            ],
          },
          {
            label: "Balcony and Open Area",
            spec: "Anti Skid",
            values: [
              "Tiles upto ₹40 per sqft",
              "Tiles upto ₹60 per sqft",
              "Tiles upto ₹80 per sqft",
              "Tiles upto ₹90 per sqft",
            ],
          },
          {
            label: "Staircase",
            spec: "Sadarahalli Granite",
            values: [
              "Upto ₹70 per sqft",
              "Upto ₹80 per sqft",
              "Upto ₹110 per sqft",
              "Upto ₹140 per sqft",
            ],
          },
          {
            label: "Parking",
            values: [
              "Tiles upto ₹40 per sqft",
              "Tiles upto ₹50 per sqft",
              "Tiles upto ₹70 per sqft",
              "Tiles upto ₹70 per sqft",
            ],
          },
        ],
      },
      {
        name: "WIRING",
        rows: [
          {
            label: "Fireproof Wiring",
            values: [
              "Finolex / Anchor / Havells",
              "Finolex / Anchor / Havells",
              "Finolex / Anchor / Havells",
              "Finolex / Anchor / Havells",
            ],
          },
          {
            label: "Switch",
            values: [
              "Great white / Anchor",
              "Roma / Havells Fabio",
              "Legrand mylinc / Havells Coral / Roma",
              "Schneider unica pure / legrand myrius / Jaquar",
            ],
          },
          {
            label: "Provision for UPS Wiring",
            values: [false, true, true, true],
          },
          {
            label: "EV Charging point at Ground Floor",
            values: [false, false, false, true],
          },
        ],
      },
      {
        name: "OTHERS",
        rows: [
          {
            label: "Overhead tank",
            spec: "Double layered tank of Apollo / equivalent make",
            values: [
              "1000 Ltrs. of Duratank make",
              "1500 Ltrs. of Duratank make",
              "2000 Ltrs. of Sintex / Apollo",
              "2000 Ltrs. of Sintex / Apollo",
            ],
          },
          {
            label: "Underground sump",
            values: ["4000 Ltrs.", "6000 Ltrs.", "7000 Ltrs.", "8000 Ltrs."],
          },
          {
            label: "Staircase railing",
            values: [
              "MS Railing",
              "MS Railing",
              "SS 304 grade Railing",
              "SS 304 grade Railing with glass",
            ],
          },
          {
            label: "Copper Gas Connection",
            values: [
              false,
              false,
              false,
              "1 no. per dwelling unit of 1500 sqft of package area",
            ],
          },
        ],
      },
    ],
  },
  videos: [
    { url: "https://www.youtube.com/embed/Q9NAa51zVyE", title: "Kazi Constructions — Site Progress" },
    { url: "https://www.youtube.com/embed/bd--1OCS8kM", title: "Kazi Constructions — On Site" },
  ],
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
