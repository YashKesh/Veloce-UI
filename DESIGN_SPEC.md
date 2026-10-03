# Veloce UI — Implementation Spec (extracted from `Veloce UI.dc.html`)

Veloce UI: motion-first, accessibility-complete, zero-runtime React component library.
Docs/marketing site implements 10 design artboards. Dark-mode-first, accent violet default.
Theming via `data-accent` (`violet|lime|cyan`), `data-mode` (`dark|light`), `data-rm` ("true" kills animation) on `<html>`.

## A. Artboard inventory

Each artboard renders as a route/page at 1440px design width. Canvas-artboard chrome (desk background, label chips) is NOT part of the product — implement each artboard as a full page.

| ID | Route | Purpose |
|---|---|---|
| 1a | `/` | Landing hero: nav, headline, install command, component collage, 3 pillars |
| 1b | `/docs/dialog` | Component-detail docs page (Dialog): preview panel w/ motion scrubber, Usage, Props table, Accessibility, Motion spec |
| 1c | `/components` | Gallery: 5-col grid of 14 tiles (Dialog tile in hover-lift state) |
| 1d | `/docs/tokens` | Design tokens spec sheet: 12-step OKLCH ramps, spacing, radius, elevation, motion tokens + bezier curves, type scale, focus ring |
| 1e | `/closeups` | Button matrix, Input states, Switch states, Toast, Tabs, Command Palette, Light-mode strip |
| 1f | `/accents` | Three mini-heroes: violet / lime / cyan accent variants with 12-step ramp strips |
| 2a | `/feedback` | Toaster, Spinner & Progress, Skeleton, Alert, Avatar/Chip/ToggleGroup/Breadcrumbs/Pagination, Radio/Slider/Textarea, Stepper/Table, Sheet/Empty state (padding 56px 64px) |
| 3a | `/datagrid` | Data Grid + Table variants + Layout primitives (padding 56px 64px) |
| 3b | `/docs/installation` | Docs guide page: numbered install steps, CLI output, prev/next |
| 3c | `/docs/motion` | Motion system concept page: 4 rules, "Anatomy of an enter", motion.css, reduced-motion callout |
| 4a | `/docs/charts/line` | Docs shell v2 (product switcher, version pill, announcement banner, collapsible sidebar tree w/ feature sections) + Line chart page: TreeView anatomy panel beside live line/area chart w/ crosshair + tooltip, Composition code, 2 info cards |
| 4b | `/charts` | Charts family showcase: 3 sparkline KPI cards + gauge KPI, grouped bar chart, donut w/ legend, heatmap (hour × weekday), chart loading skeleton, chart empty state (padding 56px 64px) |
| 4c | `/motion-utilities` | Motion utilities: 9 primitive cards (Presence, Stagger, NumberFlow, LayoutGroup, Collapse, Reorder, Reveal, Morph, Hooks & helpers) + choreography timeline (padding 56px 64px) |

## B. Design tokens (verbatim — already in src/styles/tokens.css)

### Fonts
Google Fonts: `Geist:wght@400;500;600;700`, `Geist Mono:wght@400;500;600`.
Body/UI: `'Geist',system-ui,sans-serif`; code/labels/kbd/eyebrows/table headers: `'Geist Mono',ui-monospace,monospace`.

### Root custom properties — dark (default)
```css
:root{
  --bg:oklch(0.135 0.008 260);--bg-1:oklch(0.165 0.008 260);--bg-2:oklch(0.205 0.009 260);--bg-3:oklch(0.25 0.01 260);
  --line:oklch(0.26 0.01 260);--line-2:oklch(0.34 0.012 260);
  --fg:oklch(0.965 0.004 260);--fg-2:oklch(0.74 0.01 260);--fg-3:oklch(0.56 0.012 260);
  --ac:oklch(0.64 0.24 292);--ac-h:oklch(0.69 0.24 292);--ac-fg:oklch(0.99 0.01 292);--ac-text:oklch(0.78 0.17 292);
  --ac-soft:color-mix(in oklch,var(--ac) 16%,transparent);--ac-line:color-mix(in oklch,var(--ac) 40%,transparent);
  --ok:oklch(0.76 0.17 150);--err:oklch(0.68 0.2 25);--warn:oklch(0.8 0.16 80);
  --shadow-sm:0 1px 2px oklch(0 0 0/.35);--shadow-md:0 4px 12px -2px oklch(0 0 0/.45),0 1px 2px oklch(0 0 0/.3);--shadow-lg:0 16px 40px -8px oklch(0 0 0/.6),0 2px 6px oklch(0 0 0/.3);
  --desk:oklch(0.09 0.006 260);
}
:root{--ac-text-light:oklch(0.5 0.24 292)}
```
Semantics: `--bg` canvas, `--bg-1` raised surface (cards/sidebars/code), `--bg-2` panels/popovers/toasts, `--bg-3` active/hover fills; `--line` hairlines, `--line-2` interactive borders; `--fg`/`--fg-2`/`--fg-3` text tiers.

### Accent alternates
```css
:root[data-accent="lime"]{--ac:oklch(0.9 0.21 128);--ac-h:oklch(0.94 0.21 128);--ac-fg:oklch(0.22 0.06 128);--ac-text:oklch(0.9 0.2 128);--ac-text-light:oklch(0.5 0.17 128)}
:root[data-accent="cyan"]{--ac:oklch(0.8 0.13 205);--ac-h:oklch(0.85 0.13 205);--ac-fg:oklch(0.2 0.05 205);--ac-text:oklch(0.82 0.12 205);--ac-text-light:oklch(0.48 0.12 205)}
```
Violet: white text on solid. Lime/cyan: dark text on solid.

### Light mode
```css
:root[data-mode="light"]{
  --bg:oklch(0.99 0.002 260);--bg-1:oklch(0.975 0.003 260);--bg-2:oklch(0.95 0.004 260);--bg-3:oklch(0.92 0.005 260);
  --line:oklch(0.9 0.006 260);--line-2:oklch(0.82 0.008 260);
  --fg:oklch(0.17 0.01 260);--fg-2:oklch(0.42 0.012 260);--fg-3:oklch(0.58 0.012 260);
  --ac-text:oklch(0.5 0.24 292);--desk:oklch(0.94 0.004 260);
  --shadow-sm:0 1px 2px oklch(0 0 0/.08);--shadow-md:0 4px 12px -2px oklch(0 0 0/.12),0 1px 2px oklch(0 0 0/.06);--shadow-lg:0 16px 40px -8px oklch(0 0 0/.18),0 2px 6px oklch(0 0 0/.06);
}
:root[data-mode="light"][data-accent="lime"]{--ac-text:oklch(0.5 0.17 128)}
:root[data-mode="light"][data-accent="cyan"]{--ac-text:oklch(0.48 0.12 205)}
:root[data-rm="true"] *{animation:none!important}
a{color:var(--ac-text);text-decoration:none} a:hover{color:var(--fg)}
```

### Keyframes (complete set)
```css
@keyframes vl-in{from{opacity:0;transform:translateY(10px) scale(.97);filter:blur(4px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes vl-spin{to{transform:rotate(360deg)}}
@keyframes vl-roll{0%,20%{transform:translateY(0)}45%,70%{transform:translateY(-1em)}95%,100%{transform:translateY(-2em)}}
@keyframes vl-caret{0%,45%{opacity:1}50%,100%{opacity:0}}
@keyframes vl-indet{0%{left:-40%;width:40%}60%{left:100%;width:60%}100%{left:100%;width:60%}}
@keyframes vl-shimmer{to{background-position:-200% 0}}
@keyframes vl-dots{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
```

### Motion tokens
Durations: 100 press/color · 150 exit/ring · 200 enter · 250 layout/height · 350 page/sheet (ms).
Easings:
- swift-out 200ms `cubic-bezier(0.16, 1, 0.3, 1)` — enters (dialogs, menus, toasts)
- settle 250ms `cubic-bezier(0.22, 1, 0.36, 1)` — layout/thumb moves
- exit 150ms `cubic-bezier(0.4, 0, 1, 1)` — exits, never blur on exit
- press 100ms `cubic-bezier(0.2, 0, 0, 1)` — press + color, scale .97

Docs naming: `--vl-dur-200`, `--vl-ease-swift-out` etc. Recipe shown in docs:
```css
/* motion.css — generated by veloce init */
.vl-enter { animation: vl-scale-fade var(--vl-dur-200) var(--vl-ease-swift-out) both; }
@media (prefers-reduced-motion: reduce) {
  .vl-enter { animation: vl-fade var(--vl-dur-100) linear both; }
}
```

### Radius scale
xs 4 · sm 6 · md 8 (default) · lg 10 · xl 14 · full 999. Nested rule: inner = outer − padding.
Usage: buttons 7/9/10 by size, inputs 8, cards/tiles 12, dialogs 12, popovers/menus 9–10, toasts 9–10, pills 999.

### Spacing
Base 4px; `--sp-1..--sp-16` for n = 1,2,3,4,5,6,8,10,12,16 → 4,8,12,16,20,24,32,40,48,64px.

### Elevation
sm/md/lg per `--shadow-*`; focus glow `var(--shadow-lg),0 0 0 1px var(--ac-line),0 0 24px -4px var(--ac-soft)`. Solid buttons carry `inset 0 1px 0 oklch(1 0 0/.2)` (.25 on hover). "Dark mode leans on borders and inset highlights; shadows only carry ambient depth."

### Focus ring (canonical)
`box-shadow: 0 0 0 2px <surface-behind>, 0 0 0 4px var(--ac)` — first color matches parent surface (--bg-1/--bg-2/--bg). "2px offset · 2px accent · 150ms". Error focus: `border:1px solid var(--err); box-shadow:0 0 0 3px color-mix(in oklch,var(--err) 22%,transparent)`.

### Type scale
- display 76px / lh 0.98 / -0.045em / 600
- h1 36px / -0.03em / 600 (gallery h1 40px/-0.035em; token sheet h1 44px/-0.04em)
- h2 22px / -0.02em / 600 (artboard section h2: 18px/-0.02em/600)
- body 14px, `--fg-2`, lh 1.5–1.55; lead 16px/1.55; hero sub 19px/1.5
- mono 13px code (lh 1.6–1.65); labels 11–11.5px `.06em` caps; eyebrows 12px `.08em` `--ac-text`
- weights: 400 body, 500 buttons/nav-active/labels, 600 headings, 700 icon glyphs

### 12-step OKLCH ramps (Tokens page + accent strips — exact algorithm)
```js
const L = [0.98,0.95,0.91,0.86,0.80,0.73,0.66,0.58,0.50,0.42,0.32,0.20];
// step i: chroma = c < 0.02 ? c : c * (0.25 + 0.75 * Math.sin(Math.PI * i / 11));
// css: `oklch(${L[i]} ${ch} ${hue})`
// ramps: neutral hue 260 c 0.008 (solid step index 0), violet 292/0.26 (solid 7), lime 128/0.22 (solid 2), cyan 205/0.14 (solid 4)
```
Semantic aliases shown: `--vl-canvas → neutral.12`, `--vl-surface → neutral.11`, `--vl-accent → accent.solid`, `--vl-ring → accent.solid / 2px offset`. "Step 1 = lightest surface, step 12 = darkest ink. Dark mode reads the scale in reverse. ● marks the solid step."

## C. Per-screen structure

