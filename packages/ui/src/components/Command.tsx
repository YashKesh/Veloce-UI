import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils/cx'

export interface CommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeholder?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export interface CommandGroupProps {
  heading: string
  children: ReactNode
}

export interface CommandItemProps {
  value: string
  onSelect?: () => void
  keywords?: string[]
  disabled?: boolean
  children: ReactNode
  shortcut?: string
}

interface RegisteredItem {
  id: string
  value: string
  keywords: string[]
  disabled: boolean
  onSelect?: () => void
}

interface RegisteredItemRef {
  id: string
  getItem: () => RegisteredItem
}

interface CommandContextValue {
  query: string
  register: (ref: RegisteredItemRef) => () => void
  matches: (item: RegisteredItem) => boolean
  highlightedId: string | null
  setHighlightedId: (id: string | null) => void
  itemsOrder: React.MutableRefObject<string[]>
  close: () => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommandContext() {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error('Command subcomponents must be used inside <Command>')
  return ctx
}

function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()
  if (h.includes(n)) return true
  // char-sequence fuzzy
  let i = 0
  for (const ch of h) {
    if (ch === n[i]) i++
    if (i === n.length) return true
  }
  return i === n.length
}

export function CommandRoot({
  open,
  onOpenChange,
  placeholder = 'Search…',
  children,
  className,
  style: userStyle,
}: CommandProps) {
  const [query, setQuery] = useState('')
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const itemsRef = useRef<Map<string, RegisteredItemRef>>(new Map())
  const itemsOrder = useRef<string[]>([])
  const [, forceRender] = useState(0)

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  const register = useCallback((ref: RegisteredItemRef) => {
    itemsRef.current.set(ref.id, ref)
    if (!itemsOrder.current.includes(ref.id)) itemsOrder.current.push(ref.id)
    forceRender((v) => v + 1)
    return () => {
      itemsRef.current.delete(ref.id)
      itemsOrder.current = itemsOrder.current.filter((x) => x !== ref.id)
      forceRender((v) => v + 1)
    }
  }, [])

  const matches = useCallback(
    (item: RegisteredItem) => {
      if (!query) return true
      const hay = [item.value, ...item.keywords].join(' ')
      return fuzzyMatch(hay, query)
    },
    [query],
  )

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setHighlightedId(null)
    }
  }, [open])

  // Keep highlighted item valid when query / registry changes
  useEffect(() => {
    if (!open) return
    const visible = itemsOrder.current
      .map((id) => itemsRef.current.get(id)?.getItem())
      .filter((it): it is RegisteredItem => !!it && !it.disabled && matches(it))
    if (visible.length === 0) {
      if (highlightedId !== null) setHighlightedId(null)
      return
    }
    if (!highlightedId || !visible.some((v) => v.id === highlightedId)) {
      setHighlightedId(visible[0].id)
    }
  })

  // Esc + body scroll lock + focus input
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKey)

    const onFocusIn = (e: FocusEvent) => {
      const panel = panelRef.current
      if (!panel) return
      if (e.target instanceof Node && !panel.contains(e.target)) {
        inputRef.current?.focus()
      }
    }
    document.addEventListener('focusin', onFocusIn)

    const t = window.setTimeout(() => inputRef.current?.focus(), 0)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      if (prevFocus && typeof prevFocus.focus === 'function') {
        try {
          prevFocus.focus()
        } catch {
          /* ignore */
        }
      }
    }
  }, [open, onOpenChange])

  const ctx = useMemo<CommandContextValue>(
    () => ({
      query,
      register,
      matches,
      highlightedId,
      setHighlightedId,
      itemsOrder,
      close,
    }),
    [query, register, matches, highlightedId, close],
  )

  if (!open) return null
  if (typeof document === 'undefined') return null

  const getVisible = () =>
    itemsOrder.current
      .map((id) => itemsRef.current.get(id)?.getItem())
      .filter((it): it is RegisteredItem => !!it && !it.disabled && matches(it))

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const v = getVisible()
      if (v.length === 0) return
      const idx = v.findIndex((it) => it.id === highlightedId)
      const next = v[(idx + 1 + v.length) % v.length]
      setHighlightedId(next.id)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const v = getVisible()
      if (v.length === 0) return
      const idx = v.findIndex((it) => it.id === highlightedId)
      const prev = v[(idx - 1 + v.length) % v.length]
      setHighlightedId(prev.id)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const v = getVisible()
      const item = v.find((it) => it.id === highlightedId) ?? v[0]
      if (item) {
        item.onSelect?.()
        onOpenChange(false)
      }
    }
  }

  const backdrop: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'oklch(0 0 0 / 0.55)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '15vh',
    zIndex: 1050,
    animation: 'vl-in 180ms var(--ease-swift-out)',
  }
  const panel: CSSProperties = {
    background: 'var(--bg-1)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-xl)',
    boxShadow: 'var(--shadow-lg)',
    width: 'min(560px, calc(100vw - 32px))',
    maxHeight: 'min(480px, calc(100vh - 30vh))',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    animation: 'vl-in 220ms var(--ease-swift-out)',
  }

  const visibleIds = new Set(getVisible().map((v) => v.id))

  return createPortal(
    <CommandContext.Provider value={ctx}>
      <div
        role="presentation"
        data-vl-command-backdrop=""
        style={backdrop}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onOpenChange(false)
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          data-vl-command=""
          className={cx('vl-command', className)}
          style={{ ...panel, ...userStyle }}
          tabIndex={-1}
        >
          <div
            data-vl-command-input-wrap=""
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls="vl-command-listbox"
              aria-autocomplete="list"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              data-vl-command-input=""
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--fg)',
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            />
          </div>
          <div
            id="vl-command-listbox"
            role="listbox"
            data-vl-command-list=""
            style={{ overflow: 'auto', padding: 6, flex: 1 }}
          >
            <VisibleContext.Provider value={visibleIds}>{children}</VisibleContext.Provider>
            {visibleIds.size === 0 && (
              <div
                data-vl-command-empty=""
                style={{ padding: 16, textAlign: 'center', color: 'var(--fg-2)', fontSize: 13 }}
              >
                No results
              </div>
            )}
          </div>
        </div>
      </div>
    </CommandContext.Provider>,
    document.body,
  )
}

