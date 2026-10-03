# @veloce/ui

Motion-first React UI primitives. Zero runtime, OKLCH-themed, SSR-safe.

## Install

```bash
npm i @veloce/ui
```

Peer deps: `react ^19`, `react-dom ^19`.

## Usage

```tsx
import { Button, Dialog } from "@veloce/ui"
import "@veloce/ui/styles.css"

export function App() {
  return <Button variant="primary">Hello</Button>
}
```

Import `@veloce/ui/styles.css` once at your app root. The stylesheet provides the OKLCH tokens (`--bg`, `--fg`, `--ac`, etc.) and the `vl-spin` / `vl-shimmer` keyframes used by Spinner / Skeleton.

## Components

- `Button` — primary / ghost / outline / destructive; sm / md / lg; `isLoading`, `leftIcon`, `rightIcon`.
- `Badge` — tone + solid / soft / outline.
- `Chip` — Badge with optional `onRemove`.
- `Card` — padded container; `Card.Header`, `Card.Body`, `Card.Footer`.
- `Avatar` — image or auto-colored initials.
- `Separator` — thin divider, horizontal or vertical.
- `Input` — styled text input with prefix / suffix / invalid.
- `Textarea` — multi-line input, optional `autoResize`.
- `Spinner` — circular loader.
- `Skeleton` — shimmer placeholder, text / block / circle.
- `Alert` — info / ok / warn / err with title + dismiss.
- `Dialog` — controlled modal with Esc + backdrop close + focus trap.

## Theming

Override any OKLCH token on `:root` or a scoped container:

```css
:root {
  --ac: oklch(0.72 0.2 160);     /* accent */
  --ac-fg: oklch(0.15 0.03 160); /* accent foreground */
  --bg: oklch(0.14 0.01 240);    /* page background */
}
```

The library also ships preset accents: `data-accent="lime" | "cyan" | ...`.

## Customizing

Every primitive is fully customizable without `!important` or workarounds.

### 1. Pass `style` or `className` — both merge with defaults

```tsx
<Button
  variant="primary"
  style={{ background: 'oklch(0.6 0.22 30)' }}  // overrides background
  className="my-cta"                             // appends to `vl-btn`
>
  Call to action
</Button>
```

The library's inline `style` keys you didn't set (border, radius, padding, height, …) stay intact; the keys you supplied win. `className` is concatenated, not replaced.

### 2. Override via plain CSS

All library CSS lives inside a cascade layer called `veloce-ui`. Any un-layered rule in your app automatically beats layered rules — no `!important` needed.

```css
/* your app css */
.my-cta { background: oklch(0.6 0.22 30); color: white; }
```

```tsx
<Button className="my-cta">Call to action</Button>
```

Every primitive exposes a stable base className for global targeting:

| Component  | className |
|---         |---        |
| Button     | `vl-btn`  |
| Badge      | `vl-badge` |
| Chip       | `vl-chip` |
| Card / Header / Body / Footer | `vl-card` / `vl-card__header` / `vl-card__body` / `vl-card__footer` |
| Avatar     | `vl-avatar` |
| Separator  | `vl-separator` |
| Input      | `vl-input` |
| Textarea   | `vl-textarea` |
| Spinner    | `vl-spinner` |
| Skeleton   | `vl-skeleton` |
| Alert      | `vl-alert` |
| Dialog / Header / Body / Footer | `vl-dialog` / `vl-dialog__header` / `vl-dialog__body` / `vl-dialog__footer` |

### 3. Override tokens globally

Redefine `--ac`, `--bg`, etc. in your own `:root` (or any ancestor selector). Because the library's tokens sit inside `@layer veloce-ui`, your un-layered `:root { ... }` wins:

```css
:root {
  --ac: oklch(0.72 0.2 160);
  --bg: oklch(0.14 0.01 240);
}
```

## Status

**v0.1** — primitives only. Coming next: Charts, Data Grid, Navbar, Sheet, Popover.
