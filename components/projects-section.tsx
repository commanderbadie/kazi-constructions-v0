"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { ProjectImage } from "@/components/project-image"
import { cn } from "@/lib/utils"
import { useSiteContent } from "@/lib/use-site-content"
import { buildGallery } from "@/lib/site-content"

type Project = {
  title?: string
  category: string
  location?: string
  description: string
  image: string
  gallery?: string[]
  videos?: string[]
}

export function ProjectsSection() {
  const content = useSiteContent()
  const projects: Project[] = useMemo(
    () =>
      content.projects.map((p) => {
        const gallery = buildGallery(p.gallery)
        // Load videos for projects that have them
        const videos: string[] = []
        if (p.gallery === "tolichowki-300") {
          videos.push(
            "/gallery/tolichowki-300/video-1.mp4",
            "/gallery/tolichowki-300/video-2.mp4",
            "/gallery/tolichowki-300/video-3.mp4",
          )
        }
        if (p.gallery === "jalpally") {
          videos.push(
            "/gallery/jalpally/video-1.mp4",
            "/gallery/jalpally/video-2.mp4",
          )
        }
        if (p.gallery === "tolichowki-200") {
          videos.push(
            "/gallery/tolichowki-200/video-1.mp4",
          )
        }
        if (p.gallery === "noorkhan-bazar") {
          videos.push(
            "/gallery/noorkhan-bazar/video-1.mp4",
            "/gallery/noorkhan-bazar/video-2.mp4",
          )
        }
        if (p.gallery === "attapur-masjid") {
          videos.push(
            "/gallery/attapur-masjid/video-1.mp4",
            "/gallery/attapur-masjid/video-2.mp4",
          )
        }
        return {
          category: p.category,
          description: p.description,
          image: p.image,
          gallery: gallery.length ? gallery : undefined,
          videos: videos.length ? videos : undefined,
        }
      }),
    [content.projects],
  )

  const [activeFilter, setActiveFilter] = useState("All")
  const [galleryProject, setGalleryProject] = useState<Project | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filters = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  )

  const visibleProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [activeFilter, projects],
  )

  const galleryImages = galleryProject?.gallery ?? []
  const galleryVideos = galleryProject?.videos ?? []

  useEffect(() => {
    if (!galleryProject) return

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox !== null) setLightbox(null)
        else setGalleryProject(null)
      }
      if (lightbox !== null) {
        if (e.key === "ArrowRight")
          setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length))
        if (e.key === "ArrowLeft")
          setLightbox((i) =>
            i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length,
          )
      }
    }

    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [galleryProject, lightbox, galleryImages.length])

  function closeGallery() {
    setLightbox(null)
    setGalleryProject(null)
  }

  return (
    <section id="projects" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our portfolio
            </span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">
            A selection of recent builds showcasing our range, quality, and
            attention to detail.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors",
                activeFilter === filter
                  ? "bg-navy text-white shadow-sm"
                  : "border border-border text-muted-foreground hover:border-navy/40 hover:text-foreground",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => {
              const hasGallery = !!project.gallery?.length
              return (
                <article
                  key={project.image}
                  className="group h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
                >
                  <button
                    type="button"
                    onClick={() => hasGallery && setGalleryProject(project)}
                    aria-label={
                      hasGallery
                        ? `View ${project.title ?? project.category} gallery`
                        : project.title ?? project.category
                    }
                    className={cn(
                      "relative block w-full overflow-hidden text-left",
                      hasGallery ? "cursor-pointer" : "cursor-default",
                    )}
                  >
                    <ProjectImage src={project.image} alt={project.title ?? project.category} />
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
                      {project.category}
                    </span>
                    {hasGallery && (
                      <span className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all duration-300 group-hover:bg-navy/55 group-hover:opacity-100">
                        <span className="rounded-full border border-gold bg-navy/70 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gold">
                          View Gallery ({project.gallery!.length})
                        </span>
                      </span>
                    )}
                  </button>
                  <div className="p-6">
                    {project.title && (
                      <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
                        {project.title}
                      </h3>
                    )}
                    {project.location && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {project.location}
                      </p>
                    )}
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground",
                        (project.title || project.location) && "mt-3",
                      )}
                    >
                      {project.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </Reveal>

        {/* YouTube Videos */}
        <Reveal className="mt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                Watch us build
              </span>
              <h3 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                From our site
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Real footage from our construction sites — see the quality and progress firsthand.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.videos.map((video, i) => (
              <div key={video.url + i} className="overflow-hidden rounded-xl border-2 border-navy bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[9/16] w-full">
                  <iframe
                    src={video.url}
                    title={video.title || `Video ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
            {content.videos.length < 3 && (
              <div className="hidden overflow-hidden rounded-xl border-2 border-dashed border-navy bg-muted/30 lg:flex lg:items-center lg:justify-center">
                <div className="p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gold">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-muted-foreground">More coming soon</p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Gallery modal */}
      {galleryProject && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy/70 p-4 backdrop-blur-md duration-300 animate-in fade-in-0 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${galleryProject.title} gallery`}
          onClick={closeGallery}
        >
          <div
            className="relative my-auto w-full max-w-5xl rounded-2xl border border-gold/20 bg-card p-6 shadow-2xl duration-300 animate-in fade-in-0 zoom-in-95 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  {galleryProject.category}
                </span>
                <h3 className="mt-1 font-heading text-2xl font-extrabold text-foreground">
                  {galleryProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeGallery}
                aria-label="Close gallery"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galleryImages.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(index)}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className="group/item relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-gold shadow-md duration-500 animate-in fade-in-0 zoom-in-95 fill-mode-both focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={`Open image ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`${galleryProject.title} — photo ${index + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/item:scale-110"
                  />
                </button>
              ))}
            </div>

            {/* Videos */}
            {galleryVideos.length > 0 && (
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  Videos
                </span>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryVideos.map((src, index) => (
                    <div
                      key={src}
                      className="overflow-hidden rounded-xl border-2 border-navy shadow-md"
                      style={{ animationDelay: `${(galleryImages.length + index) * 45}ms` }}
                    >
                      <video
                        src={src}
                        controls
                        preload="metadata"
                        className="aspect-[9/16] w-full bg-black object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Single-image lightbox */}
      {galleryProject && lightbox !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md duration-200 animate-in fade-in-0"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) =>
                i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length,
              )
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <img
            src={galleryImages[lightbox]}
            alt={`${galleryProject.title} — enlarged photo`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg border-2 border-gold object-contain shadow-2xl duration-300 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) => (i === null ? i : (i + 1) % galleryImages.length))
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            {lightbox + 1} / {galleryImages.length}
          </span>
        </div>
      )}
    </section>
  )
}
