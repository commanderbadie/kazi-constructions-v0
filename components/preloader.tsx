"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Preloader() {
  const [hidden, setHidden] = useState(false)
  const [removed, setRemoved] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const hideTimer = setTimeout(() => {
      setHidden(true)
      document.body.style.overflow = ""
    }, 2000)
    const removeTimer = setTimeout(() => setRemoved(true), 2950)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
      document.body.style.overflow = ""
    }
  }, [])

  if (removed) return null

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden
          ? "pointer-events-none scale-110 opacity-0 blur-2xl"
          : "scale-100 opacity-100 blur-0",
      )}
    >
      <div className="relative flex h-28 w-28 items-center justify-center rounded-[26px] bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm">
        <span className="pointer-events-none absolute -inset-6 rounded-full bg-primary/20 blur-3xl" />
        <img
          src="/kazi-logo-transparent.png"
          alt="Kazi Constructions"
          className="kazi-preloader-logo relative h-[72px] w-[72px] object-contain"
        />
      </div>
      <div className="kazi-loader-track" role="presentation">
        <span className="kazi-loader-bar" />
      </div>
    </div>
  )
}
