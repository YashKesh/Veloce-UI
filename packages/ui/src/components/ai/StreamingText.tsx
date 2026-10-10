import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export interface StreamingTextProps extends ComponentProps<'span'> {
  /** Target text. Component reveals one character at a time until it matches. */
  text: string
  /** Characters per second. Default 60. */
  speed?: number
  /** Show a blinking cursor at the end while streaming. Default true. */
  cursor?: boolean
  /** Fired once the full text is revealed. */
  onDone?: () => void
}

/** Reveals text character-by-character — the classic LLM typing effect.
 *  Respects prefers-reduced-motion by snapping to the full string. */
export function StreamingText({
  text,
  speed = 60,
  cursor = true,
  onDone,
  className,
  style,
  ...rest
}: StreamingTextProps) {
  const [revealed, setRevealed] = useState('')
  const idxRef = useRef(0)

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setRevealed(text)
      onDone?.()
      return
    }
    idxRef.current = 0
    setRevealed('')
    const interval = Math.max(1, Math.floor(1000 / speed))
    const t = window.setInterval(() => {
      idxRef.current += 1
      setRevealed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        window.clearInterval(t)
        onDone?.()
      }
    }, interval)
    return () => window.clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed])

  const done = revealed.length >= text.length

  return (
    <span
      data-vl-streaming-text=""
      data-done={done ? '' : undefined}
      className={cx('vl-streaming-text', className)}
      style={{ whiteSpace: 'pre-wrap', ...style }}
      {...rest}
    >
      {revealed}
      {cursor && !done && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: 7,
            height: '1em',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            background: 'currentColor',
            animation: 'vl-caret 1s step-end infinite',
          }}
        />
      )}
    </span>
  )
}
