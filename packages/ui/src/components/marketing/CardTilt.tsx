import { useRef, type ComponentProps, type ReactNode, type MouseEvent } from 'react'
import { cx } from '../../utils/cx'

export interface CardTiltProps extends ComponentProps<'div'> {
  children: ReactNode
  /** Maximum rotation in degrees. Default 10. */
  max?: number
  /** Scale factor on hover. Default 1.02. */
  scale?: number
  /** Show a highlight glow following the cursor. */
  glow?: boolean
}

/** 3D tilt card — rotates to follow the cursor, pure CSS transforms (no JS deps).
 *  Nice for product cards, feature tiles, dashboard previews. */
export function CardTilt({ children, max = 10, scale = 1.02, glow = true, className, style, ...rest }: CardTiltProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) scale(${scale})`
    if (glow) {
      el.style.setProperty('--vl-tilt-glow-x', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--vl-tilt-glow-y', `${(y + 0.5) * 100}%`)
    }
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      data-vl-card-tilt=""
      className={cx('vl-card-tilt', className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 200ms var(--ease-swift-out)',
        willChange: 'transform',
        ...style,
      }}
      {...rest}
    >
      {glow && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'radial-gradient(300px circle at var(--vl-tilt-glow-x, 50%) var(--vl-tilt-glow-y, 50%), color-mix(in oklch, var(--ac) 25%, transparent), transparent 60%)',
            pointerEvents: 'none',
            opacity: 0.6,
            mixBlendMode: 'screen',
          }}
        />
      )}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}
