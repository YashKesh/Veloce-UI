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

// Short branded splash so the brand mark registers before the app takes over.
// Fast enough to feel instant, long enough to not look like a flash of unstyled content.
const SPLASH_MIN_MS = 400
const mountedAt = performance.now()

function mount() {
  const root = document.getElementById('root')!
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
