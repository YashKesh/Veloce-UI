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

const ACCENTS: Accent[] = ['violet', 'lime', 'cyan', 'blue', 'emerald', 'amber', 'rose']
const readAccent = (): Accent => {
  if (typeof localStorage === 'undefined') return 'violet'
  const v = localStorage.getItem('vl-accent') as Accent | null
  return v && ACCENTS.includes(v) ? v : 'violet'
}
const readMode = (): Mode => {
  if (typeof localStorage === 'undefined') return 'dark'
  const v = localStorage.getItem('vl-mode')
  return v === 'light' || v === 'dark' ? v : 'dark'
}
const readRm = (): boolean => {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem('vl-rm') === 'true'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<Accent>(readAccent)
  const [mode, setMode] = useState<Mode>(readMode)
  const [reducedMotion, setReducedMotion] = useState<boolean>(readRm)

  useEffect(() => {
    const el = document.documentElement
    el.dataset.accent = accent
    el.dataset.mode = mode
    el.dataset.rm = String(reducedMotion)
    try {
      localStorage.setItem('vl-accent', accent)
      localStorage.setItem('vl-mode', mode)
      localStorage.setItem('vl-rm', String(reducedMotion))
    } catch {}
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
