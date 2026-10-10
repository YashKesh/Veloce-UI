import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface VennSet {
  label: string
  size: number
}

export interface VennChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  sets: VennSet[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

interface Circle {
  cx: number
  cy: number
  r: number
  label: string
  lx: number
  ly: number
}

export const VennChart = forwardRef<SVGSVGElement, VennChartProps>(function VennChart(
  { sets, width = 480, height = 300, className, style, ...rest },
  ref,
) {
  const valid = sets && (sets.length === 2 || sets.length === 3)
  if (!valid) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="venn"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const cx0 = width / 2
  const cy0 = height / 2
  const maxSize = Math.max(...sets.map((s) => s.size), 1)
  const baseR = Math.min(width, height) * 0.26
  const radius = (s: number) => baseR * Math.sqrt(Math.max(0, s) / maxSize) * 0.9 + baseR * 0.1

  const circles: Circle[] = []
  if (sets.length === 2) {
    const r0 = radius(sets[0].size)
    const r1 = radius(sets[1].size)
    const off = (r0 + r1) * 0.42
    circles.push({ cx: cx0 - off, cy: cy0, r: r0, label: sets[0].label, lx: cx0 - off - r0 * 0.5, ly: cy0 })
    circles.push({ cx: cx0 + off, cy: cy0, r: r1, label: sets[1].label, lx: cx0 + off + r1 * 0.5, ly: cy0 })
  } else {
    const spread = baseR * 0.75
    const pts = [
      { x: cx0, y: cy0 - spread },
      { x: cx0 - spread * 0.9, y: cy0 + spread * 0.6 },
      { x: cx0 + spread * 0.9, y: cy0 + spread * 0.6 },
    ]
    sets.forEach((s, i) => {
      const r = radius(s.size)
      const p = pts[i]
      const dx = p.x - cx0
      const dy = p.y - cy0
      const len = Math.hypot(dx, dy) || 1
      circles.push({ cx: p.x, cy: p.y, r, label: s.label, lx: p.x + (dx / len) * (r * 0.6), ly: p.y + (dy / len) * (r * 0.6) })
    })
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="venn"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.32} stroke="none">
          <title>{`${sets[i].label}: ${sets[i].size}`}</title>
        </circle>
      ))}
      {circles.map((c, i) => (
        <text
          key={`l-${i}`}
          x={c.lx}
          y={c.ly}
          fill="var(--fg)"
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {c.label}
        </text>
      ))}
    </svg>
  )
})
