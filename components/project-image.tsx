"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProjectImageProps {
  src: string
  alt: string
}

export function ProjectImage({ src, alt }: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={cn(
        "aspect-[4/3] w-full object-cover transition-all duration-700 ease-out group-hover:scale-110",
        loaded ? "scale-100 blur-0" : "scale-105 blur-xl",
      )}
    />
  )
}
