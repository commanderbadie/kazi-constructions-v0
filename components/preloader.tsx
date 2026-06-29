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
    const removeTimer = setTimeout(() => setRemoved(true), 2700)

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
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-navy transition-opacity duration-700 ease-out",
        hidden ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <div className="kazi-preloader-logo flex h-28 w-28 items-center justify-center rounded-[26px] bg-white/95 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        <img
          src="/kazi-logo-tick.png"
          alt="Kazi Constructions"
          className="h-[68px] w-[68px] object-contain"
        />
      </div>
      <div className="kazi-loader-track" role="presentation">
        <span className="kazi-loader-bar" />
      </div>
    </div>
  )
}
