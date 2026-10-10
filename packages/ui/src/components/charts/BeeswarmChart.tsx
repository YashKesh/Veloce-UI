import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BeeswarmDatum {
  value: number
  label?: string
  group?: string
}

export interface BeeswarmChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: BeeswarmDatum[]
  width?: number
  height?: number
  dotRadius?: number
  showGrid?: boolean
  className?: string
  style?: CSSProperties
}

const PAD_L = 72
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

interface Placed {
  x: number
  offset: number
  datum: BeeswarmDatum
}

// Greedy packing: place points left-to-right by x, assign the smallest
// vertical offset slot that avoids overlap with already-placed neighbours.
function pack(points: { x: number; datum: BeeswarmDatum }[], r: number, maxOffset: number): Placed[] {
  const sorted = [...points].sort((a, b) => a.x - b.x)
  const placed: Placed[] = []
  const diam = r * 2 + 0.5
  for (const p of sorted) {
    let offset = 0
    let sign = 1
    let step = 0
    // Try offsets 0, +d, -d, +2d, -2d ... until no collision
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const candidate = step === 0 ? 0 : sign * step * diam
      if (Math.abs(candidate) > maxOffset && step > 0) {
        offset = candidate
        break
      }
      const collides = placed.some(
        (q) => Math.abs(q.x - p.x) < diam && Math.abs(q.offset - candidate) < diam,
      )
      if (!collides) {
        offset = candidate
        break
      }
      if (sign === 1) sign = -1
      else {
        sign = 1
        step += 1
      }
    }
    placed.push({ x: p.x, offset, datum: p.datum })
  }
  return placed
}

export const BeeswarmChart = forwardRef<SVGSVGElement, BeeswarmChartProps>(function BeeswarmChart(
  { data, width = 480, height = 280, dotRadius = 3.5, showGrid = true, className, style, ...rest },
  ref,
) {
  const points = (data ?? []).filter((d) => Number.isFinite(d.value))

  if (points.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="beeswarm"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const hasGroups = points.some((d) => d.group != null)
  const groups = hasGroups ? Array.from(new Set(points.map((d) => d.group ?? ''))) : ['']

  const vals = points.map((d) => d.value)
  const xTicks = niceTicks(Math.min(...vals), Math.max(...vals), 4)
  const xMin = xTicks[0]
  const xMax = xTicks[xTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const laneH = innerH / groups.length
  const xFor = (v: number) => PAD_L + ((v - xMin) / (xMax - xMin || 1)) * innerW
  const maxOffset = Math.max(dotRadius, laneH / 2 - dotRadius - 2)

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="beeswarm"
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

      {groups.map((grp, gi) => {
        const centerY = PAD_T + laneH * (gi + 0.5)
        const inLane = points.filter((d) => (d.group ?? '') === grp)
        const placed = pack(
          inLane.map((d) => ({ x: xFor(d.value), datum: d })),
          dotRadius,
          maxOffset,
        )
        return (
          <g key={gi}>
            {hasGroups && (
              <text x={PAD_L - 10} y={centerY} fill="var(--fg-2)" fontSize={11} textAnchor="end" dominantBaseline="middle">
                {grp}
              </text>
            )}
            {placed.map((p, i) => (
              <circle key={i} cx={p.x} cy={centerY + p.offset} r={dotRadius} fill="var(--ac)" fillOpacity={0.8}>
                <title>{p.datum.label ?? String(p.datum.value)}</title>
              </circle>
            ))}
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