### 1a · Landing (`/`)
- Ambient glow: `radial-gradient(800px 400px at 70% -10%, var(--ac-soft), transparent 70%)`.
- Nav 64px, padding 0 48px, border-bottom `--line`: logo (22px radius-6 accent square containing 3×12px bar `skewX(-22deg)` in `--ac-fg`) + "Veloce **UI**" (UI `--fg-3` w500); links Docs · Components · Motion · Changelog (14px `--fg-2`); right: "Search docs" input (32h × 220w, `--bg-1`, ⌘K kbd chip), GitHub button with `★ 12.4k` chip (star `--warn`).
- Hero grid `660px 1fr`, padding 96px 48px 72px:
  - Pill: `v1.0` accent mini-pill + "Zero-runtime motion, now stable" (28h, `--ac-soft`, `--ac-line` border, r999).
  - H1 76px: "Components that move." — "move" in `--ac-text`.
  - Sub 19px `--fg-2` max 520px: "Accessible React components with signature motion built in. Every transition is pure CSS — no animation library, nothing shipped to the client but your UI."
  - CTA row: install box `$ npx veloce add button` (48h, mono 14.5, `--bg-1`, `--line-2` border, r10, copy btn ⧉ 36×36) + solid button "Read the docs" (48h, pad 0 20, r10, inset highlight + shadow-md).
  - Stats: "**38** components · **0 kB** animation runtime · **WCAG 2.2 AA** across the board".
  - Right collage (520h): toast stack mid-stagger ("Build queued" / "Preview ready" / "Deploy succeeded — main · 42s · 3 routes revalidated"; annotation "toast · stagger 40ms · swift-out"); NumberFlow card ("GitHub stars ▲ 3.2%", digits 12,4→[rolling 6/7/8 via vl-roll 2.4s cubic-bezier(.16,1,.3,1)]→2, caption "<NumberFlow /> · 250ms settle"); Dialog frozen mid-open ("Delete workspace?", Cancel + destructive Delete, annotation "t = 120ms / 200ms", content `translateY(6px) scale(.965); opacity:.82; blur(.7px)`); controls cluster (Switch on + "Reduced motion", Continue button with focus ring, ":focus-visible" label).
- Pillars 3-col, top border: `01 — MOTION-FIRST` "Every component has a choreography" — "Enter, exit, press and hover states are designed as a system — 150–250ms, ease-out-expo in, ease-in out." / `02 — ACCESSIBILITY-COMPLETE` "Focus rings you'd want to show off" — keyboard nav, ARIA, focus management, prefers-reduced-motion. / `03 — ZERO-RUNTIME` "CSS does the moving" — motion tokens compile to plain transitions and @keyframes.

### 1b · Docs / Dialog (`/docs/dialog`)
- Header 56px: logo, nav (Docs active), Search ⌘K, dark/light segmented toggle (☾ active / ☀), `v1.0.4`.
- 3-col shell `248px 1fr 220px`.
- Sidebar groups (mono 11px `.06em` `--fg-3` headers): ungrouped: Getting started, Installation, Theming, Motion system, Accessibility; PRIMITIVES: Button, Badge, Card, Separator; OVERLAYS: Dialog (active: `--ac-soft` bg, `--ac-text`, r7, w500, ● dot), Dropdown Menu, Popover, Tooltip, Sheet, Command Palette (`NEW` chip); FORMS: Input, Select, Checkbox, Switch, Tabs; FEEDBACK: Toast, Progress, Skeleton; MOTION: Presence, Stagger, NumberFlow.
- Main (pad 36 48 56, max-width 820): breadcrumb Components › Overlays › Dialog; H1 "Dialog" + chips `overlays` (outline) and `a11y ✓ 14/14` (green tint); desc "A modal window layered over the page. Traps focus, restores it on close, and enters with a scale-fade composite that reads as weight, not bounce."; links API reference · Radix Dialog ↗ · WAI-ARIA pattern ↗.
- Preview panel: tabs Preview(active pill)/Code; toggles "Reduced motion"(off), "Scrub"(on), replay ↻; 420px dot-grid stage (`radial-gradient(var(--line) 1px,transparent 1px) 0 0/16px 16px`); backdrop `oklch(0 0 0/.55)` at .85; 440px dialog frozen mid-enter ("Invite to acme-design", email input `mara@acme.co` w/ focus ring + blinking caret, chips "Editor ▾" "All projects ▾", Cancel / Send invite); timeline scrubber: ▶ 0ms —[track 60%, thumb, "120ms" flag]— 200ms · swift-out; footer strip `$ npx veloce add dialog` + "⧉ copy".
- Usage code block: Dialog.Root > Dialog.Trigger asChild > Dialog.Content motion="scale-fade" size="md" > Dialog.Title.
- Props table (Dialog.Content), cols PROP/TYPE/DEFAULT/DESCRIPTION, grid `160px 240px 110px 1fr`:
  - motion · `"scale-fade" | "slide-up" | "none"` · `"scale-fade"` · Enter/exit choreography. Falls back to crossfade under reduced motion.
  - size · `"sm" | "md" | "lg" | "full"` · `"md"` · Max width: 400 / 480 / 640px, or viewport.
  - dismissible · boolean · true · Close on Escape and backdrop click.
  - initialFocus · RefObject<HTMLElement> · — · Element to focus on open. Defaults to the first tabbable.
  - onOpenChange · (open: boolean) => void · — · Fires after the exit animation completes.
- Accessibility: Keyboard card (Esc closes + returns focus; Tab trapped cycle; ⇧Tab backwards) + ARIA card (role="dialog", aria-modal="true", auto aria-labelledby/describedby, background inert); accent callout "Reduced motion is built in" — scale/translate/blur dropped, "Dialog crossfades in 120ms".
- Motion spec 3-col: ENTER `--vl-dur-200 · --vl-ease-swift-out` "opacity 0→1 · scale .96→1 · translateY 6→0 · blur 4→0px"; EXIT `--vl-dur-150 · --vl-ease-exit` "opacity 1→0 · scale 1→.98 · no blur (cheaper on exit)"; BACKDROP `--vl-dur-250 · linear` "opacity 0→.55 · leads content by 0ms, trails on exit by 50ms". Footer: `swift-out cubic-bezier(.16, 1, .3, 1)` · `exit cubic-bezier(.4, 0, 1, 1)` · "compiles to 2 transitions · 0 kB JS".
- Right rail sticky: ON THIS PAGE — Preview (active, 2px left accent bar), Usage, Props (subs Dialog.Content, Dialog.Trigger), Accessibility, Motion spec, Examples; card "Edit on GitHub ↗ / Last updated 3 days ago".

### 1c · Gallery (`/components`)
Header same (Components active). H1 40px "Components", sub "38 production components. Hover any tile to see its enter choreography." Filter pills: All (inverted `--fg` bg/`--bg` text) · Primitives · Overlays · Forms · Feedback · Motion (outline).
Grid `repeat(5,1fr) gap:16px`. Tile: `border:1px solid var(--line); border-radius:12px; background:var(--bg-1)`; 176px preview on dot-grid (14px cells); footer 12px 14px: name 13.5px w500 + mono tag 11px `--fg-3`.
Tiles/tags: Button "press 120ms" · Input "ring 150ms" · Select "unfold 200ms" · Dialog (hover state: `border:1px solid var(--ac-line); transform:translateY(-3px); box-shadow:var(--shadow-lg),0 0 0 1px var(--ac-line)`; mini dialog animates `vl-in .2s cubic-bezier(.16,1,.3,1)`) "scale-fade 200ms" · Dropdown "unfold 180ms" · Tooltip "rise 150ms" · Tabs "slide 200ms" · Toast "slide-in 250ms" · Switch "thumb 180ms" · Checkbox "draw 150ms" · Accordion "height 250ms" · Popover "scale-fade 180ms" · Card "lift 200ms" · Badge "static" · Command Palette "drop 200ms". (15 entries designed; copy says 38 components.)

### 1d · Tokens (`/docs/tokens`)
Spec sheet layout (pad 56 64): H1 44px/-0.04em. Sections: Color scales (4 ramps of 12 OKLCH swatches w/ ● solid-step marker + semantic alias list), Spacing scale, Radius scale, Elevation (3 shadow cards + focus glow), Motion (4 easing cards w/ SVG bezier plots + duration chips 100/150/200/250/350 + usage map), Type scale rows (display/h1/h2/body/mono), Focus-ring showcase. Meta chips: COLOR SPACE OKLCH · STEPS 12/scale · BASE UNIT 4px · RADIUS 8–10px.

### 1e · Close-ups (`/closeups`) — see D. Includes Light-mode strip: identical markup under light overrides (wrap in a container that sets the light token values locally).

### 1f · Accent variants (`/accents`)
3 cards (violet/lime/cyan), each locally overriding `--ac/--ac-h/--ac-fg/--ac-text`: logo row + accent CSS value; label `A — ELECTRIC VIOLET` / `B — SIGNAL LIME` / `C — PLASMA CYAN`; 40px "Components that move."; blurb (violet "Deep, technical, premium. Reads as 'engineering tool' instantly; white text on solid." / lime "Loudest and most ownable. Highest contrast on near-black; dark text on solid." / cyan "Cool and calm, closest to the canvas tint. Most restrained; dark text on solid."); button row (solid/soft/focus/switch); "Preview ready" toast; 12-step ramp strip.

### 2a · Feedback & loading (`/feedback`)
Eyebrow `COVERAGE · ROUND 2`, H1 "Feedback, loading & navigation", pill list of 17 components (Toaster, Spinner, Progress, Skeleton, Alert, Avatar, Chip, Radio, Slider, Textarea, Toggle group, Breadcrumbs, Pagination, Stepper, Table, Sheet, Empty state). Sections per component — see D for exact specs. Toast section shows stacking (n−1 `translateY(-64px) scale(.96) op .8`, n−2 `translateY(-124px) scale(.92) op .45 blur(.6px)`, "stack 180ms"), toast.promise morph note, aria-live polite, pause on hover.

### 3a · Data grid & layout (`/datagrid`)
- Data Grid ("selection · sort · filter · resize · sticky header · row actions · pagination · virtualised"): toolbar (search w/ typed `status:ready` + caret; filters Status[1 accent count pill]/Region ⌄/Columns ⌄; bulk "2 selected · Redeploy / Delete(err)"; density toggle ☰/≡); header row `--bg-2` mono 10.5 caps, tri-state checkbox (accent "–"), sorted "STATUS ↓" in `--fg`, active resize handle 1px accent + `0 0 0 2px var(--ac-soft)`; grid `44px 1.5fr 1fr 1fr .8fr .7fr 1fr 44px`, rows 46px; selected rows `--ac-soft` bg + accent ✓; states: Ready (7px `--ok` dot), Building (10px accent spinner `vl-spin .8s`), Failed (`--err` dot), Canceled (`--fg-3` dot, row muted); hover row `--bg-2` + ⋯; footer "Showing 1–6 of 472 · 6 rows / page" + pagination (active `--fg` bg/`--bg` text, 30px r7).
- 4 note cards: SORT (asc→desc→none, 250ms settle layout transition) / SELECT (shift-click ranges, tri-state header, bulk actions slide in 150ms) / RESIZE (accent handle, snaps 8px grid, order persists localStorage) / A11Y (role="grid", arrow keys, aria-sort).
- Table variants: compact striped PLAN/SEATS/MRR/CHANGE; rows Hobby / Pro (expanded ⌄ detail: Monthly 1,204 · Annual 726 · Churn 1.1%) / Team / Enterprise (−0.6% `--err`); footer Total w600 `--line-2` top border; tabular-nums.
- Layout primitives: `<Container size="lg">` max 1200 gutter --sp-6; `<Grid columns="12" gap="4">` spans 8/4, 4/4/4; `<Stack gap="3" divider>` General/Members/Billing; `<AspectRatio ratio="16/9">`; breakpoints sm 640 · md 768 · lg 1024 · xl 1280.

