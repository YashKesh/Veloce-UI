# Launch copy

Draft posts for the v0.1 launch. Pick one, tweak the tone to taste, publish.

---

## 1 — Reddit `r/reactjs`

**Title:**
`Veloce UI — motion-first React 19 component library (0.1 release)`

**Body:**
Hey r/reactjs, I just open-sourced the library I've been building for the past couple of weeks.

**Veloce UI** is a React 19 component library focused on *motion as a first-class property* — every primitive ships with the right enter/exit, hover, press, and focus animations, and reduced-motion is respected everywhere.

**What's in it:**
- 38 primitives (Button through Sidebar — all the usual suspects)
- 13 chart types with hover tooltips + mount animations (Line, Area, Bar, Pie, Scatter, Candlestick, Radar, Funnel, Waterfall, Treemap, Heatmap, Gauge, Sparkline)
- A full-featured DataGrid: virtualized rows, column pinning / resizing / visibility menu, inline editing, quick filter, multi-sort, selection
- Layout + Motion utilities
- 310 tests, SSR-safe, zero runtime (no CSS-in-JS)
- OKLCH-themed via CSS variables, three accent palettes, dark + light modes via a single `data-mode` attribute

**Trade-offs vs other libraries:**
- Not a Radix wrapper — I built the a11y + interaction logic from scratch, so bundle size is smaller but the surface area is still growing
- Not styled-with-Tailwind — pure CSS wrapped in `@layer veloce-ui` so your own styles beat it without `!important`
- Requires React 19

```bash
npm install veloce-ui
```

- Docs + demos: https://veloceui.codeloomdevv.co.in
- GitHub: https://github.com/YashKesh/Veloce-UI
- npm: https://www.npmjs.com/package/veloce-ui

Would love feedback — particularly on the DataGrid API shape (that one tried to balance "shadcn-style compound" against "ag-grid-style config object") and the chart hover interactions. Fire away.

---

## 2 — Hacker News "Show HN"

**Title:**
`Show HN: Veloce UI – Motion-first React 19 component library with 13 chart types`

**Body (2–3 short paragraphs max — HN hates long preambles):**
I built Veloce UI because every component library I tried either shipped slick motion with heavy runtime cost (framer-motion everywhere, 100 KB baseline), or shipped zero runtime but zero animations too (headless primitives you have to re-animate yourself).

Veloce ships pure CSS inside `@layer veloce-ui` so your own styles beat the library's without `!important`, but every primitive has the right transitions baked in and reduced-motion is respected. 38 primitives, 13 chart types with real hover tooltips, and a DataGrid with virtualization + column pinning + inline editing. SSR-safe, requires React 19.

Live: https://veloceui.codeloomdevv.co.in · npm: https://www.npmjs.com/package/veloce-ui · code: https://github.com/YashKesh/Veloce-UI

Happy to answer anything about the architecture choices — in particular the OKLCH theming via CSS custom properties + `color-mix`, why I didn't build on Radix, and how the chart layer stayed under 50 KB without external deps.

---

## 3 — X / Twitter (one post + reply thread)

**Main post:**
```
I open-sourced Veloce UI — a motion-first React 19 component library.

38 primitives, 13 chart types, a virtualized DataGrid with inline editing, OKLCH-themed, zero runtime.

npm i veloce-ui

veloceui.codeloomdevv.co.in
```
Attach: 30-second screen recording of the Playground chart grid rendering, then DataGrid filtering through 2 000 rows.

**Reply 1 (thread):**
Why one more component library?
Most options are either Radix-wrapped (which pushes a11y right but you ship your own animations), or fully styled with Tailwind (which couples you to the Tailwind runtime). I wanted motion built-in, zero runtime cost, and raw CSS you can override without `!important`.

**Reply 2:**
The DataGrid was the hardest part. It virtualizes rows via @tanstack/react-virtual, supports left/right column pinning with proper sticky-edge shadows, resizable columns via drag handles, inline editing (text / number / select), quick filter in the toolbar, multi-sort via shift-click, and a Column menu for visibility toggle.

**Reply 3:**
Charts don't ship with d3 or recharts underneath. Pure SVG, each one is 150–300 lines, each one supports hover tooltips, sweep-on-mount animations, and `color-mix(in oklch, …)` palette fallbacks that theme automatically.

**Reply 4:**
MIT. Early days — v0.1. Would love issues on the GitHub if anything breaks for you.
GitHub: github.com/YashKesh/Veloce-UI

---

## 4 — Posting timing / etiquette

- **Reddit r/reactjs**: Tue–Thu, 2–5pm UTC. Don't post Mondays, don't post weekends. Reply to every comment within the first 2 hours.
- **Hacker News**: Tue/Wed/Thu, 7–9am Pacific. One shot — if it dies in New within 20 minutes, it dies. Don't resubmit for at least a week.
- **X**: whenever your audience is online. Add 1-2 relevant hashtags only — `#reactjs #opensource` max.
- **Don't post to Product Hunt yet.** Save PH for v0.2 when you have ≥10 GitHub stars and 2–3 real users. PH burns one launch per product and the first-day queue is unforgiving to zero-social-proof libraries.

---

## 5 — Metrics worth watching day 1–7

- GitHub stars (goal: 50 in first 48h = decent traction)
- npm weekly downloads (first number appears ~48h after publish on npmjs.com)
- Vercel Analytics on the docs site — look for `/components`, `/charts`, and `/docs/installation` as the top pages
- GSC impressions once indexed (first data appears 3–5 days after sitemap submission)

If any of those line goes vertical, double down on the channel. If they're all flat after a week, the issue is positioning, not the product — iterate on the landing page copy and relaunch to the second-tier channels (dev.to, Lobsters, Reactiflux Discord).
