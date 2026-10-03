import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils/cx'

export type ToastTone = 'info' | 'ok' | 'warn' | 'err'

export interface ToastOptions {
  title?: string
  description?: string
  tone?: ToastTone
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface Toast extends Required<Pick<ToastOptions, 'tone'>> {
  id: string
  title?: string
  description?: string
  duration: number
  action?: { label: string; onClick: () => void }
}

export interface ToastController {
  (opts: ToastOptions): string
  dismiss: (id: string) => void
  dismissAll: () => void
}

type Listener = (toasts: Toast[]) => void

const listeners = new Set<Listener>()
let state: Toast[] = []
const timers = new Map<string, ReturnType<typeof setTimeout>>()
let seq = 0

function emit() {
  for (const l of listeners) l(state)
}

function subscribe(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

function getSnapshot(): Toast[] {
  return state
}

function pushToast(opts: ToastOptions): string {
  const id = `vl-toast-${++seq}`
  const t: Toast = {
    id,
    title: opts.title,
    description: opts.description,
    tone: opts.tone ?? 'info',
    duration: opts.duration ?? 4000,
    action: opts.action,
  }
  state = [...state, t]
  emit()
  if (t.duration > 0) {
    const handle = setTimeout(() => {
      dismissToast(id)
    }, t.duration)
    timers.set(id, handle)
  }
  return id
}

function dismissToast(id: string) {
  const h = timers.get(id)
  if (h) {
    clearTimeout(h)
    timers.delete(id)
  }
  const next = state.filter((t) => t.id !== id)
  if (next.length === state.length) return
  state = next
  emit()
}

function dismissAllToasts() {
  for (const h of timers.values()) clearTimeout(h)
  timers.clear()
  if (state.length === 0) return
  state = []
  emit()
}

export function useToast(): ToastController {
  return useMemo(() => {
    const fn = ((opts: ToastOptions) => pushToast(opts)) as ToastController
    fn.dismiss = dismissToast
    fn.dismissAll = dismissAllToasts
    return fn
  }, [])
}

export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ToastProviderProps {
  position?: ToastPosition
  className?: string
  style?: CSSProperties
}

function positionStyle(position: ToastPosition): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    pointerEvents: 'none',
    padding: 16,
    maxWidth: '100vw',
  }
  switch (position) {
    case 'top-left':
      return { ...base, top: 0, left: 0, alignItems: 'flex-start' }
    case 'top-right':
      return { ...base, top: 0, right: 0, alignItems: 'flex-end' }
    case 'bottom-left':
      return { ...base, bottom: 0, left: 0, alignItems: 'flex-start', flexDirection: 'column-reverse' }
    case 'bottom-right':
    default:
      return { ...base, bottom: 0, right: 0, alignItems: 'flex-end', flexDirection: 'column-reverse' }
  }
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const role = toast.tone === 'warn' || toast.tone === 'err' ? 'alert' : 'status'
  const live = toast.tone === 'warn' || toast.tone === 'err' ? 'assertive' : 'polite'

  const style: CSSProperties = {
    pointerEvents: 'auto',
    minWidth: 260,
    maxWidth: 380,
    background: 'var(--bg-1)',
    color: 'var(--fg)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-md)',
    boxShadow: 'var(--shadow-lg)',
    display: 'grid',
    gridTemplateColumns: '4px 1fr auto',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)',
    animation: 'vl-in 300ms var(--ease-swift-out)',
  }

  return (
    <div
      role={role}
      aria-live={live}
      data-vl-toast=""
      data-tone={toast.tone}
      style={style}
    >
      <div data-vl-toast-stripe="" style={{ width: 4, height: '100%' }} />
      <div style={{ padding: '10px 12px', minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg)' }}>{toast.title}</div>
        )}
        {toast.description && (
          <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: toast.title ? 2 : 0 }}>
            {toast.description}
          </div>
        )}
        {toast.action && (
          <button
            type="button"
            data-vl-toast-action=""
            onClick={() => {
              toast.action!.onClick()
              onDismiss(toast.id)
            }}
            style={{
              marginTop: 8,
              fontSize: 13,
              fontWeight: 500,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--accent)',
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        data-vl-toast-close=""
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'var(--vl-toast-close-bg, transparent)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--vl-toast-close-fg, var(--fg-2))',
          padding: '8px 10px',
          fontSize: 14,
          alignSelf: 'start',
        }}
      >
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ position = 'bottom-right', className, style }: ToastProviderProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const onDismiss = useCallback((id: string) => dismissToast(id), [])
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      data-vl-toast-root=""
      data-position={position}
      className={cx('vl-toast-root', className)}
      style={{ ...positionStyle(position), ...style }}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

