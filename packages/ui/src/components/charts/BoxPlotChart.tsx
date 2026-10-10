import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BoxPlotGroup {
  label: string
  values: number[]
}

export interface BoxPlotChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: BoxPlotGroup[]
  orientation?: 'vertical' | 'horizontal'
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

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (sorted[base + 1] !== undefined) return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  return sorted[base]
}

interface BoxStat {
  label: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  whiskerLow: number
  whiskerHigh: number
  outliers: number[]
}

function computeStat(g: BoxPlotGroup): BoxStat | null {
  const sorted = [...g.values].sort((a, b) => a - b)
  if (sorted.length === 0) return null
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  const loFence = q1 - 1.5 * iqr
  const hiFence = q3 + 1.5 * iqr
  const inside = sorted.filter((v) => v >= loFence && v <= hiFence)
  const outliers = sorted.filter((v) => v < loFence || v > hiFence)
  return {
    label: g.label,
    min: sorted[0],
    q1,
    median: quantile(sorted, 0.5),
    q3,
    max: sorted[sorted.length - 1],
    whiskerLow: inside.length ? Math.min(...inside) : q1,
    whiskerHigh: inside.length ? Math.max(...inside) : q3,
    outliers,
  }
}

export const BoxPlotChart = forwardRef<SVGSVGElement, BoxPlotChartProps>(function BoxPlotChart(
  { data, orientation = 'vertical', width = 480, height = 280, showGrid = true, className, style, ...rest },
  ref,
) {
  const stats = (data ?? []).map(computeStat).filter((s): s is BoxStat => s !== null)

  if (stats.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="box-plot"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const allVals = stats.flatMap((s) => [s.whiskerLow, s.whiskerHigh, ...s.outliers])
  const vTicks = niceTicks(Math.min(...allVals), Math.max(...allVals), 4)
  const vMin = vTicks[0]
  const vMax = vTicks[vTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const vertical = orientation === 'vertical'
  const n = stats.length
  const slot = (vertical ? innerW : innerH) / n
  const boxThick = Math.min(40, slot * 0.5)

  const valFor = (v: number) =>
    vertical
      ? PAD_T + innerH - ((v - vMin) / (vMax - vMin || 1)) * innerH
      : PAD_L + ((v - vMin) / (vMax - vMin || 1)) * innerW
  const catCenter = (i: number) => (vertical ? PAD_L : PAD_T) + slot * (i + 0.5)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="box-plot"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        vTicks.map((t, i) => {
          const p = valFor(t)
          return (
            <g key={`v-${i}`}>
              <line x1={vertical ? PAD_L : p} x2={vertical ? width - PAD_R : p} y1={vertical ? p : PAD_T} y2={vertical ? p : height - PAD_B} stroke="var(--line)" strokeDasharray="2 4" strokeWidth={1} />
              <text x={vertical ? PAD_L - 8 : p} y={vertical ? p : height - PAD_B + 16} fill="var(--fg-3)" fontSize={11} textAnchor={vertical ? 'end' : 'middle'} dominantBaseline={vertical ? 'middle' : 'auto'}>
                {t}
              </text>
            </g>
          )
        })}

      {stats.map((s, i) => {
        const c = catCenter(i)
        const half = boxThick / 2
        // Orientation-aware segment: v* are positions along the value axis, c* along the category axis.
        const seg = (va: number, vb: number, ca: number, cb: number, stroke: string, w: number, key: string) =>
          vertical ? (
            <line key={key} x1={ca} x2={cb} y1={va} y2={vb} stroke={stroke} strokeWidth={w} />
          ) : (
            <line key={key} x1={va} x2={vb} y1={ca} y2={cb} stroke={stroke} strokeWidth={w} />
          )
        const dot = (o: number, key: number) =>
          vertical ? (
            <circle key={key} cx={c} cy={valFor(o)} r={2.5} fill="var(--err)" />
          ) : (
            <circle key={key} cx={valFor(o)} cy={c} r={2.5} fill="var(--err)" />
          )
        return (
          <g key={i}>
            <title>{`${s.label}: min ${Number(s.min.toFixed(3))}, q1 ${Number(s.q1.toFixed(3))}, med ${Number(s.median.toFixed(3))}, q3 ${Number(s.q3.toFixed(3))}, max ${Number(s.max.toFixed(3))}`}</title>
            {seg(valFor(s.whiskerHigh), valFor(s.q3), c, c, 'var(--fg-3)', 1, 'wh')}
            {seg(valFor(s.q1), valFor(s.whiskerLow), c, c, 'var(--fg-3)', 1, 'wl')}
            {seg(valFor(s.whiskerHigh), valFor(s.whiskerHigh), c - half / 2, c + half / 2, 'var(--fg-3)', 1, 'ch')}
            {seg(valFor(s.whiskerLow), valFor(s.whiskerLow), c - half / 2, c + half / 2, 'var(--fg-3)', 1, 'cl')}
            {vertical ? (
              <rect
                x={c - half}
                y={valFor(s.q3)}
                width={boxThick}
                height={Math.max(0, valFor(s.q1) - valFor(s.q3))}
                fill="color-mix(in oklch, var(--ac) 25%, var(--bg-3))"
                stroke="var(--ac)"
                strokeWidth={1}
              />
            ) : (
              <rect
                x={valFor(s.q1)}
                y={c - half}
                width={Math.max(0, valFor(s.q3) - valFor(s.q1))}
                height={boxThick}
                fill="color-mix(in oklch, var(--ac) 25%, var(--bg-3))"
                stroke="var(--ac)"
                strokeWidth={1}
              />
            )}
            {seg(valFor(s.median), valFor(s.median), c - half, c + half, 'var(--ac)', 2, 'med')}
            {s.outliers.map((o, oi) => dot(o, oi))}
            <text x={vertical ? c : PAD_L - 8} y={vertical ? height - PAD_B + 16 : c} fill="var(--fg-3)" fontSize={11} textAnchor={vertical ? 'middle' : 'end'} dominantBaseline={vertical ? 'auto' : 'middle'}>
              {s.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
