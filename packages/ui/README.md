# Veloce UI

> Motion-first React 19 component library — 36 primitives, 13 charts, OKLCH-themed, zero runtime, SSR-safe.

[![npm](https://img.shields.io/npm/v/veloce-ui.svg)](https://www.npmjs.com/package/veloce-ui)
[![MIT](https://img.shields.io/npm/l/veloce-ui.svg)](https://github.com/YashKesh/Veloce-UI/blob/main/LICENSE)
[![tests](https://img.shields.io/badge/tests-310%20passing-brightgreen)](https://github.com/YashKesh/Veloce-UI)

---

## Install

```bash
npm install veloce-ui
```

Peer deps: `react@>=19`, `react-dom@>=19`.

## Use

```tsx
import { Button, DataGrid, LineChart } from 'veloce-ui'
import 'veloce-ui/styles.css'

export function App() {
  return (
    <>
      <Button variant="primary">Deploy</Button>
      <LineChart
        data={[
          { label: 'Jan', value: 24 },
          { label: 'Feb', value: 38 },
          { label: 'Mar', value: 52 },
        ]}
        height={220}
      />
    </>
  )
}
```

That's it — no provider required for most components. `TooltipProvider` and `ToastProvider` are optional for apps that use those primitives.

## What's in the box

**36 primitives**
Button · Badge · Chip · Card · Avatar · Separator · Input · Textarea · Select · Checkbox · Radio · Switch · Slider · ToggleGroup · Tabs · Dialog · Sheet · DropdownMenu · Popover · Tooltip · Command · Toast · Alert · Progress · Spinner · Skeleton · EmptyState · Breadcrumbs · Pagination · Stepper · Accordion · Navbar · Sidebar · Table · DataGrid

**13 chart types**
LineChart · AreaChart · BarChart · SparklineChart · PieChart · ScatterChart · CandleChart · RadarChart · FunnelChart · WaterfallChart · TreemapChart · HeatmapChart · GaugeChart

**4 layout primitives**
Container · Grid · Stack · AspectRatio

**4 motion utilities**
`<Presence>` · `<Stagger>` · `<NumberFlow>` · `useMotionPreference()`

## Why Veloce UI

- **Motion-first.** Every component ships with the right enter/exit, hover, press, and focus animations. Reduced-motion respected everywhere.
- **Zero runtime.** No `styled-components`, no Emotion, no CSS-in-JS cost. Shipped as plain CSS wrapped in `@layer veloce-ui` so your own styles beat it without `!important`.
- **OKLCH-themed.** Three accent palettes (Violet / Lime / Cyan) via a single `data-accent` attribute. Dark + light modes via `data-mode`. All tokens live as CSS custom properties — override at any scope.
- **SSR-safe.** No `window` reads at module scope. Works in Next.js, Remix, Astro, plain SPA.
- **Full data grid.** Virtualized rows (via `@tanstack/react-virtual`), column pinning, resizing, visibility menu, inline editing, quick filter, multi-sort, selection — in one component.
- **Charts you'd actually ship.** Not toys. Hover tooltips, mount animations, threshold bands, legends, OKLCH-palette fallbacks, forwardRef on every `<svg>`.

## Theming

Scope colors with a `data-accent` attribute anywhere in the DOM:

```html
<html data-mode="dark" data-accent="violet">
  …
  <div data-accent="lime">
    <Button variant="primary">Lime button in a violet page</Button>
  </div>
</html>
```

Override any token with CSS variables:

```css
:root {
  --ac: oklch(0.65 0.2 150);     /* main accent */
  --ac-fg: oklch(0.99 0.01 150); /* foreground on accent */
  --r-md: 10px;                   /* border radius */
}
```

Per-component override via inline style (inline always beats layered CSS):

```tsx
<Button style={{ background: 'oklch(0.65 0.2 25)' }}>Custom red</Button>
```

## Docs & demos

- Live site: [veloceui.codeloomdevv.co.in](https://veloceui.codeloomdevv.co.in)
- Component gallery: [/components](https://veloceui.codeloomdevv.co.in/components)
- Chart catalogue: [/charts](https://veloceui.codeloomdevv.co.in/charts)
- GitHub: [YashKesh/Veloce-UI](https://github.com/YashKesh/Veloce-UI)

## Size

- Library bundle: ~209 KB ESM / ~215 KB CJS (minified, pre-gzip)
- CSS: ~22 KB uncompressed, ~4 KB gzip
- Tree-shakeable — import only what you use

## Browser support

Any evergreen browser that supports CSS `color-mix(in oklch, …)` — Chrome/Edge 111+, Firefox 113+, Safari 16.4+. For older targets, swap the OKLCH tokens for `oklab` or sRGB equivalents in your theme CSS.

## Status

v0.1.0 — API is stable for the shipped primitives. Minor versions may add new components; breaking changes to existing APIs will go in major versions with a migration note.

## License

MIT © [YashKesh](https://github.com/YashKesh)
