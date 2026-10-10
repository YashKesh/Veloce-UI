import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface LollipopChartDatum {
  label: string
  value: number
}

export interface LollipopChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  data: LollipopChartDatum[]
  orientation?: 'horizontal' | 'vertical'
  width?: number
  height?: number
  dotRadius?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 90
const PAD_R = 24
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

export const LollipopChart = forwardRef<SVGSVGElement, LollipopChartProps>(function LollipopChart(
  {
    data,
    orientation = 'horizontal',
    width = 480,
    height = 280,
    dotRadius = 5,
    className,
    style,
    ...rest
  },
  ref,
) {
  if (!data || data.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="lollipop"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const values = data.map((d) => d.value)
  const ticks = niceTicks(Math.min(...values, 0), Math.max(...values, 1), 4)
  const vMin = ticks[0]
  const vMax = ticks[ticks.length - 1]
  const span = vMax - vMin || 1

  const horizontal = orientation === 'horizontal'
  const padL = horizontal ? PAD_L : 44
  const padB = horizontal ? PAD_B : 40
  const innerW = width - padL - PAD_R
  const innerH = height - PAD_T - padB
  const n = data.length

  const valFor = (v: number) =>
    horizontal
      ? padL + ((v - vMin) / span) * innerW
      : PAD_T + innerH - ((v - vMin) / span) * innerH
  const base = valFor(Math.max(0, vMin))
  const catFor = (i: number) =>
    horizontal
      ? PAD_T + (innerH * (i + 0.5)) / n
      : padL + (innerW * (i + 0.5)) / n

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="lollipop"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {ticks.map((t, i) =>
        horizontal ? (
          <g key={i}>
            <line
              x1={valFor(t)}
              x2={valFor(t)}
              y1={PAD_T}
              y2={height - padB}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={valFor(t)}
              y={height - padB + 16}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="middle"
            >
              {t}
            </text>
          </g>
        ) : (
          <g key={i}>
            <line
              x1={padL}
              x2={width - PAD_R}
              y1={valFor(t)}
              y2={valFor(t)}
              stroke="var(--line)"
              strokeDasharray="2 4"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={valFor(t)}
              fill="var(--fg-3)"
              fontSize={11}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {t}
            </text>
          </g>
        ),
      )}

      {data.map((d, i) => {
        const c = catFor(i)
        const v = valFor(d.value)
        return (
          <g key={`m-${i}`}>
            {horizontal ? (
              <line x1={base} x2={v} y1={c} y2={c} stroke="var(--line-2)" strokeWidth={2} />
            ) : (
              <line x1={c} x2={c} y1={base} y2={v} stroke="var(--line-2)" strokeWidth={2} />
            )}
            <circle cx={horizontal ? v : c} cy={horizontal ? c : v} r={dotRadius} fill="var(--ac)">
              <title>{`${d.label}: ${d.value}`}</title>
            </circle>
            <text
              x={horizontal ? padL - 8 : c}
              y={horizontal ? c : height - padB + 16}
              fill="var(--fg)"
              fontSize={11}
              textAnchor={horizontal ? 'end' : 'middle'}
              dominantBaseline={horizontal ? 'middle' : 'auto'}
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})