### 3b · Docs / Installation (`/docs/installation`)
Sidebar: GETTING STARTED — Introduction, Installation (active), CLI, Theming, Dark mode, Motion system, Accessibility, Figma kit, Changelog; FRAMEWORKS — Next.js, Vite, Remix, Astro; COMPONENTS — All components (38).
Main: breadcrumb Docs › Getting started › Installation; H1 "Installation"; lead "Veloce copies components into your project — you own the code. The CLI wires tokens, fonts and the motion layer once; each component is one command after that." Framework tabs Next.js(active)/Vite/Remix/Astro/Manual.
Numbered timeline (left border, 28px circle badges):
1. Initialise — "Creates `veloce.json`, installs Geist, and writes the token layer to `app/globals.css`." Code w/ pnpm(active 2px accent underline)/npm/bun tabs: `$ pnpm dlx veloce@latest init`
2. Answer three questions — CLI transcript: `? Accent color › violet (violet · lime · cyan · custom)` / `? Default color scheme › system` / `? Motion preset › standard (standard · snappy · minimal)` / `✓ Wrote 4 files · tokens, fonts, motion layer, cn()`
3. Add components — "Dependencies between components resolve automatically — adding `command` also brings `dialog` and `input`." `$ pnpm dlx veloce add button dialog command`
4. (✓ accent badge) Use them — `import { Button } from "@/components/ui/button"` … `<Button variant="soft" size="lg">Deploy</Button>`
Info callout "Already on shadcn/ui?" — same file layout and cn() helper; `veloce migrate` swaps components one at a time.
Prev/next cards: ← Introduction / Next → Theming. Right rail: Initialise(active) / Answer three questions / Add components / Use them / Migrating from shadcn.

### 3c · Docs / Motion system (`/docs/motion`)
Sidebar: MOTION — Principles(active), Tokens, Choreography, Reduced motion, Performance, Recipes; UTILITIES — Presence, Stagger, NumberFlow, useMotionPreference.
Eyebrow MOTION SYSTEM; H1 "Motion that feels like mass"; lead "Four rules. Every component in the library follows them, and every token on the next page exists to enforce them."
Rule cards: 01 "Fast in, faster out" (enters 200ms, exits 150ms) / 02 "Composite, don't bounce" (opacity+scale+blur together, no overshoot) / 03 "Origin is where you clicked" (menus/popovers scale from trigger; dialogs from center) / 04 "Loops are for waiting only" (spinners/skeletons/indeterminate only).
Anatomy of an enter: 5 frames 0/40/80/120/200ms — 0ms `opacity:0; translateY(8px) scale(.96)`; 40ms `.35 / 6px / .965 / blur(3px)`; 80ms `.7 / 3px / .98 / blur(1.2px)`; 120ms `.92 / 1px / .993 / blur(.3px)`; 200ms settled with `--ac-line` border + shadow-md. Channel bars: opacity 100% / scale 100% / translateY 80% / blur 60%. Caption: "Blur resolves first (60%), then translate (80%); opacity and scale carry the full 200ms. The staggered finish is what reads as 'landing'."
"Write it once" code block (motion.css recipe above). Accent callout "Reduced motion is a first-class preset" — every token has a reduced counterpart; `useMotionPreference()` exposes the same value to JS.

## D. Component visual specs

**Button** (press scale .97 · 120ms): sizes sm h30/pad 0 11/r7/13px · md h36/0 14/r9/14px · lg h44/0 18/r10/15px; w500 Geist.
Variants: solid `background:var(--ac);color:var(--ac-fg);box-shadow:inset 0 1px 0 oklch(1 0 0/.2)`; soft `background:var(--ac-soft);color:var(--ac-text)`; outline `border:1px solid var(--line-2);color:var(--fg)`; ghost no bg/border `color:var(--fg-2)`; destructive `background:var(--err);color:oklch(0.99 0 0)`.
States: hover `--ac-h` + inset .25; pressed `transform:scale(.97); box-shadow:inset 0 1px 2px oklch(0 0 0/.3)`; focused solid + ring `0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)`; loading solid op .85 + spinner (`2px solid var(--ac-fg); border-right-color:transparent; vl-spin .7s linear infinite`, 12–14px) + "Deploying"; disabled `--bg-3`/`--fg-3`.

**Input**: h38, pad 0 12, r8, `1px solid var(--line-2)`, bg `--bg`; label 12.5 w500 `--fg-2`; helper 12 `--fg-3`. Focus: border `--ac` + ring + caret (`width:1.5px;background:var(--fg);animation:vl-caret 1s steps(1) infinite`); helper `--ac-text` "Checking availability…". Error: border `--err`, `0 0 0 3px color-mix(in oklch,var(--err) 22%,transparent)`, trailing `!`, msg 12 `--err` ⚠, "message slides in 150ms". Suffix ".veloce.app" `--fg-3`.

**Switch** (thumb 180ms settle · track 150ms): track 38×22 r999. Off: `--bg-3` + `1px solid var(--line-2)`, thumb 18 `--fg-2` @1,1. On: `--ac`, thumb 18 white @2,18, shadow-sm. Focus: on + ring. Mid (t=90ms): track `color-mix(in oklch,var(--ac) 55%,var(--bg-3))`, thumb 20×18 r9 slight blur.

**Checkbox**: 18×18 r5; checked `--ac`/`--ac-fg` ✓ 11px 700; indeterminate 8×2 bar; unchecked `1px solid var(--line-2)` bg `--bg`. "draw 150ms". Grid variant 16×16 r4.

**Radio**: 18px circle; selected `border:5px solid var(--ac);background:var(--bg)`; focus 1px `--line-2` + ring; disabled `--line`/`--bg-2` + muted label + "Pro" chip.

**Slider**: track 4px `--bg-3` r2, fill `--ac`; thumb 18 white `box-shadow:var(--shadow-sm),0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)`; value tooltip `--fg` bg/`--bg` text mono 11 r5; min/max mono 10.5.

**Textarea**: min-h 84, pad 10 12, r8, `--line-2`, `--bg`; counter mono 10.5 `--fg-3` "92 / 280".

**Toast** (slide-in 250ms settle · exit 150 · progress = timeout; region bottom-right, max 3): `padding:14px 16px;border:1px solid var(--line-2);border-radius:10px;background:var(--bg-2);box-shadow:var(--shadow-lg)`; icon 20px circle `color-mix(in oklch,var(--ok|warn|err) 20%,transparent)` + colored glyph; title 13.5 w500, body 12.5 `--fg-3`; action `--ac-text` w500 or outline Retry; ✕ `--fg-3`; progress bar 2px status color. Error border `color-mix(in oklch,var(--err) 40%,var(--line-2))`. Plain: `--fg` bg/`--bg` text.

**Tabs** (indicator 200ms swift-out): segmented container `padding:3px;border-radius:9px;background:var(--bg-2);border:1px solid var(--line)`; active `padding:7px 14px;border-radius:6px;background:var(--bg);font-weight:500;box-shadow:var(--shadow-sm)` (focus ring `0 0 0 2px var(--bg-2),0 0 0 4px var(--ac)`); inactive `--fg-2`; count chip mono 10.5 `--bg-3` r4. Underline: `border-bottom:1px solid var(--line)`; active bar `position:absolute;left:12px;right:12px;bottom:-1px;height:2px;border-radius:1px;background:var(--ac)`.

**Dialog**: `width:440px (md);padding:22-24px;border-radius:12px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-lg)`; title 16–17 600 −0.015em; desc 13.5/1.5 `--fg-2`; footer right gap 8. Backdrop `oklch(0 0 0/.55)`.

**Command Palette** (drop 200ms · stagger 20ms · ⌘K): 560w r12 `--bg-2` `--line-2` shadow-lg; input row h50 (⌕, caret, `esc` kbd); group headers mono 10.5 caps ACTIONS/DOCS; items `padding:9px 10px;border-radius:7px`, selected `--bg-3`, 26px icon squares (selected: `--ac-soft`/`--ac-text`), match substring `--ac-text` w500, right kbd chips; footer h38 "↑↓ navigate · ↵ run · 5 results · 3ms".

**Select/Dropdown**: trigger h36 r8 like input; menu `padding:4px;border-radius:9px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-md)`; items `padding:7px 9px;border-radius:6px`, active `--bg-3`, selected ✓ `--ac-text`; destructive `--err`; separator 1px `--line`; shortcuts mono 11 `--fg-3`. Select unfold 200ms `transform-origin:top`; Dropdown unfold 180ms.

**Tooltip** (rise 150ms): `padding:6px 9px;border-radius:6px;background:var(--fg);color:var(--bg);font-size:12px;box-shadow:var(--shadow-md)` + 8px rotated-square arrow; shortcut mono 55% opacity.

**Popover** (scale-fade 180ms): `padding:14px;border-radius:10px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-md)`.

**Card** (lift 200ms): r10–12, `--line-2`, `--bg`; media `linear-gradient(135deg,var(--ac-soft),var(--bg-3))`; title 600, sub 12 `--fg-3`.

**Badge**: `padding:3px 9px;border-radius:999px;font-size:12px;font-weight:500`; accent `--ac-soft`/`--ac-text`; success `color-mix(in oklch,var(--ok) 15%,transparent)`/`--ok`; error idem `--err`; outline `1px solid var(--line-2)`/`--fg-2`; inverted `--fg`/`--bg`.

**Alert**: `padding:12px 14px;border-radius:9px;gap:12px`; info `1px solid var(--ac-line)` bg `--ac-soft`; success border `color-mix(ok 35%)` bg `color-mix(ok 10%)`; warning idem `--warn`; error border 40%/bg 10% `--err`; 18px round icon solid status color (✓/! 700; dark text `oklch(0.15 0 0)` on ok/warn, white on err); title 600, body `--fg-2`; optional action.

**Spinner/Progress**: spinner `border:2px solid;border-right-color:transparent;animation:vl-spin .7s linear infinite` sizes 14/20/28 (lg accent 2.5px); dots 3×6px `vl-dots 1.2s` stagger .2s. Progress: 6px track `--bg-3` r3, `--ac` fill, width 250ms settle, label + tabular %; indeterminate `vl-indet 1.4s cubic-bezier(.4,0,.2,1) infinite`; circular 56px `conic-gradient(var(--ac) 0 72%, var(--bg-3) 0)` + 44px inner disc; segmented 28×6 pills.

**Skeleton**: `background:linear-gradient(90deg,var(--bg-3) 25%,var(--line-2) 50%,var(--bg-3) 75%) 0 0/200% 100%;animation:vl-shimmer 1.6s linear infinite`; circle 40, text bars 12/10 r4, block 120 r9, buttons 32 r8. Content crossfades 200ms swift-out. Reduced motion: static.

**Avatar**: 24/32/40 circles, initials 600, hues `oklch(0.55 0.12 292)` `oklch(0.6 0.12 200)` `oklch(0.62 0.12 40)`; presence dot 11 `--ok` + 2px surface border; group overlap `margin-left:-8px` + 2px `--bg-1` borders, "+9" `--bg-3`.

