import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface ViolinGroup {
  label: string
  values: number[]
}

export interface ViolinChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: ViolinGroup[]
  width?: number
  height?: number
  showGrid?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 44
const PAD_R = 16
const PAD_T = 16
const PAD_B = 32
const SAMPLES = 32

function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min, min + 1]
  const range = max - min
  const step = Math.pow(10, Math.floor(Math.log10(range / count)))
  const err = (count * step) / range
  let s = step
  if (err <= 0.15) s = step * 10
  else if (err <= 0.35) s = step * 5
  else if (err <= 0.75) s = step * 2
  const tMin = Math.floor(min / s) * s
  const tMax = Math.ceil(max / s) * s
  const ticks: number[] = []
  for (let v = tMin; v <= tMax + s / 2; v += s) ticks.push(Number(v.toFixed(10)))
  return ticks
}

function median(sorted: number[]): number {
  const m = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2
}

function stdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

// Gaussian KDE evaluated at point x
function kde(values: number[], x: number, bw: number): number {
  const h = bw || 1
  const norm = 1 / (values.length * h * Math.sqrt(2 * Math.PI))
  let sum = 0
  for (const v of values) {
    const u = (x - v) / h
    sum += Math.exp(-0.5 * u * u)
  }
  return norm * sum
}

interface ViolinStat {
  label: string
  samples: { v: number; d: number }[]
  median: number
  maxD: number
}

export const ViolinChart = forwardRef<SVGSVGElement, ViolinChartProps>(function ViolinChart(
  { data, width = 480, height = 280, showGrid = true, className, style, ...rest },
  ref,
) {
  const groups = (data ?? []).filter((g) => g.values && g.values.length > 0)

  if (groups.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="violin"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const stats: ViolinStat[] = groups.map((g) => {
    const sorted = [...g.values].sort((a, b) => a - b)
    const lo = sorted[0]
    const hi = sorted[sorted.length - 1]
    const mean = sorted.reduce((a, v) => a + v, 0) / sorted.length
    const sigma = stdDev(sorted, mean)
    // Silverman's rule of thumb; fall back to a fraction of range
    const bw = sigma > 0 ? 1.06 * sigma * Math.pow(sorted.length, -0.2) : (hi - lo || 1) / 8
    const samples: { v: number; d: number }[] = []
    for (let i = 0; i < SAMPLES; i++) {
      const v = lo + ((hi - lo) * i) / (SAMPLES - 1 || 1)
      samples.push({ v, d: kde(sorted, v, bw) })
    }
    const maxD = Math.max(...samples.map((s) => s.d), 1e-9)
    return { label: g.label, samples, median: median(sorted), maxD }
  })

  const allVals = groups.flatMap((g) => g.values)
  const vTicks = niceTicks(Math.min(...allVals), Math.max(...allVals), 4)
  const vMin = vTicks[0]
  const vMax = vTicks[vTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = stats.length
  const slot = innerW / n
  const halfW = Math.min(36, slot * 0.42)

  const yFor = (v: number) => PAD_T + innerH - ((v - vMin) / (vMax - vMin || 1)) * innerH
  const cx0 = (i: number) => PAD_L + slot * (i + 0.5)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="violin"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        vTicks.map((t, i) => (
          <g key={`v-${i}`}>
            <line
              x1={PAD_L}
              x2={width - PAD_R}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text x={PAD_L - 8} y={yFor(t)} fill="var(--fg-3)" fontSize={11} textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}

      {stats.map((s, i) => {
        const c = cx0(i)
        const right = s.samples.map((p) => `${c + (p.d / s.maxD) * halfW} ${yFor(p.v)}`)
        const left = [...s.samples].reverse().map((p) => `${c - (p.d / s.maxD) * halfW} ${yFor(p.v)}`)
        const path = `M ${right.join(' L ')} L ${left.join(' L ')} Z`
        return (
          <g key={i}>
            <path d={path} fill="color-mix(in oklch, var(--ac) 22%, var(--bg-3))" stroke="var(--ac)" strokeWidth={1.5}>
              <title>{`${s.label}: median ${Number(s.median.toFixed(3))}`}</title>
            </path>
            <circle cx={c} cy={yFor(s.median)} r={3} fill="var(--ac)" />
            <text x={c} y={height - PAD_B + 16} fill="var(--fg-3)" fontSize={11} textAnchor="middle">
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
