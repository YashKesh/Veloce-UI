import { useEffect, useState } from 'react'

const CACHE_KEY = 'vl:gh-stars'
const TTL_MS = 10 * 60 * 1000 // 10 minutes — plenty for one session, well under GitHub's 60/hr unauth limit

interface Cached {
  owner: string
  repo: string
  stars: number
  at: number
}

export interface GithubStarsResult {
  stars: number | null
  loading: boolean
  formatted: string | null
}

function readCache(owner: string, repo: string): number | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as Cached
    if (c.owner !== owner || c.repo !== repo) return null
    if (Date.now() - c.at > TTL_MS) return null
    return c.stars
  } catch {
    return null
  }
}

function writeCache(owner: string, repo: string, stars: number) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ owner, repo, stars, at: Date.now() } satisfies Cached))
  } catch {
    /* storage disabled — ignore */
  }
}

export function formatStars(n: number): string {
  if (n < 1000) return String(n)
  if (n < 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${Math.round(n / 1000)}k`
}

/**
 * useGithubStars — fetches the public star count for a GitHub repo once per session.
 * SSR-safe (noop on the server). Falls back to `null` on 404 / rate-limit / network error
 * so callers can hide the number cleanly.
 */
export function useGithubStars(owner: string, repo: string): GithubStarsResult {
  const [stars, setStars] = useState<number | null>(() => readCache(owner, repo))
  const [loading, setLoading] = useState<boolean>(stars === null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cached = readCache(owner, repo)
    if (cached !== null) {
      setStars(cached)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { stargazers_count?: number }) => {
        if (cancelled) return
        const s = typeof data.stargazers_count === 'number' ? data.stargazers_count : null
        if (s !== null) writeCache(owner, repo, s)
        setStars(s)
      })
      .catch(() => {
        if (cancelled) return
        setStars(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [owner, repo])

  return {
    stars,
    loading,
    formatted: stars === null ? null : formatStars(stars),
  }
}
