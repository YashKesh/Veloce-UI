import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://veloceui.codeloomdevv.co.in'
const SITE_NAME = 'Veloce UI'
const DEFAULT_TITLE = 'Veloce UI — Components that move'
const DEFAULT_DESC =
  'Motion-first React 19 component library. 38 primitives, 13 charts, OKLCH-themed, zero runtime, SSR-safe.'
const DEFAULT_OG = `${SITE_URL}/og.png`

export interface SeoProps {
  /** Page-specific title. "Veloce UI" is auto-appended unless appendSiteName is false. */
  title?: string
  description?: string
  /** Override canonical URL. Defaults to the current location (SITE_URL + pathname). */
  canonical?: string
  /** Override OG image URL. */
  image?: string
  appendSiteName?: boolean
  /** Set true to tell crawlers to skip indexing (used for ephemeral pages). */
  noindex?: boolean
}

export function Seo({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_OG,
  appendSiteName = true,
  noindex = false,
}: SeoProps) {
  const { pathname } = useLocation()
  const url = canonical ?? `${SITE_URL}${pathname === '/' ? '' : pathname}`
  const fullTitle = title
    ? appendSiteName
      ? `${title} · ${SITE_NAME}`
      : title
    : DEFAULT_TITLE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
