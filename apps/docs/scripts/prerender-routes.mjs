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

function render(meta, canonical) {
  const title = esc(meta.title)
  const desc = esc(meta.description)
  const h1 = esc(meta.h1 ?? meta.title)
  const summary = esc(meta.summary ?? meta.description)
  const can = canonical

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
  const html = render(meta, canonical)
  const outPath = path === '/' ? join(distDir, 'index.html') : join(distDir, path.replace(/^\//, ''), 'index.html')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, html)
  written++
}
console.log(`[prerender-routes] wrote ${written} HTML files (${skipped} skipped)`)
