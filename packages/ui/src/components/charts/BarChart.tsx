import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface BarChartSeries {
  label: string
  data: number[]
  color?: string
}

export type BarChartStack = 'none' | 'stacked' | 'percent' | 'diverging'

export interface BarChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: { label: string; value: number }[]
  series?: BarChartSeries[]
  width?: number
  height?: number
  barGap?: number
  groupGap?: number
  showGrid?: boolean
  showValues?: boolean
  color?: string
  stack?: BarChartStack
  horizontal?: boolean
  yFormat?: (n: number) => string
  className?: string
  style?: CSSProperties
}

const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

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

// Rounded top rect path
function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h))
  return `M ${x} ${y + h} L ${x} ${y + rr} Q ${x} ${y} ${x + rr} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h} Z`
}

// Square rect path (no rounding)
function squareRect(x: number, y: number, w: number, h: number): string {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

// Rounded right rect path (horizontal bars grow rightward)
function roundedRightRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, h / 2, w))
  return `M ${x} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h - rr} Q ${x + w} ${y + h} ${x + w - rr} ${y + h} L ${x} ${y + h} Z`
}

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(function BarChart(
  {
    data,
    series,
    width = 480,
    height = 220,
    barGap = 4,
    groupGap = 16,
    showGrid = true,
    showValues = false,
    color = 'var(--ac)',
    stack = 'none',
    horizontal = false,
    yFormat,
    className,
    style,
    ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')

  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="bar"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const labels = data.map((d) => d.label)
  const allSeries: BarChartSeries[] =
    series && series.length > 0
      ? series
      : [{ label: 'value', data: data.map((d) => d.value), color }]

  const n = labels.length
  const seriesCount = allSeries.length
  const isStacking = stack !== 'none' && seriesCount > 1

  // --- domain depending on mode ---
  const flat = allSeries.flatMap((s) => s.data)
  let dataMin = Math.min(...flat, 0)
  let dataMax = Math.max(...flat, 1)

  if (isStacking) {
    if (stack === 'percent') {
      dataMin = 0
      dataMax = 100
    } else if (stack === 'stacked') {
      // max positive stack total across categories
      let maxTotal = 0
      for (let i = 0; i < n; i++) {
        let total = 0
        for (const s of allSeries) total += s.data[i] ?? 0
        if (total > maxTotal) maxTotal = total
      }
      dataMin = 0
      dataMax = Math.max(maxTotal, 1)
    } else {
      // diverging: positive values stack up, negative stack down
      let maxUp = 0
      let maxDown = 0
      for (let i = 0; i < n; i++) {
        let up = 0
        let down = 0
        for (const s of allSeries) {
          const v = s.data[i] ?? 0
          if (v >= 0) up += v
          else down += v
        }
        if (up > maxUp) maxUp = up
        if (down < maxDown) maxDown = down
      }
      dataMin = Math.min(maxDown, 0)
      dataMax = Math.max(maxUp, 1)
    }
  }

  const ticks =
    isStacking && stack === 'percent' ? [0, 25, 50, 75, 100] : niceTicks(dataMin, dataMax, 4)
  const yMin = ticks[0]
  const yMax = ticks[ticks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B

  const groupW = (innerW - groupGap * (n - 1)) / n
  const barW = Math.max(2, (groupW - barGap * (seriesCount - 1)) / seriesCount)
  // full-width bar used by stacked/horizontal modes
  const slotW = isStacking ? groupW : barW

  const fmt = yFormat ?? ((n: number) => String(n))

  // value -> pixel helpers.  In horizontal mode value maps along X, categories along Y.
  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH
  const baseY = yFor(Math.max(0, yMin))
  const xValFor = (v: number) => PAD_L + ((v - yMin) / (yMax - yMin || 1)) * innerW
  const baseX = xValFor(Math.max(0, yMin))

  // per-category normalized values for percent mode
  const totalsForPercent = (i: number): number => {
    let total = 0
    for (const s of allSeries) total += Math.abs(s.data[i] ?? 0)
    return total || 1
  }

  void uid

  if (isStacking && !horizontal) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="bar"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {showGrid &&
          ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={width - PAD_R}
                y1={yFor(t)}
                y2={yFor(t)}
                stroke="var(--line)"
                strokeDasharray="2 4"
                strokeWidth={1}
              />
              <text
                x={PAD_L - 8}
                y={yFor(t)}
                fill="var(--fg-3)"
                fontSize={12}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {stack === 'percent' ? `${fmt(t)}%` : fmt(t)}
              </text>
            </g>
          ))}

        {labels.map((l, i) => {
          const gx = PAD_L + i * (groupW + groupGap)
          return (
            <text
              key={i}
              x={gx + groupW / 2}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="middle"
            >
              {l}
            </text>
          )
        })}

        {labels.map((_, i) => {
          const gx = PAD_L + i * (groupW + groupGap)
          const bx = gx + (groupW - slotW) / 2
          let upCursor = 0 // running positive total (value units)
          let downCursor = 0 // running negative total (value units)
          const total = totalsForPercent(i)
          // determine top-most visible positive segment index for rounding
          let lastUpIndex = -1
          allSeries.forEach((s, si) => {
            if ((s.data[i] ?? 0) > 0) lastUpIndex = si
          })
          return (
            <g key={i}>
              {allSeries.map((s, si) => {
                const raw = s.data[i] ?? 0
                const c = s.color ?? color
                let v = raw
                if (stack === 'percent') v = (Math.abs(raw) / total) * 100
                if (v === 0) return null
                let segTop: number
                let segH: number
                if (stack === 'diverging' && raw < 0) {
                  const y0 = yFor(downCursor)
                  const y1 = yFor(downCursor + raw)
                  segTop = Math.min(y0, y1)
                  segH = Math.abs(y1 - y0)
                  downCursor += raw
                } else {
                  const start = upCursor
                  const end = upCursor + (stack === 'percent' ? v : raw)
                  const y0 = yFor(start)
                  const y1 = yFor(end)
                  segTop = Math.min(y0, y1)
                  segH = Math.abs(y1 - y0)
                  upCursor = end
                }
                const rounded = si === lastUpIndex && !(stack === 'diverging' && raw < 0)
                const d = rounded
                  ? roundedTopRect(bx, segTop, slotW, segH, 4)
                  : squareRect(bx, segTop, slotW, segH)
                return (
                  <g key={si}>
                    <path d={d} fill={c}>
                      <title>{`${s.label}: ${fmt(raw)}`}</title>
                    </path>
                    {showValues && segH > 12 && (
                      <text
                        x={bx + slotW / 2}
                        y={segTop + segH / 2}
                        fill="var(--fg)"
                        fontSize={11}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {stack === 'percent' ? `${Math.round(v)}%` : fmt(raw)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    )
  }

  if (horizontal) {
    const bandH = (innerH - groupGap * (n - 1)) / n
    const barH = isStacking
      ? bandH
      : Math.max(2, (bandH - barGap * (seriesCount - 1)) / seriesCount)
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-chart="bar"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {showGrid &&
          ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={xValFor(t)}
                x2={xValFor(t)}
                y1={PAD_T}
                y2={height - PAD_B}
                stroke="var(--line)"
                strokeDasharray="2 4"
                strokeWidth={1}
              />
              <text
                x={xValFor(t)}
                y={height - PAD_B + 16}
                fill="var(--fg-3)"
                fontSize={12}
                textAnchor="middle"
              >
                {isStacking && stack === 'percent' ? `${fmt(t)}%` : fmt(t)}
              </text>
            </g>
          ))}

        {labels.map((l, i) => {
          const gy = PAD_T + i * (bandH + groupGap)
          return (
            <text
              key={i}
              x={PAD_L - 8}
              y={gy + bandH / 2}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {l}
            </text>
          )
        })}

        {labels.map((_, i) => {
          const gy = PAD_T + i * (bandH + groupGap)
          const total = totalsForPercent(i)
          let upCursor = 0
          let downCursor = 0
          let lastUpIndex = -1
          allSeries.forEach((s, si) => {
            if ((s.data[i] ?? 0) > 0) lastUpIndex = si
          })
          return (
            <g key={i}>
              {allSeries.map((s, si) => {
                const raw = s.data[i] ?? 0
                const c = s.color ?? color
                if (isStacking) {
                  let v = raw
                  if (stack === 'percent') v = (Math.abs(raw) / total) * 100
                  if (v === 0) return null
                  let segLeft: number
                  let segW: number
                  if (stack === 'diverging' && raw < 0) {
                    const x0 = xValFor(downCursor)
                    const x1 = xValFor(downCursor + raw)
                    segLeft = Math.min(x0, x1)
                    segW = Math.abs(x1 - x0)
                    downCursor += raw
                  } else {
                    const end = upCursor + (stack === 'percent' ? v : raw)
                    const x0 = xValFor(upCursor)
                    const x1 = xValFor(end)
                    segLeft = Math.min(x0, x1)
                    segW = Math.abs(x1 - x0)
                    upCursor = end
                  }
                  const rounded = si === lastUpIndex && !(stack === 'diverging' && raw < 0)
                  const d = rounded
                    ? roundedRightRect(segLeft, gy, segW, barH, 4)
                    : squareRect(segLeft, gy, segW, barH)
                  return (
                    <g key={si}>
                      <path d={d} fill={c}>
                        <title>{`${s.label}: ${fmt(raw)}`}</title>
                      </path>
                    </g>
                  )
                }
                // grouped / single horizontal
                const x = xValFor(raw)
                const w = Math.abs(x - baseX)
                const by = gy + si * (barH + barGap)
                const bx = Math.min(x, baseX)
                return (
                  <g key={si}>
                    <path d={roundedRightRect(bx, by, w, barH, 4)} fill={c}>
                      <title>{`${s.label}: ${fmt(raw)}`}</title>
                    </path>
                    {showValues && (
                      <text
                        x={bx + w + 6}
                        y={by + barH / 2}
                        fill="var(--fg)"
                        fontSize={11}
                        textAnchor="start"
                        dominantBaseline="middle"
                      >
                        {fmt(raw)}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    )
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="bar"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              x2={width - PAD_R}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={PAD_L - 8}
              y={yFor(t)}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {fmt(t)}
            </text>
          </g>
        ))}

      {labels.map((l, i) => {
        const gx = PAD_L + i * (groupW + groupGap)
        return (
          <text
            key={i}
            x={gx + groupW / 2}
            y={height - PAD_B + 16}
            fill="var(--fg-3)"
            fontSize={12}
            textAnchor="middle"
          >
            {l}
          </text>
        )
      })}

      {labels.map((_, i) => {
        const gx = PAD_L + i * (groupW + groupGap)
        return (
          <g key={i}>
            {allSeries.map((s, si) => {
              const v = s.data[i] ?? 0
              const c = s.color ?? color
              const y = yFor(v)
              const h = Math.abs(baseY - y)
              const bx = gx + si * (barW + barGap)
              const by = Math.min(y, baseY)
              return (
                <g key={si}>
                  <path d={roundedTopRect(bx, by, barW, h, 4)} fill={c} />
                  {showValues && (
                    <text
                      x={bx + barW / 2}
                      y={by - 6}
                      fill="var(--fg)"
                      fontSize={11}
                      textAnchor="middle"
                    >
                      {fmt(v)}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
})
