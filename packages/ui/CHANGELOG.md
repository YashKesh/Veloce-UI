# Changelog

All notable changes to the `veloce-ui` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] — 2026-10-19

### Added — Algorithm Playbacks pack
Six interactive algorithm visualisers, each built on a shared
`usePlayback` hook + `PlaybackControls` UI so every visualiser gets
play / pause / step / reset / speed-slider for free. Nothing like this
exists elsewhere as a React component library.

- `SortingVisualizer` — bubble / selection / insertion / quick / merge.
  Compare and swap operations light up as the array sorts.
- `DijkstraVisualizer` — shortest paths from a source, with live distance
  / predecessor table and relaxed-edge animation.
- `DPTable` — three built-in recurrences (LCS, edit distance, knapsack).
  Cells fill in with dependency arrows; final back-trace path is
  highlighted on completion.
- `AStarVisualizer` — grid pathfinding with walls, start, goal, three
  heuristics (Manhattan / Euclidean / Chebyshev), optional diagonal
  movement; open and closed sets colour-coded.
- `MSTVisualizer` — Kruskal and Prim side-by-side. Edges show as
  considered / accepted (bold green) / rejected cycle (dashed red) with a
  running weight total.
- `TopologicalSortVisualizer` — Kahn's algorithm with live in-degrees,
  queue state, and emerging order. Detects cycles automatically.

### Added — Shared utilities (exported)
- `usePlayback<S>({ buildSteps, intervalMs, autoPlay, onComplete, deps })`
  — the generic step-driver that every visualiser uses. Pre-builds the
  full step list, ticks through on a timer that can be paused /
  step-advanced / reset. Reusable by consumers who want to build their
  own visualisers.
- `PlaybackControls` — drop-in UI with play, pause, step, reset, and a
  speed slider. Wire any `PlaybackState` into it.

### Docs
- 6 new pages under new **Algorithm playbacks** top-level sidebar group
- Same depth as previous packs (interactive preview, variants, API, SEO)
- Full prerender + sitemap entries

### Internal
- Package d.ts grew from 111.4 KB → 118.9 KB.
- All 388 tests still passing.

## [0.6.0] — 2026-10-18

### Added — Data Structures pack 2 (advanced)
Six more components building on the Pack 1 foundation. All pure SVG,
SSR-safe, OKLCH-themed, and following the same declarative-data +
imperative-ref API pattern.

- `Heap` — binary min / max heap drawn as a complete tree. `insert` animates
  the sift-up swap path step-by-step; `extract` animates sift-down. Array
  indices labelled under each node.
- `Trie` — prefix tree built from a word list. Shared prefixes collapse
  into one branch; terminal (end-of-word) nodes get a green ring. Prefix
  highlight prop + `search / startsWith` ref methods.
- `HashMap` — bucket array with chained collisions. `put / get` flashes the
  hashed bucket for ~900 ms. Load-factor badge. Pluggable `hashFn` prop so
  you can demonstrate hash-distribution problems.
- `DisjointSet` — Union-Find forest with per-root rank badges, union-by-rank
  and path compression (optional via `byRank` prop). Imperative
  `union / find / connected` on the ref.
- `AVLTree` — self-balancing BST with LL / LR / RR / RL rotations. Balance
  factor chip per node turns purple when |bf| ≥ 1 so viewers see which
  rotation is about to fire. Nodes smoothly tween to their new positions
  after each rebalance.
- `SegmentTree` — range queries over an array with `sum / min / max`
  aggregate. Point updates recompute only affected nodes; `queryRange`
  lights the path of O(log n) visited segments so the "we don't recurse
  into fully-covered subtrees" rule is visually obvious.

### Docs
- 6 new pages under **Components → Data structures**
- Every page has the same depth as the Pack 1 docs: interactive preview,
  variants / sizes / examples sections, full API table, download-starter-
  kit button
- Full SEO + prerender + sitemap entries (119 routes total)

### Internal
- Package d.ts grew from 107 KB → 111.4 KB.
- All 388 tests still passing.

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
