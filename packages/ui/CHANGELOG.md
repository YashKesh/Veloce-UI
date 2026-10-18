# Changelog

All notable changes to the `veloce-ui` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-10-18

### Added — Data Structures pack
A new chapter of veloce-ui aimed at CS education, interview-prep content,
algorithm articles, and docs that need to show real data structures (not
just abstract diagrams). All five components are pure SVG, SSR-safe,
OKLCH-themed, and support both declarative data props and an imperative
ref API for teaching-flow animations.

- `LinkedList` — singly and doubly linked variants, two-cell nodes (data +
  pointer) with directional arrows, null-terminator cell, highlight / push /
  pop / shift / unshift / insert / remove / snapshot
- `DsaStack` — vertical frames with top-of-stack highlight and push
  animation. Named `DsaStack` to coexist with the existing Layout `Stack`
  primitive. Overflow collapses older frames with a `+N hidden` indicator.
- `Queue` — FIFO plus a `deque` variant with `pushFront` / `popBack`.
  Explicit front / back labels; enqueue animates in from the right.
- `BinaryTree` — automatic layout, path highlighting, animated playback of
  in-order / pre-order / post-order / level-order traversals via
  `ref.current.traverse(order, intervalMs)`
- `Graph` — nodes + edges with circular or layered (DAG) layout, directed /
  undirected / weighted edges, click-to-select traversal start, BFS / DFS
  playback with an awaitable `ref.current.run(algorithm, start)` that
  returns the visit order
- Layout utilities exported for library consumers who want to roll their
  own visuals: `layoutBinaryTree`, `circularGraphLayout`,
  `layeredGraphLayout`, `shrinkSegment`, `SIZE_PX`, `DSA_COLORS`

### Docs
- 5 new doc pages under **Components → Data structures** (new top-level
  sidebar group)
- Each page has an interactive preview, variant / sizes / imperative-ref
  sections, and the full API table
- All five get the `Download starter kit (.zip)` button shipped in 0.4.1

### Internal
- Package d.ts grew from 99.8 KB → 107 KB.
- All 388 tests still passing.

## [0.4.0] — 2026-10-17

### Added — Color pack
- `ColorPicker` — HEX / RGB / HSL / OKLCH tabs, SV square + hue + alpha sliders, EyeDropper API with graceful fallback, preset palette, optional WCAG contrast badge
- `ColorInput` — compact field with swatch trigger and popover `ColorPicker`; writes value back in your chosen format (hex / rgb / hsl / oklch)
- `ColorSwatch` — readonly chip (3 sizes, square / circle, auto checker for alpha)
- `ContrastChecker` — WCAG 2.1 ratio + AA / AAA pass-fail badges for normal and large text sizes
- `color` utils: `parseColor`, `rgbToHex` / `rgbToHsl` / `rgbToOklch` + inverses (Ottosson matrices, no deps), `getContrastRatio`, `wcagLevel`

### Added — Chart extras
- `SparklineGrid` — rows of mini sparklines (line / bar / status) with label, trend, value and delta badge; configurable columns
- `AnnotationsLayer` — composable overlay for `LineChart` with `point`, `threshold`, and `range` annotations; shares the chart's coordinate space
- `BrushChart` — `LineChart` + draggable overview strip; drag inside to pan, grab edges to resize, click-drag empty space to re-select
- `LiveLineChart` — streaming line chart with ring-buffer; `source` + `intervalMs` for polling or imperative `ref.current.push(value)` for your own stream; pause / resume / clear
- `ComparisonLineChart` — current vs. previous overlay (dashed muted previous line) with delta badge computed by a configurable aggregate
- `decimate(data, target)` utility — even sampling for large series

### Added — Design Tokens pack
- `GradientBuilder` — multi-stop linear / radial / conic editor, draggable stops, per-stop `ColorInput`, angle slider, copy as CSS / Tailwind / OKLCH
- `ShadowBuilder` — multi-layer `box-shadow` editor with per-layer offset / blur / spread / color / inset; reorder with ↑ / ↓; copy as CSS / Tailwind / CSS variable declaration

### Changed
- `SunburstChart` now renders in-arc labels (when a sector is wider than ~15°) and a horizontal legend row below the chart. Both opt-out via new `showLabels` and `showLegend` props (default `true`).
- Chart doc pages now remount the live component when the variant tab changes, so uncontrolled defaults (e.g. `defaultRange` on `BrushChart`) reset between variants.

### Fixed
- Anatomy TreeView isolation now works row-by-row on charts with many sibling shapes — `Ridgeline` (4 ridges), `Waffle` (4 categories), `Sunburst` (channels vs. sub-channels) each now expose per-row series roles so clicking a tree node isolates only its shapes.

### Docs
- 11 new doc pages across the three packs:
  - `/components/color-{picker,input,swatch}` + `/components/contrast-checker`
  - `/components/gradient-builder` + `/components/shadow-builder`
  - `/docs/charts/{sparkline-grid,annotations,brush,live-line,comparison}` (full chart-doc layout with Anatomy / Variants / Motion / A11y / API)
- Sidebar restructured: `Charts` promoted to its own top-level group with 6 sub-sections (`Trends & time`, `Comparison`, `Part-to-whole`, `Distribution`, `Relationships`, `Extras`)
- New `Color` sub-section inside `Components` groups the six color + design-token components

### Internal
- +16 new unit tests covering `color` utils (parse / round-trip / contrast) and the `decimate` helper. All 388 tests green.
- Package d.ts grew from 92 KB → 99.8 KB.

## [0.3.0] — 2026-10-06

- `DashboardBuilder` component
- Chart `yMin` / `yMax` props across every series type
- 14 new marketing block doc pages
- Docs tooling refresh
