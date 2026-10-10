import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface ScatterChartDatum {
  x: number
  y: number
  r?: number
  label?: string
}

export interface ScatterChartSeries {
  label: string
  data: ScatterChartDatum[]
  color?: string
}

export interface ScatterChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: ScatterChartDatum[]
  series?: ScatterChartSeries[]
  width?: number
  height?: number
  showGrid?: boolean
  dotRadius?: number
  connected?: boolean
  color?: string
  xLabel?: string
  yLabel?: string
  className?: string
  style?: CSSProperties
}

const PAD_L = 44
const PAD_R = 12
const PAD_T = 12
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

export const ScatterChart = forwardRef<SVGSVGElement, ScatterChartProps>(function ScatterChart(
  {
    data,
    series,
    width = 480,
    height = 260,
    showGrid = true,
    dotRadius = 4,
    connected = false,
    color = 'var(--ac)',
    xLabel,
    yLabel,
    className,
    style,
    ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  void uid

  const allSeries: ScatterChartSeries[] =
    series && series.length > 0 ? series : [{ label: 'value', data: data ?? [], color }]

  const flat = allSeries.flatMap((s) => s.data)

  if (!flat || flat.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="scatter"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const xs = flat.map((d) => d.x)
  const ys = flat.map((d) => d.y)
  const xTicks = niceTicks(Math.min(...xs), Math.max(...xs), 4)
  const yTicks = niceTicks(Math.min(...ys), Math.max(...ys), 4)
  const xMin = xTicks[0]
  const xMax = xTicks[xTicks.length - 1]
  const yMin = yTicks[0]
  const yMax = yTicks[yTicks.length - 1]

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B

  const xFor = (v: number) => PAD_L + ((v - xMin) / (xMax - xMin || 1)) * innerW
  const yFor = (v: number) => PAD_T + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="scatter"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {showGrid &&
        yTicks.map((t, i) => (
          <g key={`y-${i}`}>
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
              {t}
            </text>
          </g>
        ))}

      {showGrid &&
        xTicks.map((t, i) => (
          <g key={`x-${i}`}>
            <line
              x1={xFor(t)}
              x2={xFor(t)}
              y1={PAD_T}
              y2={height - PAD_B}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={xFor(t)}
              y={height - PAD_B + 16}
              fill="var(--fg-3)"
              fontSize={12}
              textAnchor="middle"
            >
              {t}
            </text>
          </g>
        ))}

      {allSeries.map((s, si) => {
        const c = s.color ?? color
        const linePath = connected
          ? s.data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(d.x)} ${yFor(d.y)}`).join(' ')
          : ''
        return (
          <g key={si}>
            {connected && (
              <path d={linePath} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
            )}
            {s.data.map((d, i) => (
              <circle key={i} cx={xFor(d.x)} cy={yFor(d.y)} r={d.r ?? dotRadius} fill={c} fillOpacity={d.r != null ? 0.55 : 1} stroke={d.r != null ? c : undefined} strokeWidth={d.r != null ? 1 : undefined}>
                <title>{d.label ?? `${d.x}, ${d.y}`}</title>
              </circle>
            ))}
          </g>
        )
      })}

      {xLabel && (
        <text
          x={PAD_L + innerW / 2}
          y={height - 4}
          fill="var(--fg-3)"
          fontSize={11}
          textAnchor="middle"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={12}
          y={PAD_T + innerH / 2}
          fill="var(--fg-3)"
          fontSize={11}
          textAnchor="middle"
          transform={`rotate(-90 12 ${PAD_T + innerH / 2})`}
        >
          {yLabel}
        </text>
      )}
    </svg>
  )
})