const VisibleContext = createContext<Set<string> | null>(null)

export function CommandGroup({ heading, children }: CommandGroupProps) {
  const visible = useContext(VisibleContext)
  // children have ids assigned at registration; we can detect visibility
  // by inspecting if any descendant item renders. Instead, we always render
  // the group container but hide heading if no visible items — items detect
  // their own visibility via context.
  const groupRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  // Count visible items after render
  useEffect(() => {
    const el = groupRef.current
    if (!el) return
    const items = el.querySelectorAll('[data-vl-command-item]')
    setVisibleCount(items.length)
  })

  const shouldShow = visibleCount > 0 || visible === null

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={heading}
      data-vl-command-group=""
      data-hidden={shouldShow ? undefined : ''}
      style={{ display: shouldShow ? 'block' : 'none', marginBottom: 4 }}
    >
      <div
        data-vl-command-group-heading=""
        style={{
          padding: '8px 10px 4px',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--fg-2)',
        }}
      >
        {heading}
      </div>
      <div>{children}</div>
    </div>
  )
}

export function CommandItem({
  value,
  onSelect,
  keywords = [],
  disabled = false,
  children,
  shortcut,
}: CommandItemProps) {
  const ctx = useCommandContext()
  const idRef = useRef<string>(`vl-cmd-item-${Math.random().toString(36).slice(2, 10)}`)
  const id = idRef.current

  const item: RegisteredItem = { id, value, keywords, disabled, onSelect }

  const latestRef = useRef(item)
  latestRef.current = item

  useEffect(() => {
    return ctx.register({ id, getItem: () => latestRef.current })
  }, [ctx, id])
  const visible = ctx.matches(item) && !disabled
  if (!visible) return null

  const highlighted = ctx.highlightedId === id

  return (
    <div
      role="option"
      id={id}
      aria-selected={highlighted}
      aria-disabled={disabled || undefined}
      data-vl-command-item=""
      data-highlighted={highlighted ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      onMouseEnter={() => ctx.setHighlightedId(id)}
      onMouseDown={(e) => {
        e.preventDefault()
        if (disabled) return
        onSelect?.()
        ctx.close()
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 'var(--r-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
        background: 'var(--vl-command-item-bg, transparent)',
        color: disabled ? 'var(--fg-3, var(--fg-2))' : 'var(--fg)',
      }}
    >
      <span>{children}</span>
      {shortcut && (
        <span
          data-vl-command-shortcut=""
          style={{ fontSize: 12, color: 'var(--fg-2)', fontFamily: 'var(--font-mono)' }}
        >
          {shortcut}
        </span>
      )}
    </div>
  )
}

export const Command = Object.assign(CommandRoot, {
  Group: CommandGroup,
  Item: CommandItem,
})
