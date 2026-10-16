// After `vite build`, this script writes dist/<path>/index.html for every route
// in route-meta.mjs, substituting title, description, canonical, OG + Twitter
// tags, and the SEO shell inside <div id="root"> with route-specific content.
// Vercel serves these static files first; the SPA takes over on hydrate.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROUTE_META } from './route-meta.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = join(here, '..', 'dist')
const templatePath = join(distDir, 'index.html')
const SITE = 'https://veloceui.codeloomdevv.co.in'
const OG = `${SITE}/og.png`

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const template = readFileSync(templatePath, 'utf8')

/* ─── SEO helpers ─────────────────────────────────────────────────────────── */

const BASE_KEYWORDS = ['react', 'typescript', 'open source', 'veloce ui']

/** Derive a tight, non-stuffed keyword list for a route. */
function keywordsFor(path, meta) {
  const kw = new Set(BASE_KEYWORDS)
  if (path === '/') {
    ;['react component library', 'react 19', 'motion ui', 'chart library', 'OKLCH', 'shadcn alternative', 'design system'].forEach((k) => kw.add(k))
  } else if (path === '/components') {
    ;['react components', 'ui library', 'headless components', 'component library', 'react 19 ui'].forEach((k) => kw.add(k))
  } else if (path === '/charts') {
    ;['react charts', 'data visualization', 'SVG charts', 'dashboard charts', 'chart components'].forEach((k) => kw.add(k))
  } else if (path.startsWith('/components/')) {
    const slug = path.replace('/components/', '').replace(/\//g, ' ')
    const slugWords = slug.replace(/-/g, ' ')
    ;[`${slugWords} react`, `react ${slugWords}`, `${slugWords} component`, 'ui component', 'component library'].forEach((k) => kw.add(k))
  } else if (path.startsWith('/docs/charts/')) {
    const slug = path.replace('/docs/charts/', '').replace(/-/g, ' ')
    ;[`${slug} chart`, `react ${slug} chart`, `SVG ${slug} chart`, 'chart component', 'data visualization'].forEach((k) => kw.add(k))
  } else if (path.startsWith('/dashboards')) {
    ;['react dashboard', 'dashboard template', 'SaaS dashboard', 'admin template', 'dashboard blueprint'].forEach((k) => kw.add(k))
  } else if (path.startsWith('/docs/')) {
    ;['react documentation', 'guide', 'how to', 'getting started'].forEach((k) => kw.add(k))
  }
  return Array.from(kw).join(', ')
}

/** Build an array of {name, item} breadcrumb entries for a route. */
function breadcrumbsFor(path, meta) {
  const crumbs = [{ name: 'Home', item: `${SITE}/` }]
  if (path === '/') return crumbs
  const parts = path.split('/').filter(Boolean)
  const label = (seg) =>
    seg
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ')
  // Known hub mappings. Chart docs live under /docs/charts/* but belong to the
  // Charts hub conceptually.
  if (parts[0] === 'docs' && parts[1] === 'charts') {
    crumbs.push({ name: 'Charts', item: `${SITE}/charts` })
  } else {
    const HUBS = {
      components: ['Components', '/components'],
      charts: ['Charts', '/charts'],
      docs: ['Docs', '/docs/installation'],
      dashboards: ['Dashboards', '/dashboards'],
    }
    if (HUBS[parts[0]]) {
      const [hubLabel, url] = HUBS[parts[0]]
      crumbs.push({ name: hubLabel, item: `${SITE}${url}` })
    }
  }
  // Final crumb = the current page name.
  const leaf = meta.h1 ?? label(parts[parts.length - 1] || 'Home')
  crumbs.push({ name: leaf, item: `${SITE}${path}` })
  return crumbs
}

function jsonLdFor(path, meta, canonical) {
  const graph = []
  // BreadcrumbList on every non-home route.
  if (path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbsFor(path, meta).map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    })
  }
  // WebPage anchor so canonical / isPartOf is explicit.
  graph.push({
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'en',
  })
  return `{"@context":"https://schema.org","@graph":${JSON.stringify(graph)}}`
}