**Chip**: h28 r999; removable `--bg-3` + 16px ✕ disc `--line-2`; selected `border:1px solid var(--ac);background:var(--ac-soft);color:var(--ac-text)` "✓ Motion"; unselected outline; focus ring variant.

**Toggle group**: joined `border:1px solid var(--line-2);border-radius:9px;overflow:hidden`; segments h34 `border-left:1px solid var(--line-2)`; active `--bg-3`/`--fg`.

**Breadcrumbs**: 13px, `/` `--fg-3`, items `--fg-2`, current `--fg` w500, "…" chip `--bg-3` r5.

**Pagination**: 30–32px squares r7; current `--fg` bg/`--bg` text w500; tabular-nums.

**Stepper**: 24px circles — done `--ac` + ✓; current `border:2px solid var(--ac);box-shadow:0 0 0 4px var(--ac-soft)` number `--ac-text` label `--fg` w500; upcoming `1px solid var(--line-2)`/`--fg-3`; connectors 2px (`--ac` done, half-gradient current, `--bg-3` upcoming).

**Sheet** (slide 350ms settle): right panel `width:62%;background:var(--bg-2);border-left:1px solid var(--line-2);box-shadow:var(--shadow-lg)` over `oklch(0 0 0/.45)` scrim; footer Reset(outline)/Apply(solid).

**Empty state**: `border:1px dashed var(--line-2);border-radius:12px;background:var(--bg-1)` centered; 40px icon tile `--bg-3` r10; title 14 600; body 13 `--fg-2` max 260; solid CTA "Deploy now" h32.

**Code blocks**: `border:1px solid var(--line);border-radius:10px;background:var(--bg-1)`; mono 13/1.6–1.65; `$` `--fg-3`; syntax: keywords/punct `--fg-3`, identifiers `--fg`, strings/values `--ac-text`; pm tab bar w/ 2px accent underline.

**Kbd chips**: mono 11–11.5, `padding:1-2px 5-6px;border:1px solid var(--line-2);border-radius:4px`.

**Docs shell**: header 56 (landing 64); cols `248px / fluid (max 820, pad 36 48 56) / 220px`; sidebar items `padding:6px 10px`, active `border-radius:7px;background:var(--ac-soft);color:var(--ac-text);font-weight:500`; right-rail TOC 1px left border, active `margin-left:-1px;border-left:2px solid var(--ac)`.

**Preview stage**: `background:radial-gradient(var(--line) 1px,transparent 1px) 0 0/16px 16px, var(--bg-1)` (14px cells in gallery tiles).

## E. New artboards (4a/4b/4c)

All three share the existing token set (section B) — no new tokens. Chart geometry/data comes from the artboard script's `renderVals()` (documented per-chart below); none of 4a/4b/4c uses `sc-for` loops (those remain only on 1d ramps/spacing/curves and 1f accents) — heatmap cells and all series values are literal, so implement them as typed data arrays + generator functions mirroring the script.

**Shared chart math (script, verbatim):** viewBox `0 0 600 220`, padding 20 on all sides (`W=600,H=220,PL=PR=PT=PB=20`). `xs(i,n)=20+i*(560/(n−1))`; `ys(v)=200−(v/120)*180` (y-domain 0–120). Line path `lp(arr)` = `M/L` joined points, 1-decimal. Bars: `rects(arr,off)` → per bar `M{20+i*70+11+off} {200−h}h22v{h}h-22z` with `h=v/120*180` (22px-wide bars, 70px group pitch, series offset 0 / 26). Donut: circumference `C=2π·54≈339.29`; for `[46,27,17,10]` % → `dash="len (C−len)"`, `offset=−(cumulative previous len)`: d1 `156.07 183.22` off `0.00`, d2 `91.61 247.68` off `−156.07`, d3 `57.68 281.61` off `−247.68`, d4 `33.93 305.36` off `−305.36`. Sparkline (viewBox `0 0 100 32`): `x=i*(100/(n−1))`, `y=30−(v−min)/(max−min)*26`.
Series data: `A=[42,48,45,61,58,72,69,84,91,88,104,112]` (Revenue), `B=[30,34,38,36,44,47,52,50,58,63,61,70]` (Costs); `barsA=[64,72,58,90,84,102,96,118]` off 0 (Production), `barsB=[40,46,52,48,60,66,72,80]` off 26 (Preview); donut `[46,27,17,10]`; `spark1=[12,14,13,18,17,22,21,26,30]`, `spark2=[40,38,41,37,35,36,33,31,30]`, `spark3=[5,9,7,12,10,14,13,15,19]`. Crosshair pins index 9: `tipX=xs(9,12)=478.2`, `tipLeft=79.7%`, `tipYA=ys(88)=68.0`, `tipYB=ys(63)=105.5`.

### 4a · Docs shell v2 + Charts › Line (`/docs/charts/line`)
Label "Docs / Charts / Line". Purpose: production-grade docs shell (product switcher, version pill, announcement banner, collapsible sidebar tree with feature sections + badges) hosting the Line chart component page, whose anatomy panel doubles as the Tree View demo. 1440w, `background:var(--bg);border:1px solid var(--line);border-radius:12px;overflow:hidden`.

**Header (h56, pad `0 20px`, border-bottom `--line`, space-between):**
- Left cluster gap14: logo (22px r6 `--ac` tile, inner 3×12 r2 `--ac-fg` bar `skewX(-22deg) translateX(1px)`) + "Veloce **UI**" 14/600 −0.02em ("UI" `--fg-3` w500); skewed divider `1×20 --line-2 skewX(-16deg)`; **product switcher** "Charts ▾" h30 pad `0 6px 0 10px` r7 `--bg-2` 13.5 w500 (▾ `--fg-3` 11px); **version picker** "v1.1.0 ▾" same box minus bg, mono 12.5 `--fg-2`.
- Center **announcement pill**: h32 pad `0 12` `border:1px solid var(--ac-line);border-radius:999px;background:var(--ac-soft)` 12.5 `--ac-text`, leading 6px accent dot — copy: "Veloce 1.1: Charts, Data Grid and Tree View are out — read the announcement →".
- Right gap8: search box 220×32 pad `0 10` gap8 `--line` border r8 `--bg-1` `--fg-3` 13 (⌕ · "Search" · `⌘K` kbd chip mono 11 `--line-2` r4 pad `1 5` ml-auto); three 32px icon squares r8 `1px solid var(--line)` `--fg-2` 13px: ◉ (theme/accent), ♫ with **notification badge** (absolute top −5/right −5, min-w16 h16 pad `0 4` r999 `--ac`/`--ac-fg` 10/600, `border:2px solid var(--bg)`, text "2"), ☾.

**Body grid `264px 1fr 220px`.**

**Sidebar (border-right `--line`, 13.5px, flex col):** nav pad `20px 12px 8px` gap2, base item `padding:7px 10px`, chevron cell w14 10px `--fg-3` centered (`›` collapsed / `⌄` expanded), count chips ml-auto mono 10.5 `--fg-3`:
- "What's new in 1.1" — `--fg` w500 with 6px accent dot (no chevron).
- `›` Introduction · `›` Getting started · `›` Data Grid **32** — `--fg-2`.
- `⌄` Charts **18** — `--fg` w500, expanded. Nested tree: `margin-left:17px;padding-left:12px;border-left:1px solid var(--line)`, gap1, items `padding:6px 10px` `--fg-2`: Overview / Quickstart / Features / `›` Demos (chevron `margin-left:-22px`).
  - Section header pattern (×3): `padding:14px 10px 6px` mono 10.5 letter-spacing .08em `--fg-3` with 6px r2 outline-square marker at `margin-left:-32px`. **CHART TYPES**: active item "⌄ Line" — `border-radius:7px;background:var(--ac-soft);color:var(--ac-text);font-weight:500;margin-left:-1px;border-left:2px solid var(--ac)`; its sub-tree `margin-left:22px;padding-left:12px;border-left:1px solid var(--line)` 13px, items `padding:5px 10px`: **Basics** (`--fg` w500, current), Area & stacking, Tooltip & crosshair, Draw-in motion. Then `›` Bar · `›` Pie & Donut · `›` **Scatter** in keyboard-focus state (`border-radius:7px;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--ac);margin:1px 0`) · Sparkline · Gauge · Heatmap with **NEW badge** (10px pad `1 5` r4 `--ac`/`--ac-fg` w600, align-self center, justify-between row). **COMMON FEATURES**: Axes / Legend / Tooltip / Zoom & pan / Export / Accessibility. **ADVANCED**: Composition and Real-time streaming, each with **PRO badge** (10px pad `1 5` r4 `1px solid var(--line-2)` `--fg-3`).
- After the Charts tree (mt4): `›` Tree View **6** · `›` Motion utilities **9** · `›` Migration.
- **Sidebar footer** (`margin-top:auto;padding:12px;border-top:1px solid var(--line)` 13 `--fg-2`, rows `padding:6px 10px` space-between): "Theme" + 3-seg toggle (h26 pad2 `--line` border r6 `--bg-1` 11px; 26px-wide cells; active ☾ r4 `--bg-3` `--fg`; ☀ ◐ `--fg-3`); "Reduced motion" + mini switch off (28×16 r999 `--bg-3` `1px solid var(--line-2)`, thumb 12px `--fg-2` @1,1); links row gap14 12.5 `--fg-3`: "GitHub ↗ · Discord ↗ · Figma kit ↗".

