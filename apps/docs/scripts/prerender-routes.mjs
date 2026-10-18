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

  // Branded full-viewport splash that renders before React hydrates.
  // All SEO content (h1 + summary + install hint + primary nav) stays in the
  // DOM for crawlers, visually arranged as an intentional loading screen so
  // users don't see a bare text block mid-load.
  const shell = `
      <main class="vl-ssr-shell" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: radial-gradient(ellipse at top, #1a1740 0%, #121128 55%); color: #cbd5e1;">
        <div style="max-width: 640px; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 18px;">
          <div aria-hidden="true" style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #a78bfa, #8b5cf6); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px -8px rgba(167, 139, 250, 0.45);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l6 6L20 6"/></svg>
          </div>
          <h1 style="font-size: clamp(28px, 5vw, 44px); font-weight: 650; letter-spacing: -0.02em; margin: 0; color: #f8fafc; line-height: 1.1;">${h1}</h1>
          <p style="font-size: clamp(14px, 2vw, 17px); line-height: 1.55; margin: 0; color: #cbd5e1; max-width: 560px;">${summary}</p>
          <code style="display: inline-block; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 13px; color: #e4e4e7;">npm i veloce-ui</code>
          <nav aria-label="Primary" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; font-size: 13.5px; padding-top: 6px;">
            <a href="/components" style="color: #a78bfa; text-decoration: none;">Components</a>
            <a href="/charts" style="color: #a78bfa; text-decoration: none;">Charts</a>
            <a href="/docs/installation" style="color: #a78bfa; text-decoration: none;">Install</a>
            <a href="/docs/usage" style="color: #a78bfa; text-decoration: none;">Usage</a>
            <a href="https://github.com/YashKesh/Veloce-UI" style="color: #a78bfa; text-decoration: none;">GitHub</a>
          </nav>
          <div aria-hidden="true" style="margin-top: 14px; width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(167,139,250,0.25); border-top-color: #a78bfa; animation: vl-ssr-spin 900ms linear infinite;"></div>
        </div>
        <style>@keyframes vl-ssr-spin { to { transform: rotate(360deg); } }</style>
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
