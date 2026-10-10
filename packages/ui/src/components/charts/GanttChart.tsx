import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface GanttTask {
  label: string
  start: number
  end: number
  color?: string
}

export interface GanttChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  tasks: GanttTask[]
  labels?: string[]
  today?: number
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 110
const PAD_R = 16
const PAD_T = 12
const PAD_B = 28

function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  return `M ${x + rr} ${y} L ${x + w - rr} ${y} Q ${x + w} ${y} ${x + w} ${y + rr} L ${x + w} ${y + h - rr} Q ${x + w} ${y + h} ${x + w - rr} ${y + h} L ${x + rr} ${y + h} Q ${x} ${y + h} ${x} ${y + h - rr} L ${x} ${y + rr} Q ${x} ${y} ${x + rr} ${y} Z`
}

export const GanttChart = forwardRef<SVGSVGElement, GanttChartProps>(function GanttChart(
  { tasks, labels, today, width = 520, height = 280, className, style, ...rest },
  ref,
) {
  if (!tasks || tasks.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="gantt"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const tMin = Math.min(...tasks.map((t) => t.start))
  const tMax = Math.max(...tasks.map((t) => t.end))
  const span = tMax - tMin || 1

  const innerW = width - PAD_L - PAD_R
  const innerH = height - PAD_T - PAD_B
  const rowH = innerH / tasks.length
  const barH = Math.max(6, Math.min(22, rowH * 0.6))

  const xFor = (v: number) => PAD_L + ((v - tMin) / span) * innerW

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="gantt"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {labels &&
        labels.map((l, i) => {
          const v = tMin + (labels.length === 1 ? 0 : (i / (labels.length - 1)) * span)
          return (
            <g key={i}>
              <line
                x1={xFor(v)}
                x2={xFor(v)}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke="var(--line)"
                strokeDasharray="2 4"
                strokeWidth={1}
              />
              <text
                x={xFor(v)}
                y={height - PAD_B + 16}
                fill="var(--fg-3)"
                fontSize={11}
                textAnchor="middle"
              >
                {l}
              </text>
            </g>
          )
        })}

      {tasks.map((t, i) => {
        const c = t.color ?? PALETTE[i % PALETTE.length]
        const y = PAD_T + i * rowH + (rowH - barH) / 2
        const x = xFor(t.start)
        const w = Math.max(2, xFor(t.end) - xFor(t.start))
        return (
          <g key={i}>
            <text
              x={PAD_L - 10}
              y={PAD_T + i * rowH + rowH / 2}
              fill="var(--fg-2)"
              fontSize={11}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {t.label}
            </text>
            <path d={roundedRect(x, y, w, barH, 4)} fill={c}>
              <title>{t.label}</title>
            </path>
          </g>
        )
      })}

      {today !== undefined && (
        <line
          x1={xFor(today)}
          x2={xFor(today)}
          y1={PAD_T}
          y2={PAD_T + innerH}
          stroke="var(--warn)"
          strokeDasharray="4 3"
          strokeWidth={1.5}
        />
      )}
    </svg>
  )
})
