import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface NightingaleDatum {
  label: string
  value: number
  color?: string
}

export interface NightingaleChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: NightingaleDatum[]
  size?: number
  className?: string
  style?: CSSProperties
}

/** Filled sector from centre out. */
function sectorPath(ox: number, oy: number, r: number, a0: number, a1: number): string {
  const x0 = ox + r * Math.cos(a0)
  const y0 = oy + r * Math.sin(a0)
  const x1 = ox + r * Math.cos(a1)
  const y1 = oy + r * Math.sin(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${ox} ${oy}L${x0} ${y0}A${r} ${r} 0 ${large} 1 ${x1} ${y1}Z`
}

export const NightingaleChart = forwardRef<SVGSVGElement, NightingaleChartProps>(function NightingaleChart(
  { data, size = 300, className, style, ...rest },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        data-vl-chart="nightingale"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const ox = size / 2
  const oy = size / 2
  const pad = 22
  const rMax = size / 2 - pad
  const maxVal = Math.max(...data.map((d) => Math.max(0, d.value)), 1)
  const rFor = (v: number) => Math.sqrt(Math.max(0, v) / maxVal) * rMax
  const step = (Math.PI * 2) / data.length
  const start = -Math.PI / 2

  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      data-vl-chart="nightingale"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {rings.map((f, i) => (
        <circle key={`g-${i}`} cx={ox} cy={oy} r={rMax * f} fill="none" stroke="var(--line)" strokeWidth={1} />
      ))}

      {data.map((d, i) => {
        const a0 = start + i * step
        const a1 = a0 + step
        const r = rFor(d.value)
        const color = d.color ?? PALETTE[i % PALETTE.length]
        if (r <= 0) return null
        return (
          <path key={i} d={sectorPath(ox, oy, r, a0 + 0.01, a1 - 0.01)} fill={color} stroke="var(--bg-1)" strokeWidth={1}>
            <title>{`${d.label}: ${d.value}`}</title>
          </path>
        )
      })}

      {data.map((d, i) => {
        const mid = start + i * step + step / 2
        const lr = rMax + 10
        const x = ox + lr * Math.cos(mid)
        const y = oy + lr * Math.sin(mid)
        return (
          <text
            key={`l-${i}`}
            x={x}
            y={y}
            fill="var(--fg-2)"
            fontSize={10}
            textAnchor={Math.cos(mid) > 0.1 ? 'start' : Math.cos(mid) < -0.1 ? 'end' : 'middle'}
            dominantBaseline="middle"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
})
