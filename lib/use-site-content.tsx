"use client"

import { useEffect, useState } from "react"
import {
  STORAGE_KEY,
  defaultContent,
  type SiteContent,
} from "@/lib/site-content"

const CHANGE_EVENT = "kazi-site-content-change"

// Deep-merge a (possibly partial / older-schema) stored object on top of the
// defaults so missing keys always fall back to a sensible value.
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    // Arrays and primitives: take the override when it exists.
    return (override === undefined ? base : (override as T))
  }
  const result: Record<string, unknown> = { ...base }
  for (const key of Object.keys(base)) {
    result[key] = deepMerge(
      (base as Record<string, unknown>)[key],
      (override as Record<string, unknown>)[key],
    )
  }
  return result as T
}

export function readStoredContent(): SiteContent {
  if (typeof window === "undefined") return defaultContent
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultContent
    const parsed = JSON.parse(raw)
    return deepMerge(defaultContent, parsed)
  } catch {
    return defaultContent
  }
}

export function saveContent(content: SiteContent) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function resetContent() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function exportContentJson(content: SiteContent): string {
  return JSON.stringify(content, null, 2)
}

export function importContentJson(json: string): SiteContent {
  const parsed = JSON.parse(json)
  return deepMerge(defaultContent, parsed)
}

/**
 * Returns the current site content.
 *
 * SSR-safe: the first render (server + client) returns the defaults so the
 * markup matches and there is no hydration mismatch. After mount, any edits
 * saved to localStorage are overlaid, and the value stays in sync across tabs
 * and with the admin panel via a custom event + the storage event.
 */
export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(defaultContent)

  useEffect(() => {
    setContent(readStoredContent())

    const sync = () => setContent(readStoredContent())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  return content
}