**Main content (pad `36px 48px 56px`, gap28, min-width 0):**
- Breadcrumb row gap10: 26px r7 `--ac-soft` + `--ac-line` border icon tile "◔" `--ac-text` 12; "Veloce Charts" 13.5 w500 `--ac-text`; "/" `--fg-3`; "Chart types" 13.5 `--fg-2`.
- Title block gap12: H1 "Line chart" 40/600 −0.035em + badge "a11y ✓" (mono 11.5 pad `3 8` r6 bg `color-mix(in oklch,var(--ok) 15%,transparent)` color `--ok`) + badge "SVG · 0 kB runtime" (mono 11.5 pad `3 8` r6 `1px solid var(--line-2)` `--fg-2` nowrap). Lead 17/1.55 `--fg-2` max-w 720: "Plot one or more series over a continuous axis. Lines draw in along their path, points settle last, and the crosshair follows the pointer with the same easing every other Veloce component uses."
- Example-source segmented tab (pad4 `--line` border r10 `--bg-1` 13 w500 nowrap, self-start): "Figma example" active (`padding:7px 12px;border-radius:7px;background:var(--ac-soft);color:var(--ac-text)`, 10px r3 `--ac` square icon) · "GitHub example" (10px circle `1.5px solid var(--fg-2)` icon, `--fg-2`) · "Storybook" (10px r2 outline square).
- **Anatomy panel** — grid `300px 1fr`, `border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--bg-1)`:
  - Left **TreeView** (border-right, pad `10px 8px`, 13.5, gap1; rows `padding:7px 8px`, chevron w14 10px, type-icon w16 centered `--fg-3` 12px, trailing "⊡" visibility glyph `--fg-3` 11px ml-auto; nest indent = `margin-left:15px;padding-left:8px;border-left:1px solid var(--line)`): `⌄ ▣ ChartContainer` → `⌄ ╪ Axes` → (`— XAxis` + mono 11 `--fg-3` "band", `| YAxis` "linear", `⋯ GridLines`); `⌄ ∿ Series` **selected** (`border-radius:7px;background:var(--ac-soft);color:var(--ac-text);font-weight:500`) → (`∿ LineSeries revenue` — ∿ icon `--ac-text`; `◢ AreaSeries revenue`; `∿ LineSeries costs` in **focus-ring state** `border-radius:7px;box-shadow:0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)`; `● Markers`); then collapsed `› ▭ Tooltip`, `› ┼ Crosshair`, `≡ Legend`. Footer note (mt8, `padding:8px 8px 4px;border-top:1px solid var(--line)` mono 11 `--fg-3` 1.5): "`<TreeView>` · arrow keys, type-ahead, ⌥-click expands all".
  - Right **chart pane** (pad `20px 20px 12px`, bg `radial-gradient(var(--line) 1px,transparent 1px) 0 0/16px 16px, var(--bg)`, position relative): top row (mb8, 12.5) — legend gap16 `--fg-2`: 10×3 r2 swatches `--ac` "Revenue" / `--fg-3` "Costs"; right range toggle (pad2 `--line` border r6 11.5): "6M"/"1Y" active (`--bg-3` bg `--fg`)/"All", cells pad `3 8` r4.
  - **SVG** `viewBox="0 0 600 220"` w100% overflow visible: `<defs>` linearGradient `#vl-area` vertical, stops `var(--ac)` opacity .28 → 0. Gridlines x 20→580: y200 solid `--line-2` (baseline); y155/110/65/20 `--line` `stroke-dasharray="2 4"`. Y labels at x586, 10px `--fg-3` Geist Mono: "0"@y203, "60k"@y113, "120k"@y23. Then: `areaA` path fill `url(#vl-area)`; `lineB` stroke `--fg-3` w2 round join/cap; `lineA` stroke `--ac` w2.5 round. Crosshair: vertical line x=478.2, y 14→200, stroke `--fg-2` dash `3 3`; point B circle r4.5 fill `--bg` stroke `--fg-3` w2 @(478.2,105.5); point A r5 fill `--bg` stroke `--ac` w2.5 @(478.2,68) + halo r10 stroke `--ac` opacity .3 w1.
  - **Tooltip** (HTML, absolute `top:6px;left:79.7%;transform:translateX(calc(-100% - 14px))`): `width:172px;padding:10px 12px;border-radius:9px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-lg)` 12.5 gap6 — "Oct 2026" mono 11 `--fg-3`; row [8px r2 `--ac` swatch · "Revenue" `--fg-2` | "$88.0k" tabular w500]; row [`--fg-3` swatch · "Costs" | "$63.0k"]; divider row (`padding-top:6px;border-top:1px solid var(--line)` `--fg-3`): "Margin" | "28.4%" `--ok` tabular.
  - X labels row: space-between pad `6px 14px 0 12px` mono 10.5 `--fg-3`: Jan…Dec. Bottom-right caption (absolute right14 bottom10, mono 11 `--fg-3`): "draw-in 600ms swift-out · crosshair 100ms".
- **Composition** section: H2 22/600 −0.02em; code block per section-D "Code blocks" spec (pad `18px 20px` r10 `--bg-1` `--line` mono 13/1.65; tags `--fg`, punctuation+attr names `--fg-3`, string values `--ac-text`):
  ```
  <ChartContainer data={rows} motion="draw">
    <XAxis dataKey="month" /> <YAxis format="compact" />
    <AreaSeries dataKey="revenue" /> <LineSeries dataKey="costs" color="neutral" />
    <Tooltip /> <Crosshair /> <Legend />
  </ChartContainer>
  ```
- Two info cards (grid `1fr 1fr` gap12, `padding:16px 18px;border:1px solid var(--line);border-radius:10px;background:var(--bg-1)` 13.5/1.5 `--fg-2`, title w600 `--fg`): **"Accessible by default"** — "Every series renders a visually-hidden data table; the crosshair is keyboard-driven (← → by point, ↑ ↓ by series) and announces values via a live region." **"Motion is opt-out"** — "`motion="draw"` uses stroke-dashoffset; markers fade in after the line lands. Reduced motion renders the final frame with a 120ms crossfade." (inline code mono 12.5 `--fg`).

**Right rail (border-left `--line`, pad `36px 24px`, 13px):** "ON THIS PAGE" mono 11 ls .06em `--fg-3`; TOC (`border-left:1px solid var(--line)` gap2, items `padding:5px 14px` `--fg-2`): **Anatomy** active (`margin-left:-1px;border-left:2px solid var(--ac);color:var(--fg);font-weight:500`), Composition, Series types, Tooltip & crosshair, Motion, Accessibility, API. Below (mt12): "Was this page helpful?" card `padding:14px;border-radius:9px;border:1px solid var(--line)` 12.5 `--fg-2`, title `--fg` w500, "Yes"/"No" chips `padding:4px 10px;border-radius:6px;border:1px solid var(--line-2)`.

### 4b · Charts family (`/charts`)
Label "Charts". Purpose: showcase of the chart family — sparkline KPI cards, gauge, grouped bars, donut + legend, heatmap, loading skeleton, empty state. 1440w, `padding:56px 64px`, flex col gap28.

**Page header** (space-between align-end, `padding-bottom:20px;border-bottom:1px solid var(--line-2)`): eyebrow mono 12 ls .08em `--ac-text` "VELOCE CHARTS · 1.1"; H1 36/600 −0.035em "One palette, one motion, eight chart types". Right mono 12 `--fg-3` right-aligned /1.7: "series colors: accent → accent 60% → accent 35% → neutral" ⏎ "categorical fallback: hue-rotated at equal L/C". (The series ramp is used literally below: `var(--ac)` → `color-mix(in oklch,var(--ac) 60%,var(--bg-3))` → `color-mix(...35%...)` → `var(--fg-3)`.)

**Row 1 — KPI cards** (grid `repeat(4,1fr)` gap16; card `padding:18px 20px;border:1px solid var(--line);border-radius:12px;background:var(--bg-1)` col gap10; head row space-between 13 `--fg-2` with delta tabular; value 30/600 −0.03em tabular lh1, unit suffix 16 `--fg-3` w500 ml2; sparkline `<svg viewBox="0 0 100 32" preserveAspectRatio="none">` w100% h36 overflow visible, path `stroke-width:2` `vector-effect:non-scaling-stroke` round join):
1. "Weekly active users" / "+12.4%" `--ok` — **48,210** — spark1 stroke `--ac`, data `[12,14,13,18,17,22,21,26,30]`.
2. "p95 latency" / "−18ms" `--ok` — **142**ms — spark2 stroke `--fg-3`, `[40,38,41,37,35,36,33,31,30]`.
3. "Error rate" / "+0.3pp" `--err` — **1.9**% — spark3 stroke `--err`, `[5,9,7,12,10,14,13,15,19]`.
4. **Gauge**: "Build minutes" / "gauge" mono 11.5 `--fg-3`. 64px circle `background:conic-gradient(var(--ac) 0 68%,var(--bg-3) 68% 100%)` with 50px `--bg-1` inner disc showing "68%" 13/600 tabular; beside it (gap14) stack 12.5 `--fg-2`: "4,080" 18/600 `--fg` −0.02em tabular · "of 6,000 included" · "resets in 11 days" `--fg-3`.

**Row 2** (grid `1.4fr 1fr` gap16), both cards `border:1px solid var(--line);border-radius:12px;background:var(--bg-1);overflow:hidden` with header `padding:14px 18px;border-bottom:1px solid var(--line)` (title 14/600, sub 12.5 `--fg-3`, "⋯" overflow glyph `--fg-3`):
- **Grouped bar chart** — "Deployments per week" / "Production vs preview · last 8 weeks"; header legend 12.5 `--fg-2`, 10px r3 swatches: `--ac` Production, `color-mix(in oklch,var(--ac) 35%,var(--bg-3))` Preview. Body pad `16px 18px 10px`, SVG 600×220: baseline y200 `--line-2`; gridlines y140/80/20 `--line` dash `2 4`; `barsB` path first (fill the 35% mix), `barsA` on top (fill `--ac`) — bar geometry per shared math (22w, pitch 70, offsets 0/26, values above); **hover-column highlight** `<rect x="521" y="14" width="58" height="192" rx="6" fill="var(--fg)" fill-opacity=".05">` over the last group; y labels x586 10px mono `--fg-3`: 0@203, 80@83, 120@23. Week labels row space-between pad `6px 26px 0 22px` mono 10.5 `--fg-3`: W32…W39 (W39 `--fg`, hovered). Footer strip (`padding:10px 18px;border-top:1px solid var(--line)` mono 11 `--fg-3`, space-between): "bars grow from baseline · 400ms settle · stagger 30ms" | "hover: siblings dim to 60%, 150ms".
- **Donut** — "Traffic by source" / "30 days · 1.24M sessions". Body grid `auto 1fr` gap20 align-center pad `20px 18px`. Donut: 150×150 svg `transform:rotate(-90deg)`, all circles `cx=75 cy=75 r=54 fill=none stroke-width=18`: track `--bg-3`; then 4 arcs with the dash/offset pairs from shared math, strokes `--ac` / `color-mix(...60%...)` / `color-mix(...35%...)` / `--fg-3`. Center overlay (absolute inset-0 grid center): "46%" 22/600 −0.03em tabular lh1 + "Organic" 11 `--fg-3` mt3. Legend (col gap9, 13px; rows: 10px r3 swatch · label flex1 · sessions tabular `--fg-3` · pct tabular w36 right): **Organic search 571k 46%** hovered (`padding:6px 8px;margin:0 -8px;border-radius:7px;background:var(--bg-2)`, pct w500), Direct 335k 27%, Referral 211k 17%, Social 124k 10%. Footer strip mono 11 `--fg-3`: "arcs sweep clockwise 500ms · hovered arc offsets 4px · legend row is the a11y table".

**Row 3** (grid `1.4fr 1fr 1fr` gap16, same card/header pattern):
- **Heatmap** — "Request volume" / "Heatmap · hour × weekday"; header scale legend mono 10.5 `--fg-3`: "low" + 80×8 r4 `linear-gradient(90deg,var(--bg-3),var(--ac))` + "high". Body `padding:16px 18px` grid `34px 1fr` gap6 mono 10.5 `--fg-3`: day rail `grid-template-rows:repeat(7,18px)` gap3 (Mon…Sun); cell matrix `repeat(24,1fr) × repeat(7,18px)` gap3, each cell `border-radius:3px;background:color-mix(in oklch,var(--ac) N%,var(--bg-3))`. Intensity matrix N (hour 0→23; `ac` = plain `var(--ac)`; `ac*` = `var(--ac)` + hover ring `box-shadow:0 0 0 2px var(--bg-1),0 0 0 3px var(--fg)`):
  - Mon: 8,6,5,5,8,14,26,42,62,78,88,ac,84,90,94,82,66,50,40,34,28,20,14,10
  - Tue: 7,5,4,5,9,16,30,48,68,84,92,96,86,92,ac*,88,70,54,42,36,30,22,15,10
  - Wed: 7,5,4,5,8,15,28,46,66,80,90,94,84,90,96,84,68,52,40,34,28,20,14,9
  - Thu: 8,6,5,6,9,16,30,50,70,86,94,ac,88,92,96,86,70,54,42,36,30,22,16,10
  - Fri: 7,5,4,5,8,14,26,44,62,76,84,88,78,80,82,70,54,40,30,26,22,16,12,8
  - Sat: 5,4,3,3,4,6,10,16,22,28,32,34,32,34,36,32,28,24,22,20,18,14,10,6
  - Sun: 4,3,3,3,4,5,8,12,18,24,28,30,30,32,34,32,30,28,26,24,20,14,10,6
  Hour axis below (second grid row, empty first cell): space-between pt2: 00 · 06 · 12 · 18 · 23.
