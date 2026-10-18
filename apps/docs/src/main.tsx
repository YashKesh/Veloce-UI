import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import './styles/tokens.css'
import './styles/ui.css'
import 'veloce-ui/styles.css'
import { ThemeProvider } from './theme'
import App from './App'

// Hold the SSR splash on screen for a minimum beat so the branded loader
// is actually seen rather than flashing by on fast networks. Only affects
// the first full page load; client-side navigations after that are instant.
const SPLASH_MIN_MS = 900
const mountedAt = performance.now()

function mount() {
  const root = document.getElementById('root')!
  // Fade the SSR shell out before React replaces it so the handoff feels
  // intentional instead of a hard swap.
  const shell = root.querySelector('.vl-ssr-shell') as HTMLElement | null
  const render = () =>
    createRoot(root).render(
      <StrictMode>
        <HelmetProvider>
          <ThemeProvider>
            <BrowserRouter>
              <App />
              <Analytics />
            </BrowserRouter>
          </ThemeProvider>
        </HelmetProvider>
      </StrictMode>,
    )
  if (shell) {
    shell.style.transition = 'opacity 220ms ease-out'
    shell.style.opacity = '0'
    window.setTimeout(render, 220)
  } else {
    render()
  }
}

const elapsed = performance.now() - mountedAt
if (elapsed >= SPLASH_MIN_MS) mount()
else window.setTimeout(mount, SPLASH_MIN_MS - elapsed)
