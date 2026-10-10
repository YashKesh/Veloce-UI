import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface CarouselProps extends ComponentProps<'div'> {
  /** Each child is a slide. */
  children: ReactNode
  autoPlay?: boolean
  autoPlayDelay?: number
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
}

export function Carousel({
  children,
  autoPlay,
  autoPlayDelay = 4000,
  showArrows = true,
  showDots = true,
  loop = true,
  className,
  style,
  ...rest
}: CarouselProps) {
  const slides = Array.isArray(children) ? children : [children]
  const [idx, setIdx] = useState(0)
  const n = slides.length

  const go = (delta: number) => {
    setIdx((i) => {
      const next = i + delta
      if (next < 0) return loop ? n - 1 : 0
      if (next >= n) return loop ? 0 : n - 1
      return next
    })
  }

  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!autoPlay) return
    const t = window.setInterval(() => go(1), autoPlayDelay)
    return () => window.clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayDelay, n])

  return (
    <div ref={ref} className={cx('vl-carousel', className)} style={{ position: 'relative', overflow: 'hidden', borderRadius: 10, ...style }} {...rest}>
      <div
        style={{
          display: 'flex',
          transform: `translateX(-${idx * 100}%)`,
          transition: 'transform 350ms cubic-bezier(.22,1,.36,1)',
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} style={{ flex: '0 0 100%', minWidth: 0 }} aria-hidden={i !== idx}>
            {slide}
          </div>
        ))}
      </div>
      {showArrows && n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            style={arrowStyle('left')}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            style={arrowStyle('right')}
          >
            ›
          </button>
        </>
      )}
      {showDots && n > 1 && (
        <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === idx ? 'var(--ac)' : 'oklch(1 0 0 / .4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'width 200ms, background 200ms',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 10,
    transform: 'translateY(-50%)',
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'oklch(0 0 0 / .5)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: 0,
  }
}