- **Loading** — "Loading" / "Skeleton keeps axes; series shimmer". Body flex col pad18 gap10: axes frame flex1 min-h140 `border-bottom:1px solid var(--line-2);border-left:1px solid var(--line-2)` relative; shimmer "series" block absolute `left:8px;right:8px;bottom:10px;height:60%;border-radius:8px`, `background:linear-gradient(90deg,var(--bg-3) 25%,var(--line-2) 50%,var(--bg-3) 75%) 0 0/200% 100%;animation:vl-shimmer 1.6s linear infinite`, `clip-path:polygon(0 90%,15% 70%,30% 78%,45% 50%,60% 58%,75% 30%,90% 38%,100% 10%,100% 100%,0 100%)` (fake mountain series); below, 4 tick placeholders 24×8 r4 `--bg-3` space-between.
- **Empty & error** — "Empty & error" / "Axes stay, message replaces series". Body grid place-items center, stack max-w220 gap8 centered: 36px r9 `--bg-3` icon tile "∿" `--fg-3` 15px; "No data for this range" 13.5/600; "Try the last 30 days, or connect a source." 12.5/1.5 `--fg-2`; soft button "Last 30 days" (h30 pad `0 11` r7 `--ac-soft` `--ac-text` 12.5 w500).

### 4c · Motion utilities (`/motion-utilities`)
Label "Motion utilities". Purpose: the `@veloce/motion` package — nine motion primitives, each as a card with a frozen mid-animation demo + spec chip + copy + API line, plus a choreography timeline. 1440w, `padding:56px 64px`, gap28.

**Page header** (same pattern as 4b): eyebrow "MOTION UTILITIES · @veloce/motion"; H1 36/600 −0.035em "Nine primitives, zero animation runtime"; right mono 12 `--fg-3` /1.7: "each utility compiles to CSS transitions / @keyframes" ⏎ "JS only for mount timing, measurement and preference".

**Primitive grid** `repeat(3,1fr)` gap16. **Common card anatomy**: `border:1px solid var(--line);border-radius:12px;background:var(--bg-1);overflow:hidden` flex col; demo stage h170 with dot-grid bg `radial-gradient(var(--line) 1px,transparent 1px) 0 0/14px 14px` (exception: Hooks card uses plain `var(--bg)` code panel); footer `padding:14px 16px;border-top:1px solid var(--line)` gap6 — title row (name 14.5/600 · spec chip mono 11 `--ac-text` baseline-right), body 12.5/1.5 `--fg-2` (inline code mono 12 `--fg`), `<pre>` API line mono 11.5 `--fg-3` /1.5 mt4.