function render(meta, canonical, path) {
  const title = esc(meta.title)
  const desc = esc(meta.description)
  const h1 = esc(meta.h1 ?? meta.title)
  const summary = esc(meta.summary ?? meta.description)
  const can = canonical
  const keywords = esc(keywordsFor(path, meta))
  const jsonLd = jsonLdFor(path, meta, canonical)

  const shell = `
      <main style="max-width: 760px; margin: 40px auto; padding: 24px; font-family: system-ui, sans-serif; color: #cbd5e1; background: #121128;">
        <h1 style="font-size: 44px; font-weight: 650; letter-spacing: -0.02em; margin: 0 0 12px; color: #f8fafc;">${h1}</h1>
        <p style="font-size: 18px; line-height: 1.5;">${summary}</p>
        <p style="font-family: ui-monospace, monospace; font-size: 14px; opacity: 0.8;">npm i veloce-ui</p>
        <nav aria-label="Primary">
          <a href="/components" style="color: #a78bfa;">Components</a> ·
          <a href="/charts" style="color: #a78bfa;">Charts</a> ·
          <a href="/docs/installation" style="color: #a78bfa;">Install</a> ·
          <a href="/docs/usage" style="color: #a78bfa;">Usage</a> ·
          <a href="https://github.com/YashKesh/Veloce-UI" style="color: #a78bfa;">GitHub</a>
        </nav>
      </main>`

  return template
    // <title>
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${title}</title>`,
    )
    // <meta name="description">
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${desc}" />`,
    )
    // <link rel="canonical">
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?\s*>/,
      `<link rel="canonical" href="${esc(can)}" />`,
    )
    // Open Graph
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:description" content="${desc}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:url" content="${esc(can)}" />`,
    )
    .replace(
      /<meta property="og:image" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:image" content="${OG}" />`,
    )
    // Twitter
    .replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="twitter:description" content="${desc}" />`,
    )
    // Keywords (per-route; largely ignored by Google but harmless for other engines)
    .replace(
      /<meta name="keywords" content="[^"]*"\s*\/?\s*>/,
      `<meta name="keywords" content="${keywords}" />`,
    )
    // Per-route JSON-LD injected before </head>, right after the global graph.
    .replace(
      /(<\/head>)/,
      `    <script type="application/ld+json">${jsonLd}</script>\n  $1`,
    )
    // Replace the ENTIRE #root content with the route-specific shell.
    // The pattern matches from <div id="root"> up to the closing </div>
    // that sits before </body>. Vite builds have no <script> immediately
    // after #root (assets are injected into <head>) so we anchor on </body>.
    .replace(
      /<div id="root">[\s\S]*?<\/div>(\s*<\/body>)/,
      `<div id="root">${shell}\n    </div>$1`,
    )
}

let written = 0
let skipped = 0
for (const [path, meta] of Object.entries(ROUTE_META)) {
  const canonical = `${SITE}${path === '/' ? '' : path}`
  const html = render(meta, canonical, path)
  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  written++
}
console.log(`[prerender-routes] wrote ${written} HTML files (${skipped} skipped)`)

/* ─── Sitemap ───────────────────────────────────────────────────────────────
 * Also regenerate public/sitemap.xml from the same route list so SEO stays
 * in sync with the router. Keeps lastmod aligned with today's build date.
 */
const today = new Date().toISOString().slice(0, 10)
const publicDir = join(here, '..', 'public')
const priorityFor = (path) => {
  if (path === '/') return '1.0'
  if (path === '/components' || path === '/charts') return '0.9'
  if (path.startsWith('/components/') || path.startsWith('/docs/charts/')) return '0.8'
  if (path.startsWith('/docs/') || path.startsWith('/dashboards')) return '0.7'
  return '0.6'
}
const urlEntries = Object.keys(ROUTE_META)
  .sort()
  .map((p) => {
    const loc = `${SITE}${p === '/' ? '/' : p}`
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${priorityFor(p)}</priority></url>`
  })
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`
const sitemapSrc = join(publicDir, 'sitemap.xml')
const sitemapOut = join(distDir, 'sitemap.xml')
writeFileSync(sitemapSrc, sitemap)
writeFileSync(sitemapOut, sitemap)
console.log(`[prerender-routes] wrote sitemap.xml with ${Object.keys(ROUTE_META).length} URLs`)
