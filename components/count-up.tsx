"use client"

import { useEffect, useRef, useState } from "react"

interface CountUpProps {
  end: number
  /** Animation duration in milliseconds */
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true

            const prefersReduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches
            if (prefersReduced) {
              setValue(end)
              observer.unobserve(entry.target)
              return
            }

            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              // easeOutExpo for a snappy, premium settle
              const eased =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
              setValue(Math.round(eased * end))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