1. **Presence** — chip "exit 150ms". Demo: 3 task rows (`padding:10px 12px;border-radius:8px;background:var(--bg-2);border:1px solid var(--line-2)` 13px, gap8 col, pad `0 28px`): "Run tests" with 16px r4 `--ac` ✓ tile (`--ac-fg` 9px w700); "Lint" frozen mid-exit — `opacity:.35;transform:scale(.97) translateX(6px);filter:blur(.5px)` + trailing mono 10.5 `--fg-3` "exiting · 150ms"; "Type-check" (empty 16px outline checkbox). Copy: "Keeps a child mounted through its exit animation. Fires `onExitComplete`." API: `<Presence show={visible} motion="scale-fade">`.
2. **Stagger** — chip "gap 40ms · cap 8". Demo: 4 member rows (`padding:7px 12px` r7 `--bg-2` `--line-2` 12.5, 22px avatar circle, name flex1, role 11 `--fg-3`) in progressive enter: Mara Kessler/Owner (avatar `oklch(0.55 0.12 292)`, settled); Jonas Lind/Editor (`oklch(0.6 0.12 200)`, `opacity:.85;translateY(2px)`); Amara Reyes/Editor (`oklch(0.62 0.12 40)`, `opacity:.55;translateY(5px) scale(.99);blur(.6px)`); Theo Brandt/Viewer (`--bg-3`, `opacity:.2;translateY(8px) scale(.97);blur(2px)`). Copy: "Offsets children's enter by index. Items past the cap animate together so long lists never feel slow." API: `<Stagger gap={40} max={8}>{rows.map(…)}</Stagger>`.
3. **NumberFlow** — chip "250ms settle". Demo (centered col gap10): "$124,[rolling]20" 44/600 −0.04em tabular lh1 — "$" prefix 26 `--fg-3` mr4; rolling digit column `height:1em;overflow:hidden;filter:blur(.5px)`, inner stack digits 5/6/7 each `height:1em`, `animation:vl-roll 2.4s cubic-bezier(.16,1,.3,1) infinite`; below: pill "▲ 2.9%" (pad `2 7` r999 bg `color-mix(in oklch,var(--ok) 15%,transparent)` `--ok` tabular) + "vs last month" `--fg-3` 12.5. Copy: "Digits roll independently; separators and currency stay put. Uses `Intl.NumberFormat`." API: `<NumberFlow value={mrr} format="currency" />`.
4. **LayoutGroup** — chip "200ms swift-out". Demo (centered col gap22): segmented control (pad3 r9 `--bg-2` `--line` 13) with mid-flight pill indicator — absolute `top:3px;bottom:3px;left:88px;width:96px` r6 `var(--bg)` shadow-sm `transform:scaleX(1.12);transform-origin:left` (the "rubber" stretch frame); tabs Overview/Usage/**Billing** (active `--fg` w500)/Members pad `6 14`. Below: underline tabs Preview/Code/**Props** (gap4, border-bottom `--line`, pad `6 12`) with stretching bar indicator `left:96px;width:80px;bottom:-1px;height:2px;border-radius:1px;background:var(--ac);transform:scaleX(1.25);transform-origin:left;opacity:.9`. Copy: "Shared indicators travel between siblings. Stretches mid-flight (the 'rubber' frame shown) — never overshoots." API: `<LayoutGroup id="tabs"> … <Indicator layoutId="pill" />`.
5. **Collapse** — chip "height 250ms settle". Demo: FAQ accordion (w100% `--line-2` border r9 `var(--bg)` 13, rows `padding:10px 12px` space-between, chevrons `--fg-3` ⌄): "Does it ship JS?" closed (border-bottom); "How do I theme it?" opening — w500, chevron `--ac-text` frozen at `rotate(120deg)`; answer panel mid-expand `height:34px;overflow:hidden` — text 12.5/1.45 `--fg-2` `transform:translateY(-6px);opacity:.7` ("Override CSS variables on any ancestor. Tokens cascade, so a card can carry its own accent.") with bottom fade overlay `linear-gradient(transparent,var(--bg))`; "Is it tree-shakeable?" closed `--fg-2` (border-top). Copy: "Animates to `height: auto` via one measurement. Content fades 60ms behind the box. Chevron rotates on the same curve." API: `<Collapse open={open}>…</Collapse>`.
6. **Reorder** — chip "lift 120ms · drop 250ms". Demo (col gap6 pad `0 28`, relative): row "⋮⋮ Install dependencies" (`padding:9px 12px` r8 `--bg-2` `--line-2` 13, grip `--fg-3` letter-spacing −2px); **drop slot** `height:38px;border-radius:8px;border:1px dashed var(--ac-line);background:var(--ac-soft)`; row "⋮⋮ Run migrations"; **dragged item** "⋮⋮ Build" floating (absolute `left:36px;right:20px;top:58px`, `transform:scale(1.03) rotate(-1deg);box-shadow:var(--shadow-lg),0 0 0 1px var(--ac-line)`, grip `--ac-text`, trailing mono 10.5 `--fg-3` "dragging"). Copy: "Pointer + keyboard (space, ↑↓) sorting. Siblings slide out of the way with LayoutGroup; the lifted item tilts 1°." API: `<Reorder.Group values={steps} onReorder={set}>`.
7. **Reveal** — chip "once · 200ms". Demo: viewport mock (w100% h130 `--line-2` border r9 `var(--bg)` overflow hidden): 2-col grid of 40px r6 `--bg-2` tiles (inset 12, gap8) in scroll-in cascade — tiles 1–2 settled (`--line` border); tile 3 `border:1px solid var(--ac-line);opacity:.8;translateY(6px) scale(.98)`; tile 4 `opacity:.4;translateY(10px) scale(.96);blur(1px)`; tiles 5–6 `opacity:0;translateY(14px)`; **threshold line** `top:76px;border-top:1px dashed var(--ac);opacity:.7` + label "viewport · threshold .2" mono 10 `--ac-text` (right8, top80); scrollbar hint 4×40 r2 `--line-2` (right4 top8). Copy: "IntersectionObserver toggles a class; the enter itself is CSS. Plays once by default so scrolling back never re-animates." API: `<Reveal threshold={0.2} stagger={40}>`.
8. **Morph** — chip "350ms settle". Demo (row centered gap14, → separators `--fg-3` 12): stage 1 solid button "New project" (h34 pad `0 13` r8 `--ac`/`--ac-fg` 13 w500) → stage 2 ghost frame `110×70;border-radius:10px;border:1.5px solid var(--ac-line);background:var(--ac-soft);opacity:.7` → stage 3 popover card (`width:150px;padding:10px;border-radius:11px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-lg)` col gap6 12px): "New project" w600, input placeholder bar h26 r6 `--line-2` border `var(--bg)`, submit block 22×60 r6 `--ac` self-end. Copy: "Trigger becomes the surface: shared `layoutId`, radius and color interpolate, content crossfades at 60%." API: `<Morph.Trigger layoutId="np"> · <Morph.Content layoutId="np">`.
9. **Hooks & helpers** — chip "1.1 kB gz". Demo: code panel (h170 pad `18px 20px` bg `var(--bg)` mono 12/1.6 `--fg-2`, keywords `--fg-3`, hook names `--ac-text`, strings `--ok`, numbers `--fg`): `const reduced = useMotionPreference()` / `const ref = useAnimationEnd(onDone)` / `const t = useMotionTokens() // { dur, ease }`; divider (`margin-top:6px;padding-top:8px;border-top:1px solid var(--line)`): `motion("scale-fade", { dur: 200 })` ⏎ `→ "vl-enter vl-scale-fade [--vl-dur:200ms]"`. Copy: "Preference, completion and token access for the rare case CSS can't express it. `motion()` returns class names — works with any styling layer."

**Choreography timeline panel** — `border:1px solid var(--line-2);border-radius:14px;background:var(--bg-1);padding:24px 28px` gap16, relative overflow hidden; decorative corner glow `position:absolute;inset:0;background:radial-gradient(500px 180px at 100% 0%,var(--ac-soft),transparent 70%)` (pointer-events none). Header: H2 20/600 −0.02em "Choreography: opening a dialog with a form"; sub 13 `--fg-3` "How the primitives compose. Total perceived time 280ms; nothing waits for anything else to finish."; right mono 11.5 `--fg-3` "0 — 400ms".
Timeline grid `150px 1fr` gap `8px 16px` 12.5 align-center; every track h22 with tick background `repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px 25%)`; bars `top:3px;bottom:3px;border-radius:4px` (left/width map linearly, 100% = 400ms). Ruler row (h14 mono 10 `--fg-3`): 0 @0% · 100 @25% · 200 @50% · 300 @75% · 400ms @right. Row labels `--fg-2` with mono-ish `--fg-3` qualifiers:
- "Backdrop · linear" — bar left 0, width 62.5% (0–250ms), `background:var(--fg-3);opacity:.5`.
- "Dialog · Presence" — left 0, width 50% (0–200ms), `var(--ac)`.
- "Fields · Stagger 40" — 3 overlapping bars: left 20% w50% `color-mix(in oklch,var(--ac) 70%,var(--bg-3))`; left 30% w50% (`top:8px;bottom:8px;border-radius:3px`) 50% mix; left 40% w50% (thin) 35% mix.
- "Focus ring · 150ms" — left 45% w37.5%, `border:1.5px solid var(--ac);background:var(--ac-soft)`.
- "Trigger · press 100ms" — left 0 w25%, `background:var(--bg-3);border:1px solid var(--line-2)`.
- Marker row (h18): vertical dashed rule at left 70% (`border-left:1px dashed var(--fg-2)`) + label "280ms · interactive" mono 10.5 `--fg-2` (translateX 8px).
Footer notes (flex mono 11.5 `--fg-3`): "reduced motion: every bar collapses to a 120ms crossfade at t=0" · right-aligned "exit reverses in 150ms; fields don't stagger on the way out".

## F. Artboard 5a

### 5a · Charts catalogue (`/charts` — catalogue view; relates to `/docs/charts/*` per-series pages)
Marker: `<!-- ═══ 5a · CHARTS CATALOGUE ═══ -->` (design file lines 53–112). `data-screen-label="Charts catalogue"`. Artboard caption: "Charts catalogue — every series type + shared parts (axes, legend, tooltip, brush, export, a11y) · 1440". Purpose: a single reference page showing all 16 series types rendered with one shared grammar, plus the six shared chart parts. 1440w, `padding:56px 64px`, flex col gap28, `background:var(--bg);border:1px solid var(--line);border-radius:12px;overflow:hidden`.

**Page header** (same pattern as 4b/4c: space-between align-end, `padding-bottom:20px;border-bottom:1px solid var(--line-2)`): eyebrow mono 12 ls .08em `--ac-text` "VELOCE CHARTS · CATALOGUE"; H1 36/600 −0.035em "16 series types, one grammar". Right mono 12 `--fg-3` right-aligned /1.7: "`<ChartContainer>` + any mix of *Series children" ⏎ "same axes, tooltip, legend, brush and a11y layer everywhere".

### Shared catalogue-tile SVG math (from the design script — "chart catalogue" section)
All tile charts use `viewBox="0 0 300 160"`, plot area x 10..290, y 10..150 (height 140):
- `cx(i,n) = 10 + i·(280/(n−1))` ; `cy(v,mx) = 150 − (v/mx)·140`
- `path(arr,mx)` = polyline `M/L cx(i,arr.length) cy(v,mx)` (coords to 1 decimal)
- Data: `S1 = [20,26,24,32,30,38,36,44,50,48,56,60]`, `S2 = [14,16,18,17,22,24,26,25,30,33,32,36]`, `top = S1+S2` elementwise. All with `mx=100` unless noted.
- `stackLine1 = path(S1,100)`; `stackLine2 = path(top,100)`; `stackLow = path(S1,100) + " L290 150 L10 150 Z"`; `stackHigh` = closed band between `top` and `S1` (forward over top, reverse L-segments back over S1, then Z).
- Step: `stepVals = [30,30,48,48,42,42,66,66,60,60,84,84]`; x for index i = `10 + floor(i/2)·(280/6) + (i%2)·(280/6)`, y = `cy(v,100)` (6 flat treads).
- Horizontal bars: `hb = [92,74,61,38,22]`; per bar i: rect `M64 (16+i·27) h (v/100·220) v17 h−(…) z`.
- Stacked bars: groups `sb = [[30,20,12],[38,22,10],[26,30,14],[44,18,16],[40,28,12],[52,24,18]]`; for layer k and group i: `x = 18 + i·46`, `base = sum of g[0..k)`, `hgt = g[k]/100·140`, rect `M x (150 − base/100·140 − hgt) h28 v hgt h−28 z` → placeholders `sbars0/sbars1/sbars2`.
- Scatter: deterministic LCG `seed=7; seed=(seed·9301+49297)%233280; rnd=seed/233280`; 28 points `{x:rnd(), y:clamp(x·0.7 + rnd()·0.35 − 0.1, 0, 1)}`; each drawn as a 3.5-radius circle path at `(10+x·280, 150−y·140)`. Trend line: `M10 cy(12,100) L290 cy(88,100)`.
- Radar: center (150,82), R=62, 6 axes; `radarPt(v,i) = (150+cos(a)·62·v, 82+sin(a)·62·v)` with `a = −π/2 + i·2π/6`. Grid rings at v = 1/.66/.33 (`rg0/rg1/rg2`); `radarAxes` = 6 spokes from center to v=1. Series `radarA = [.9,.7,.8,.6,.85,.75]`, `radarB = [.5,.8,.45,.9,.4,.6]`.
- Funnel: `fun = [100,64,38,21,12]`; stage i (0..3): trapezoid centered x=150, top width `fun[i]/100·260`, bottom width `fun[i+1]/100·260`, `y = 12 + i·34`, height 30 → `f0..f3`.
- Candlestick: 14 OHLC tuples `[[40,52,36,50],[50,58,46,44],[44,47,38,40],[40,56,39,54],[54,62,50,60],[60,61,48,52],[52,66,50,64],[64,70,60,68],[68,72,58,60],[60,66,55,64],[64,78,62,76],[76,80,70,72],[72,74,64,66],[66,84,65,82]]`; `x = 14 + i·20`; wick `M x cy(hi) v (cy(lo)−cy(hi))`, body `M x−5 cy(max(o,c)) h10 v (cy(min(o,c))−cy(max(o,c))) h−10 z` (mx=100); close≥open → `candleUp`, else `candleDown`.
- Composed: bars `[48,56,44,70,66,82,78,96]` mx=120, `M (20+i·35) cy(v,120) h20 v (150−cy) h−20 z`; line `[22,30,28,44,42,58,60,74]` mx=120, points at `x = 30+i·35`.
- Waterfall: steps `[{v:60,d:0},{v:18,d:1},{v:−12,d:−1},{v:24,d:1},{v:−8,d:−1},{v:14,d:1}]` mx=120; running total; bar i at `x = 16+i·40` w26 spanning `cy(max(from,to))..cy(min(from,to))`; first bar → `wfTot`, d>0 → `wfPos`, d<0 → `wfNeg`; connectors `wfConn`: `M x+26 cy(run) h14` after each bar; final total bar `M256 cy(run) h26 v (150−cy(run)) h−26 z` appended to `wfTot`.
- Pie (full, no hole): circles `cx=80 cy=80 r=40 stroke-width=80`, svg `viewBox 0 0 160 160` rotated −90°; `PC = 2π·40`; slices `[38,27,20,15]%` → `{dash: "len (PC−len)", offset: −cumulative}` = `p1..p4`.
- Gauge arc: track+value paths `M80 130 A70 70 0 0 1 220 130` stroke-width 16 round caps; `GC = π·70`; `gaugeDash = (GC·0.72) GC` (72% fill; displayed value "72").
- Treemap `tm`: pixel rects (in 300×160 space) converted to %: Organic `{x:10,y:10,w:150,h:140}` 38%, Direct `{164,10,126,72}` 27%, Referral `{164,86,70,64}` 20%, Social `{238,86,52,30}` 9%, Email `{238,120,52,30}` 6% (x,w ÷300·100; y,h ÷160·100, 1 decimal).
- Reused from 4a/4b math: `spark(arr)` normalized to viewBox 100×32 (`x = i·100/(n−1)`, `y = 30 − (v−min)/(max−min)·26`) with `spark1 [12,14,13,18,17,22,21,26,30]`, `spark2 [40,38,41,37,35,36,33,31,30]`, `spark3 [5,9,7,12,10,14,13,15,19]`; donut `d1..d3` (`C = 2π·54`, slices 46/27/17/10, same dash/offset scheme); `lineA` = `lp(A)` in 600×220 space (`A = [42,48,45,61,58,72,69,84,91,88,104,112]`, `xs(i,n)=20+i·(560/(n−1))`, `ys(v)=200−(v/120)·180`).

### Series grid — `grid-template-columns:repeat(4,1fr)` gap16, 12 tiles
**Common tile anatomy**: `border:1px solid var(--line);border-radius:12px;background:var(--bg-1);overflow:hidden` flex col. Head row (space-between baseline, `padding:12px 14px 6px`): name 14/600 · motion chip mono 10.5 `--fg-3`. SVG `viewBox="0 0 300 160"` w100% h auto `padding:0 6px`. Footer API line: `padding:8px 14px 12px;border-top:1px solid var(--line)` mono 11 `--fg-3`. Baseline in most tiles: `<line x1=10 y1=150 x2=290 y2=150 stroke=var(--line-2)>`; gridlines at y80/y10 `var(--line)` dash `2 4` where present.

1. **Line** — chip "draw 600ms". Baseline + gridlines y80/y10. `stackLine2` stroke `--fg-3` w2; `stackLine1` stroke `--ac` w2.5 round join; end marker `<circle cx=290 cy=66 r=4 fill=var(--bg) stroke=var(--ac) stroke-width=2.5>`. API: `<LineSeries curve="monotone" />`.
2. **Area · stacked** — chip "rise 500ms". Baseline; `stackHigh` fill `--ac` opacity .28; `stackLow` fill `--ac` opacity .6; `stackLine2` stroke `--ac` w1.5 opacity .7; `stackLine1` stroke `--ac` w2. API: `<AreaSeries stackId="a" /> ×2`.
3. **Step** — chip "draw 600ms". Baseline + gridline y80; `stepPath` stroke `--ac` w2.5; reference area `<rect x=196 y=10 width=47 height=140 fill=var(--ac) fill-opacity=.08>` + label "deploy" 9px mono `--ac-text` at (200,22). API: `<LineSeries curve="step" /> + <ReferenceArea />`.
4. **Bar · horizontal** — chip "grow 400ms · stagger 30". Category labels 10px `--fg-2` text-anchor end at x56, y 29/56/83/110/137: Chrome, Safari, Firefox, Edge, Other; axis `<line x1=64 y1=10 x2=64 y2=150 stroke=var(--line-2)>`; `hbars` fill `--ac`; end label "92k" mono 10 `--fg` anchor end at (270,29). API: `<BarSeries layout="horizontal" label="end" />`.
5. **Bar · stacked** — chip "grow 400ms". Baseline; `sbars0` fill `var(--ac)`, `sbars1` fill `color-mix(in oklch,var(--ac) 60%,var(--bg-3))`, `sbars2` fill `color-mix(in oklch,var(--ac) 30%,var(--bg-3))`. API: `<BarSeries stackId="b" radius="top" /> ×3`.
6. **Composed** — chip "bars → line, 200ms offset". Baseline; `compBars` fill `color-mix(in oklch,var(--ac) 35%,var(--bg-3))`; `compLine` stroke `--ac` w2.5; right-axis hint "y₂ →" 9px mono `--fg-3` anchor end at (292,14). API: `<BarSeries /> + <LineSeries yAxisId="right" />`.
7. **Scatter** — chip "pop 250ms · stagger 8". Baseline + y-axis line x10; `trend` stroke `--fg-3` dash `4 4` w1.5; `scatter` fill `--ac` opacity .75, stroke `--bg-1` w1. API: `<ScatterSeries /> + <TrendLine method="linear" />`.
8. **Candlestick** — chip "wick → body, 300ms". Baseline + gridline y80; `candleUp` fill+stroke `var(--ok)` w1.5; `candleDown` fill+stroke `var(--err)` w1.5. API: `<CandlestickSeries up="ok" down="err" />`.
9. **Pie** — chip "sweep 500ms". Body row (gap16 `padding:6px 14px`): svg 160-viewBox 120×120px rotate(−90deg), 4 slice circles (strokes: `--ac`, 60% mix, 35% mix, `--fg-3`) with `p1..p4` dash/offset, plus outline circle r80 stroke `--bg-1` w2. Legend col gap6 12px `--fg-2`, rows with 8px r2 swatch + name + right-aligned tabular pct `--fg`: Pro 38%, Team 27%, Hobby 20%, Ent. 15%. API: `<PieSeries padAngle={1} />`.
10. **Radar** — chip "unfold from center 400ms". Grid polygons `rg0` (stroke `--line-2`), `rg1`/`rg2` (stroke `--line`); `radarAxes` stroke `--line`; `radarB` fill `--fg-3` opacity .2 stroke `--fg-3` w1.5; `radarA` fill `--ac` opacity .25 stroke `--ac` w2. Axis labels 9px `--fg-3`: Speed (150,12 mid), A11y (222,52), DX (222,122), Size (150,156 mid), Motion (78,122 end), Theming (78,52 end). API: `<RadarSeries /> ×2 + <PolarGrid levels={3} />`.
11. **Funnel** — chip "cascade 60ms/stage". `f0` fill `--ac`; `f1` 75% mix; `f2` 50% mix; `f3` 30% mix (all `color-mix(in oklch,var(--ac) N%,var(--bg-3))`). Stage labels 10px w600 centered x150 at y 32/66/100/134: "Visited · 48.2k" + "Signed up · 64%" (fill `--ac-fg`), "Installed · 38%" + "Deployed · 21%" (fill `--fg`). API: `<FunnelSeries label="inside" />`.
12. **Waterfall** — chip "left → right, 40ms". Baseline; `wfConn` stroke `--line-2` dash `2 2`; `wfTot` fill `--fg-2`; `wfPos` fill `--ok`; `wfNeg` fill `--err`. API: `<WaterfallSeries total="end" />`.
13. **Treemap** — chip "tiles scale-in 250ms". Body: relative box `aspect-ratio:300/160;margin:0 6px`; for each `tm` entry an absolute div at `left/top/width/height` % with `padding:6px 8px;border:2px solid var(--bg-1);border-radius:6px;background:var(--ac)`, 11px w500 `--ac-fg`, col space-between: label + pct (mono 10, opacity .8). API: `<TreemapSeries tile="squarify" />`.
14. **Gauge · arc** — chip "needle settle 600ms". Track arc `M80 130 A70 70 0 0 1 220 130` stroke `--bg-3` w16 round; value arc same path stroke `--ac` `stroke-dasharray={gaugeDash}`. Center "72" 28px/600 ls −1 anchor mid (150,118); "Lighthouse perf" 10px `--fg-3` (150,134); scale "0"/"100" 9px mono at (72,150)/(228,150). API: `<Gauge shape="arc" thresholds={[50,90]} />`.
15. **Sparkline** — chip "inline · 300ms". Body (`padding:8px 14px` col gap8 12.5px), 4 metric rows (label w64 `--fg-2` · viz flex1 · value tabular w40 right): Requests → `spark1` stroke `--ac` (svg 100×32 preserveAspectRatio none, h22, w2 non-scaling) "1.2M"; Latency → `spark2` stroke `--fg-3` "142ms"; Errors → `spark3` stroke `--err` "1.9%"; Uptime → 12 status bars (flex gap2, each flex1 h14 r2): ok,ok,ok,**warn**,ok,ok,**err**,ok,ok,ok,ok,ok — "99.9%". API: `<Sparkline type="line" | "bar" | "status" />`.
16. **Heatmap · Donut** — chip is a cross-ref link: "see 4b" (anchor `#4b`). Body grid `1fr auto` gap14: 7-col mini heatmap (cells `aspect-ratio:1;border-radius:2px;background:color-mix(in oklch,var(--ac) N%,var(--bg-3))`, N row-major: 10,30,60,ac(100),70,40,15 / 8,25,55,90,65,35,12 / 6,18,40,60,45,22,8) + donut svg 150-viewBox 84×84px rotate(−90deg) (track `--bg-3` + `d1/d2/d3` arcs: `--ac`, 60% mix, 35% mix, all r54 w18). API: `<HeatmapSeries /> · <PieSeries innerRadius={0.7} />`.

### Shared parts section
Header row (baseline gap12): H2 18/600 −0.02em "Shared parts" + mono 11.5 `--fg-3` "identical across every series type". Grid `repeat(3,1fr)` gap16, same tile anatomy as above.

1. **Axes & grid** — chip "ticks fade 150ms on rescale". SVG 300×160: y-axis x44 (10→130) + x-axis y130 (44→290) `--line-2`; gridlines y70/y10 `--line` dash `2 4`; y tick labels 9px mono `--fg-3` anchor end x38: "0"@133, "50k"@73, "100k"@13; x tick marks (5px stubs below y130) at x 44/126/208/290 with labels @y146: Jul, Aug, Sep, Oct (Oct fill `--fg`, rest `--fg-3`); reference line y46 (44→290) stroke `--warn` dash `4 3` w1.5 + label "target 70k" 9px mono `--warn` anchor end (288,42); rotated y-axis title "Sessions" 9px `--fg-3` `transform=rotate(-90 12 70)` anchor mid. API: `<XAxis scale="time" ticks="auto" /> <YAxis format="compact" label /> <ReferenceLine />`.
2. **Legend** — chip "toggle · hover isolates". Body col gap12 12.5px. Chip variant (flex wrap gap6): pills h26 `padding:0 9px` r999 `border:1px solid var(--line-2);background:var(--bg-2)` with 8px r2 swatch — Revenue (`--ac`), Costs (60% mix), **Refunds toggled-off** (dashed border, `--fg-3` text, line-through, `--bg-3` swatch), **Tax focus-ring** (`box-shadow:0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)`, `--fg-3` swatch). List variant (below `border-top:1px solid var(--line)` pt10, col gap6): rows 14×3 r2 color bar · name flex1 · tabular value `--fg-2` — Revenue $88.0k; Costs $63.0k at `opacity:.45` (dimmed by hover); note mono 10.5 `--fg-3` "hover row → other series dim to 45%, 150ms". API: `<Legend variant="chips" | "list" interactive />`.
3. **Tooltip variants** — chip "follows pointer, 100ms lerp". Three demos (flex gap10 wrap, 12px): (a) multi-series card `padding:8px 10px;border-radius:8px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-md)` min-w120 — "Oct 12" mono 10.5 `--fg-3`; rows swatch 7px r2 + name `--fg-2` / value tabular w500: Revenue `--ac` $3.1k, Costs `--fg-3` $2.2k. (b) minimal: inverted pill `padding:4px 8px;border-radius:6px;background:var(--fg);color:var(--bg)` mono 11 tabular "$3,104". (c) rich card min-w130: "Chrome 92k" row; 4px r2 progress track `--bg-3` with 78% `--ac` fill; "78% of total · ▲ 4.1%" mono 10.5 `--fg-3`. Caption full-width mono 10.5 `--fg-3`: "multi-series · minimal · rich (custom render)". API: `<Tooltip variant="multi" | "minimal" render={fn} />`.
4. **Brush · zoom & pan** — chip "rescale 250ms settle". SVG 300×160: main chart = `lineA` (600×220-space path) with `transform="translate(0 0) scale(0.5 0.42)"` stroke `--ac` w4 (scales to w2 visually) over baseline y100; mini-map: `<rect x=10 y=118 width=280 height=30 rx=4 fill=var(--bg-2) stroke=var(--line)>` containing `lineA` at `transform="translate(10 118) scale(0.4667 0.1364)"` stroke `--fg-3` w6; selection window `<rect x=96 y=118 width=112 height=30 rx=4 fill=var(--ac) fill-opacity=.18 stroke=var(--ac)>`; drag handles `<rect x=93/205 y=124 width=6 height=18 rx=2 fill=var(--fg)>`; captions 9px mono `--fg-3` @y112: "Jun 4 – Aug 20" (left), "⌥ + wheel · pinch · drag" (right, anchor end). API: `<Brush height={30} /> · zoom={{ wheel: "alt", pinch: true }}`.
5. **Toolbar & export** — chip "menu unfold 180ms". Body relative min-h236: toolbar right-aligned (gap4) of 28×28 r6 icon buttons `border:1px solid var(--line-2)` `--fg-2`: ⊞, ⛶, ↓ (↓ active: `background:var(--bg-3);color:var(--fg)`). Open menu absolute right14 top44 w190 `padding:4px;border-radius:9px;background:var(--bg-2);border:1px solid var(--line-2);box-shadow:var(--shadow-lg)` 12.5px, items `padding:7px 9px`: "Download PNG" highlighted (`border-radius:6px;background:var(--bg-3)`, trailing "2×" mono 10.5 `--fg-3`), "Download SVG", "Copy as image", divider (1px `--line`, `margin:4px 0`), "Export CSV", "Copy data as JSON", divider, "Show data table" with kbd hint "T". API: `<ChartToolbar export={["png","svg","csv"]} fullscreen />`.
6. **Accessibility layer** — chip "WCAG 2.2 AA" in `--ok`. Body col gap8 12.5/1.45 `--fg-2`: mini data table (`border:1px solid var(--line);border-radius:7px` 11.5px; header row grid `1fr 1fr 1fr` `padding:5px 9px;background:var(--bg-2)` mono 10 ls .06em `--fg-3`: MONTH / REVENUE / COSTS right-aligned; rows tabular with `border-top:1px solid var(--line)`: Sep $91.0k $58.0k; Oct $88.0k $63.0k — Oct row highlighted `background:var(--ac-soft);color:var(--fg)`). Copy: "Visually-hidden `<table>` mirrors every series; toggle visible with `T`. Keyboard: ← → point, ↑ ↓ series, Home/End. Live region announces "October, Revenue, 88 thousand"." Note mono 10.5 `--fg-3`: "series colors pass 3:1 against canvas; patterns available via fill="pattern"". API: `<ChartContainer a11y={{ table: "toggle", announce: true }} />`.

### Motion summary (per-tile chips, for `/motion-utilities` cross-ref)
line/step draw 600ms · area rise 500ms · bars grow 400ms (stagger 30) · composed bars→line 200ms offset · scatter pop 250ms stagger 8 · candlestick wick→body 300ms · pie sweep 500ms · radar unfold 400ms · funnel cascade 60ms/stage · waterfall left→right 40ms · treemap scale-in 250ms · gauge needle settle 600ms · sparkline 300ms · axes ticks fade 150ms on rescale · legend hover-dim 150ms · tooltip pointer lerp 100ms · brush rescale settle 250ms · export menu unfold 180ms.
