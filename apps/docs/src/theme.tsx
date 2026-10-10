import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Accent = 'violet' | 'lime' | 'cyan' | 'blue' | 'emerald' | 'amber' | 'rose'
export type Mode = 'dark' | 'light'

interface Theme {
  accent: Accent
  mode: Mode
  reducedMotion: boolean
  setAccent: (a: Accent) => void
  setMode: (m: Mode) => void
  setReducedMotion: (rm: boolean) => void
}

const ThemeContext = createContext<Theme | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<Accent>('violet')
  const [mode, setMode] = useState<Mode>('dark')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const el = document.documentElement
    el.dataset.accent = accent
    el.dataset.mode = mode
    el.dataset.rm = String(reducedMotion)
  }, [accent, mode, reducedMotion])

  return (
    <ThemeContext.Provider value={{ accent, mode, reducedMotion, setAccent, setMode, setReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
