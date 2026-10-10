import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

export interface SlotProps {
  children: ReactNode
  [prop: string]: unknown
}

/** Merges its props onto its single child element — Radix-style asChild composition.
 *  Instead of rendering a wrapper, Slot forwards className, style, event handlers,
 *  and refs onto whatever React element you pass as children. */
export function Slot({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) return <>{children}</>
  const only = Children.only(children) as ReactElement<Record<string, unknown>>
  const childProps = only.props as Record<string, unknown>
  const merged: Record<string, unknown> = { ...childProps }
  for (const [key, value] of Object.entries(slotProps)) {
    if (key === 'children' || value === undefined) continue
    if (key === 'style') {
      merged.style = { ...(childProps.style as object | undefined), ...(value as object) }
    } else if (key === 'className') {
      merged.className = [childProps.className, value].filter(Boolean).join(' ')
    } else if (typeof value === 'function' && typeof childProps[key] === 'function') {
      // Compose event handlers: run child's handler, then slot's.
      const childFn = childProps[key] as (...args: unknown[]) => unknown
      const slotFn = value as (...args: unknown[]) => unknown
      merged[key] = (...args: unknown[]) => {
        childFn(...args)
        slotFn(...args)
      }
    } else {
      merged[key] = value
    }
  }
  return cloneElement(only, merged)
}
