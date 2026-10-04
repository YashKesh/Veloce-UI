// Per-route SEO metadata — consumed by scripts/prerender-routes.mjs after `vite build`
// to emit static dist/<path>/index.html files with route-specific title, description,
// canonical, OG/Twitter cards, and above-fold HTML. Served by Vercel as static files;
// SPA takes over on hydrate. Add new routes here as the site grows.

const SITE = 'https://veloceui.codeloomdevv.co.in'
const BRAND = 'Veloce UI'
const OG = `${SITE}/og.png`

const comp = (name, slug, blurb) => [`/components/${slug}`, {
  title: `${name} · ${BRAND}`,
  description: blurb,
  h1: name,
  summary: `${blurb} Part of the Veloce UI motion-first React 19 component library — install with npm i veloce-ui.`,
}]

const chartDoc = (name, slug, blurb) => [`/docs/charts/${slug}`, {
  title: `${name} chart · ${BRAND}`,
  description: blurb,
  h1: `${name} chart`,
  summary: `${blurb} Pure-SVG, OKLCH-themed, hover tooltips, mount animations. Part of the Veloce UI chart module — install with npm i veloce-ui.`,
}]

export const ROUTE_META = Object.fromEntries([
  // Core
  ['/', {
    title: 'Veloce UI — Components that move · Motion-first React library',
    description: 'Motion-first React 19 component library. 36 primitives, 13 charts, OKLCH-themed, zero runtime, SSR-safe. Install with npm i veloce-ui.',
    h1: 'Veloce UI — Components that move',
    summary: 'Motion-first React 19 component library. 36 primitives, 13 chart types, Layout and Motion utilities, OKLCH-themed tokens, zero runtime, SSR-safe. Open-source, MIT-licensed.',
  }],
  ['/components', {
    title: `Components · ${BRAND}`,
    description: 'Browse all 36 Veloce UI primitives, 13 chart types, and layout + motion utilities. Filter by category: forms, overlays, feedback, data, navigation.',
    h1: 'Components',
    summary: 'The complete Veloce UI catalogue — every primitive, chart, layout utility and motion helper the library ships. Each card links to a detail page with preview, API table, keyboard shortcuts, and accessibility notes.',
  }],
  ['/charts', {
    title: `Charts · ${BRAND}`,
    description: 'Dashboard-grade chart components — line, area, bar, pie, scatter, candlestick, radar, funnel, waterfall, treemap, heatmap, gauge, sparkline. Pure SVG, zero deps.',
    h1: 'Charts',
    summary: '13 chart primitives you can ship in production dashboards: multi-series Line and Area, grouped Bar, Pie and Donut, Scatter, Candlestick (OHLC), Radar, Funnel, Waterfall, Treemap, Heatmap, Gauge, Sparkline. All forwardRef SVG, theme-aware, SSR-safe.',
  }],
  ['/charts/catalogue', {
    title: `Charts catalogue · ${BRAND}`,
    description: 'Every chart primitive at a glance — 16 series types, grouped by family. Click any tile for anatomy, variants, and the full prop surface.',
    h1: 'Charts catalogue',
    summary: 'Visual index of every chart series Veloce UI documents. Line, Area · stacked, Step, Bar · horizontal/stacked, Composed, Scatter, Candlestick, Pie, Radar, Funnel, Waterfall, Treemap, Gauge · arc, Sparkline, Heatmap · Donut.',
  }],
  ['/accents', {
    title: `Accents · ${BRAND}`,
    description: 'The three Veloce UI accent palettes — Violet, Lime, Cyan — rendered against every component so you can preview before you theme.',
    h1: 'Accents',
    summary: 'Three OKLCH accent palettes ship by default (Violet, Lime, Cyan), each with matching dark and light tokens. Switch via a single data-accent attribute anywhere in the DOM. Preview every primitive against every palette here.',
  }],
  ['/docs/installation', {
    title: `Installation · ${BRAND}`,
    description: 'Install veloce-ui from npm in a React 19 project. Zero config, SSR-safe, ships ESM + CJS + TypeScript types. Works with Next.js, Vite, Remix, Astro.',
    h1: 'Installation',
    summary: 'Four steps: install the package, import the stylesheet once, set the theme attributes on <html>, import components from "veloce-ui". No CLI, no scaffolding, no copy-pasting — a single npm dependency.',
  }],
  ['/docs/usage', {
    title: `Usage · ${BRAND}`,
    description: 'How to install, theme, and compose Veloce UI primitives. Style overrides, @layer cascade order, consumer resets, and SSR notes.',
    h1: 'Usage',
    summary: 'Minimum setup to render a Button, overriding styles via style/className/CSS layer, scoping accents with data-accent, SSR notes for Next.js and Remix, and recipes for the most common compositions.',
  }],
  ['/docs/tokens', {
    title: `Design tokens · ${BRAND}`,
    description: 'OKLCH color scales, spacing, radii, shadows, typography, and motion tokens that drive every Veloce UI component.',
    h1: 'Design tokens',
    summary: 'Every token in the Veloce UI design system, in one page. Backgrounds (--bg, --bg-1, --bg-2, --bg-3), lines, foregrounds, accents with soft/hover/text variants, status colors, radii, durations, easings, spacing scale.',
  }],
  ['/docs/motion', {
    title: `Motion system · ${BRAND}`,
    description: `Veloce UI's five easing curves, five durations, and reduced-motion rules — the vocabulary every component speaks.`,
    h1: 'Motion system',
    summary: 'Five durations (100 to 350ms), four easings (swift-out, settle, exit, press), reduced-motion opt-outs on every animation. The grammar every Veloce UI primitive uses so motion feels coherent across the system.',
  }],
  ['/about', {
    title: `About · ${BRAND}`,
    description: 'Veloce UI is a solo-authored motion-first React component library by YashKesh. Here is why it exists, who it is for, and how it is maintained.',
    h1: 'About Veloce UI',
    summary: 'Motion-first React 19 component library built by YashKesh. Open-source under MIT, maintained on GitHub at YashKesh/Veloce-UI, published to npm as veloce-ui. Full-time project; expect weekly releases through v1.0.',
  }],
  ['/contact', {
    title: `Contact · ${BRAND}`,
    description: `How to reach the Veloce UI maintainer for bug reports, feature requests, security disclosures, and partnership inquiries.`,
    h1: 'Contact',
    summary: 'Bug reports and feature requests go to GitHub Issues at github.com/YashKesh/Veloce-UI/issues. Security disclosures via email. General questions welcome on the GitHub Discussions tab.',
  }],
  ['/privacy', {
    title: `Privacy policy · ${BRAND}`,
    description: 'Veloce UI documentation site privacy policy. What we collect (nothing beyond basic analytics), who we share it with (no one), and how long we keep it.',
    h1: 'Privacy policy',
    summary: 'The Veloce UI documentation site uses Vercel Analytics (cookie-less, no PII). No account system, no email collection, no third-party tracking beyond the Vercel edge logs required to serve the site.',
  }],
  ['/terms', {
    title: `Terms of service · ${BRAND}`,
    description: 'Veloce UI is open-source software distributed under the MIT License. Terms covering the documentation site and the npm package.',
    h1: 'Terms of service',
    summary: 'The veloce-ui npm package is distributed under the MIT License — free for commercial and personal use with attribution. The documentation site is provided as-is with no warranty.',
  }],

  // 36 component docs — short, differentiated blurbs for each
  comp('Button', 'button', 'Triggers an action. Four variants — primary, ghost, outline, destructive — across three sizes, with press feedback that scales to 0.97 in 120ms.'),
  comp('Badge', 'badge', 'Short status indicator. Five tones (neutral, accent, ok, warn, err) across three variants (solid, soft, outline).'),
  comp('Chip', 'chip', 'Interactive badge. Optional onRemove renders a close affordance; same tone and variant surface as Badge.'),
  comp('Card', 'card', 'Padded container with Header, Body, Footer slots. The baseline for every panel in Veloce UI.'),
  comp('Avatar', 'avatar', 'Image avatar with graceful fallback to tokenised initials. Three sizes.'),
  comp('Separator', 'separator', 'Thin divider line, horizontal or vertical. Decorative by default, with aria-orientation when semantic.'),
  comp('Input', 'input', 'Styled text input with prefix, suffix, and invalid states. Focus ring uses the accent token.'),
  comp('Textarea', 'textarea', 'Multi-line input with optional auto-resize. Mirrors Input states.'),
  comp('Select', 'select', 'Native-styled select element. Options via a flat array; keeps keyboard behaviour intact.'),
  comp('Checkbox', 'checkbox', 'Standard checkbox with indeterminate state. Uses the accent token for check mark.'),
  comp('Radio', 'radio', 'Grouped radio buttons via Radio + RadioGroup. Arrow keys move focus; Space selects.'),
  comp('Switch', 'switch', 'On/off toggle with spring-free motion and clear focus outline.'),
  comp('Slider', 'slider', 'Range slider with keyboard and pointer support. Step, min, max, and controlled value.'),
  comp('Toggle group', 'toggle-group', 'Segmented toggle for single or multi selection. Compound children API.'),
  comp('Tabs', 'tabs', 'Tabbed interface with roving tabindex and animated active indicator.'),
  comp('Dialog', 'dialog', 'Modal dialog with focus trap, scroll lock, Esc to close, portal rendering, and composable Header/Body/Footer.'),
  comp('Sheet', 'sheet', 'Side drawer rendered via portal. Open from any edge; animated with the standard enter/exit tokens.'),
  comp('Dropdown menu', 'dropdown', 'Action menu with keyboard navigation and animated enter. Separators and disabled items supported.'),
  comp('Popover', 'popover', 'Lightweight floating container anchored to a trigger. Dismisses on outside click and Esc.'),
  comp('Tooltip', 'tooltip', 'Short label on hover or focus. 150ms delay, follows the system reduced-motion preference.'),
  comp('Command palette', 'command', 'Overlay search palette with grouped items, keyboard navigation, and fuzzy filter.'),
  comp('Toast', 'toast', 'Imperative notification system with four tones, four positions, auto-dismiss, and custom actions.'),
  comp('Alert', 'alert', 'Inline status callout with four tones and an optional dismiss button.'),
  comp('Progress', 'progress', 'Determinate and indeterminate progress bars. Smooth value tweens on prop change.'),
  comp('Spinner', 'spinner', 'Circular loader that respects currentColor. Three sizes.'),
  comp('Skeleton', 'skeleton', 'Shimmering placeholder in text, block, or circle shape — for perceived-performance work.'),
  comp('Empty state', 'empty-state', 'Centred empty-state card with icon, title, description, and optional action.'),
  comp('Breadcrumbs', 'breadcrumbs', 'Trail of links with chevron separators. Last crumb is static.'),
  comp('Pagination', 'pagination', 'Numbered page selector with sibling and boundary ellipsis.'),
  comp('Stepper', 'stepper', 'Multi-step progress indicator for linear flows. Horizontal and vertical orientations.'),
  comp('Accordion', 'accordion', 'Collapsible panels. Single or multiple expansion. Smooth height animation.'),
  comp('Navbar', 'navbar', 'Top-of-page navigation with Brand, Nav links, and Actions slots.'),
  comp('Sidebar', 'sidebar', 'Left-side navigation shell with grouped sections, nested items, and footer.'),
  comp('Data grid', 'data-grid', 'Virtualised data grid with column pinning, resizing, visibility menu, inline editing, quick filter, multi-sort, and row selection.'),
  comp('Table', 'table', 'Simple semantic table with Header, Row, Column, Cell. Supports zebra, dense, and align props.'),
  comp('Charts', 'charts', 'The 13 chart primitives in the Veloce UI chart module. Click into any for a live preview and the full prop surface.'),
  comp('Layout primitives', 'layout', 'Four zero-runtime layout components — Container, Grid, Stack, AspectRatio — that compile to flex and grid.'),
  comp('Motion utilities', 'motion-utilities', 'Three JS helpers for exit animations, stagger choreography, and value tweening. Each respects prefers-reduced-motion.'),

  // 13 chart detail pages
  chartDoc('Line', 'line', 'Smooth multi-series line chart with gradient underfill, grid lines, and configurable axis labels.'),
  chartDoc('Area · stacked', 'area', 'Area chart with stronger fill than Line. Supports stacking multiple series.'),
  chartDoc('Bar', 'bar', 'Grouped vertical bar chart with rounded tops, optional value labels, and configurable gap and group spacing.'),
  chartDoc('Pie & Donut', 'pie-donut', 'Part-to-whole in a single ring. Arcs sweep clockwise on enter; the hovered arc offsets outward and the centre label swaps to its value.'),
  chartDoc('Scatter', 'scatter', 'X/Y scatter with linear scale, grid, dot radius, and optional multi-series.'),
  chartDoc('Candlestick', 'candle', 'OHLC candlestick with configurable up/down colours. Thin wick plus body rect.'),
  chartDoc('Radar', 'radar', 'Polygon per series on a shared axis frame with configurable ring count and max.'),
  chartDoc('Funnel', 'funnel', 'Stage-based conversion funnel. Each stage is a trapezoid narrowing to the next.'),
  chartDoc('Waterfall', 'waterfall', 'Delta chart with running total and anchored totals. Positive and negative segments colour-code automatically.'),
  chartDoc('Treemap', 'treemap', 'Squarified treemap with per-datum colour and labels that hide under 40×24 pixels.'),
  chartDoc('Sparkline', 'sparkline', 'Minimal inline trend line. No axes, no grid. Optional end dot.'),
  chartDoc('Gauge · arc', 'gauge', 'Semi-circle gauge with threshold bands, needle, tick marks, and a hover tooltip that pins to the value.'),
  chartDoc('Heatmap', 'heatmap', '2D intensity grid built from unique x/y keys. Intensity blends through color-mix in OKLCH.'),
])
