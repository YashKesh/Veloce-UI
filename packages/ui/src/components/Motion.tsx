import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'

/**
 * useMotionPreference — reads `prefers-reduced-motion`, SSR-safe. Returns true when the user
 * has requested reduced motion; motion utilities below gate their animations on this.
 */
export function useMotionPreference(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  return reduced
}

export interface PresenceProps {
  /** Toggle the child's presence. When false, the child animates out, then unmounts. */
  show: boolean
  children: ReactNode
  /** Enter animation name (keyframes) — defaults to the library's `vl-in` fade+rise. */
  enter?: string
  /** Enter duration in ms. Default 200. */
  enterMs?: number
  /** Exit duration in ms. Default 150. */
  exitMs?: number
  /** Enter easing. */
  enterEase?: string
  /** Exit easing. */
  exitEase?: string
}

/**
 * Presence — keeps children mounted long enough to run an exit animation.
 * Uses CSS keyframes `vl-in` by default (reversed for exit). Respects reduced motion.
 */
export function Presence({
  show,
  children,
  enter = 'vl-in',
  enterMs = 200,
  exitMs = 150,
  enterEase = 'cubic-bezier(.16,1,.3,1)',
  exitEase = 'cubic-bezier(.4,0,1,1)',
}: PresenceProps) {
  const reduced = useMotionPreference()
  const [mounted, setMounted] = useState(show)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      setExiting(false)
    } else if (mounted) {
      if (reduced) {
        setMounted(false)
      } else {
        setExiting(true)
      }
    }
  }, [show, mounted, reduced])

  if (!mounted) return null

  const animation = reduced
    ? undefined
    : exiting
      ? `${enter} ${exitMs}ms ${exitEase} reverse both`
      : `${enter} ${enterMs}ms ${enterEase} both`

  const only = Children.only(children) as ReactElement<{ style?: CSSProperties; onAnimationEnd?: (e: React.AnimationEvent) => void }>
  if (!isValidElement(only)) return <>{children}</>

  return cloneElement(only, {
    style: { ...(only.props.style ?? {}), animation },
    onAnimationEnd: (e: React.AnimationEvent) => {
      only.props.onAnimationEnd?.(e)
      if (exiting) {
        setExiting(false)
        setMounted(false)
      }
    },
  })
}

export interface StaggerProps {
  children: ReactNode
  /** Delay between consecutive children, in ms. Default 60. */
  gap?: number
  /** Starting delay for the first child, in ms. Default 0. */
  initialDelay?: number
  /** Enter animation name (keyframes). */
  enter?: string
  /** Duration for each child's animation, in ms. */
  durationMs?: number
  /** Easing. */
  ease?: string
}

/**
 * Stagger — distributes an incremental animation-delay across its children, producing a
 * cascading enter. Respects reduced motion (no animation applied).
 */
export function Stagger({
  children,
  gap = 60,
  initialDelay = 0,
  enter = 'vl-in',
  durationMs = 350,
  ease = 'cubic-bezier(.16,1,.3,1)',
}: StaggerProps) {
  const reduced = useMotionPreference()
  const kids = Children.toArray(children)
  return (
    <>
      {kids.map((child, i) => {
        if (!isValidElement(child)) return child
        const el = child as ReactElement<{ style?: CSSProperties }>
        if (reduced) return el
        const style: CSSProperties = {
          ...(el.props.style ?? {}),
          animation: `${enter} ${durationMs}ms ${ease} both`,
          animationDelay: `${initialDelay + i * gap}ms`,
        }
        return cloneElement(el, { style, key: el.key ?? i })
      })}
    </>
  )
}

export interface NumberFlowProps {
  /** Target numeric value. */
  value: number
  /** Tween duration in ms. Default 500. */
  durationMs?: number
  /** Formatter — defaults to `toLocaleString()`. */
  format?: (n: number) => string
  /** CSS class on the span. */
  className?: string
  /** Style on the span. */
  style?: CSSProperties
}

/**
 * NumberFlow — tweens a numeric value with cubic ease-out. Writes to a <span> with
 * tabular-nums so digits don't jitter during the animation. Respects reduced motion
 * (snaps instantly to the target).
 */
export function NumberFlow({
  value,
  durationMs = 500,
  format = (n) => n.toLocaleString(),
  className,
  style,
}: NumberFlowProps) {
  const reduced = useMotionPreference()
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      fromRef.current = value
      return
    }
    const from = fromRef.current
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      fromRef.current = value
      cancelAnimationFrame(raf)
    }
  }, [value, durationMs, reduced])

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }} data-vl-number-flow="">
      {format(display)}
    </span>
  )
}
