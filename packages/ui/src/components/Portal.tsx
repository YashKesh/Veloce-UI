import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  children: ReactNode
  /** Target node to render into. Defaults to document.body. */
  container?: HTMLElement
}

/** Renders children into another DOM node (defaults to body). SSR-safe. */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
