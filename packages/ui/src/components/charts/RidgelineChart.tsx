import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface RidgeSeries {
  label: string
  values: number[]
}

export interface RidgelineChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: RidgeSeries[]
  width?: number
  height?: number
  showGrid?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 72
const PAD_R = 16
const PAD_T = 16
const PAD_B = 28
const SAMPLES = 48

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

function stdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / (values.length - 1)
  return Math.sqrt(variance)
}

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

export const RidgelineChart = forwardRef<SVGSVGElement, RidgelineChartProps>(function RidgelineChart(
  { data, width = 480, height = 280, showGrid = true, className, style, ...rest },
  ref,
) {
  const series = (data ?? []).filter((s) => s.values && s.values.length > 0)

  if (series.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="ridgeline"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const allVals = series.flatMap((s) => s.values)
  const xTicks = niceTicks(Math.min(...allVals), Math.max(...allVals), 4)
  const xMin = xTicks[0]
  const xMax = xTicks[xTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const n = series.length
  const rowGap = innerH / n
  const amp = rowGap * 1.9

  const xFor = (v: number) => PAD_L + ((v - xMin) / (xMax - xMin || 1)) * innerW

  const rows = series.map((s) => {
    const mean = s.values.reduce((a, v) => a + v, 0) / s.values.length
    const sigma = stdDev(s.values, mean)
    const bw = sigma > 0 ? 1.06 * sigma * Math.pow(s.values.length, -0.2) : (xMax - xMin || 1) / 10
    const samples: { x: number; d: number }[] = []
    for (let i = 0; i < SAMPLES; i++) {
      const v = xMin + ((xMax - xMin) * i) / (SAMPLES - 1 || 1)
      samples.push({ x: v, d: kde(s.values, v, bw) })
    }
    const maxD = Math.max(...samples.map((p) => p.d), 1e-9)
    return { label: s.label, samples, maxD }
  })

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="ridgeline"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        xTicks.map((t, i) => (
          <line
            key={`x-${i}`}
            x1={xFor(t)}
            x2={xFor(t)}
            y1={PAD_T}
            y2={height - PAD_B}
            stroke="var(--line)"
            strokeDasharray="2 4"
            strokeWidth={1}
          />
        ))}

      {rows.map((r, i) => {
        const baseY = PAD_T + rowGap * (i + 1)
        const line = r.samples.map((p) => `${xFor(p.x)} ${baseY - (p.d / r.maxD) * amp}`)
        const area = `M ${xFor(r.samples[0].x)} ${baseY} L ${line.join(' L ')} L ${xFor(r.samples[r.samples.length - 1].x)} ${baseY} Z`
        return (
          <g key={i}>
            <path d={area} fill="color-mix(in oklch, var(--ac) 30%, var(--bg-3))" fillOpacity={0.75} stroke="var(--ac)" strokeWidth={1.25}>
              <title>{r.label}</title>
            </path>
            <text x={PAD_L - 10} y={baseY} fill="var(--fg-2)" fontSize={11} textAnchor="end" dominantBaseline="middle">
              {r.label}
            </text>
          </g>
        )
      })}

      {xTicks.map((t, i) => (
        <text key={`xl-${i}`} x={xFor(t)} y={height - PAD_B + 16} fill="var(--fg-3)" fontSize={11} textAnchor="middle">
          {t}
        </text>
      ))}
    </svg>
  )
})
