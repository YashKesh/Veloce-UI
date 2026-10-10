import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface TextRevealProps extends ComponentProps<'div'> {
  text: string
  /** Stagger between words in ms. Default 60. */
  stagger?: number
  /** Trigger reveal when the component enters viewport. Default true. */
  onView?: boolean
}

/** Word-by-word fade + rise reveal. Fires on mount by default, or on scroll into view. */
export function TextReveal({ text, stagger = 60, onView = true, className, style, ...rest }: TextRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(!onView)

  useEffect(() => {
    if (!onView) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [onView])

  const words = text.split(/(\s+)/)
  return (
    <div
      ref={ref}
      data-vl-text-reveal=""
      className={cx('vl-text-reveal', className)}
      style={{ ...style }}
      {...rest}
    >
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>
        const idx = Math.floor(i / 2)
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(0.4em)',
              filter: visible ? 'blur(0)' : 'blur(4px)',
              transition: `opacity 400ms ${idx * stagger}ms cubic-bezier(.16,1,.3,1), transform 400ms ${idx * stagger}ms cubic-bezier(.16,1,.3,1), filter 400ms ${idx * stagger}ms cubic-bezier(.16,1,.3,1)`,
            }}
          >
            {w}
          </span>
        )
      })}
    </div>
  )
}
