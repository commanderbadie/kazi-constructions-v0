"use client"

import type { VideoItem } from "@/lib/site-content"

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"

export function AdminPanelVideos({
  value,
  onChange,
}: {
  value: VideoItem[]
  onChange: (next: VideoItem[]) => void
}) {
  function updateVideo(i: number, patch: Partial<VideoItem>) {
    onChange(value.map((v, j) => (j === i ? { ...v, ...patch } : v)))
  }

  function removeVideo(i: number) {
    onChange(value.filter((_, j) => j !== i))
  }

  function addVideo() {
    onChange([...value, { url: "", title: "" }])
  }

  // Extract embed URL from various YouTube URL formats
  function parseYouTubeUrl(raw: string): string {
    const trimmed = raw.trim()
    // Already an embed URL
    if (trimmed.includes("/embed/")) return trimmed
    // Shorts URL
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&]+)/)
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`
    // Standard watch URL
    const watchMatch = trimmed.match(/[?&]v=([^&]+)/)
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
    // youtu.be short link
    const shortMatch = trimmed.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
    return trimmed
  }

  return (
    <section>
      <h2 className="mb-1 font-heading text-xl font-extrabold text-slate-900">
        YouTube Videos
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Manage the videos shown under Featured Projects. Paste any YouTube link
        — it&apos;ll be converted automatically.
      </p>

      <div className="space-y-4">
        {value.map((video, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Video {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeVideo(i)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title
                </span>
                <input
                  className={inputCls}
                  placeholder="e.g. Site Progress Update"
                  value={video.title}
                  onChange={(e) => updateVideo(i, { title: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  YouTube URL
                </span>
                <input
                  className={inputCls}
                  placeholder="Paste any YouTube link here"
                  value={video.url}
                  onChange={(e) =>
                    updateVideo(i, { url: parseYouTubeUrl(e.target.value) })
                  }
                />
              </label>
              {video.url && (
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                  <div className="relative aspect-video w-full max-w-[240px]">
                    <iframe
                      src={video.url}
                      title={video.title || `Video ${i + 1}`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addVideo}
        className="mt-4 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900"
      >
        + Add Video
      </button>
    </section>
  )
}
