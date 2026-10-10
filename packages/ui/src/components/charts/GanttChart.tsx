import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, useId, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface GanttTask {
  label: string
  start: number
  end: number
  color?: string
  /** Indices of predecessor tasks in the same `tasks` array. Draws dependency arrows. */
  dependsOn?: number[]
}

export interface GanttChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  tasks: GanttTask[]
  labels?: string[]
  today?: number
  width?: number
  height?: number
  /** Alternating row backgrounds. Default true. */
  zebra?: boolean
  /** Draw dependency arrows between tasks that declare `dependsOn`. Default true. */
  showDependencies?: boolean
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
  { tasks, labels, today, width = 520, height = 280, zebra = true, showDependencies = true, className, style, ...rest },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  const arrowId = `vl-gantt-arrow-${uid}`

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
  const yMid = (i: number) => PAD_T + i * rowH + rowH / 2

  // Build dependency segments: 5-point orthogonal path that always exits the
  // predecessor to the right, runs horizontally in the row-gap between the two
  // tasks (so it never crosses any bar), then enters the target from the left.
  interface Dep { d: string; fromIdx: number; toIdx: number }
  const deps: Dep[] = []
  if (showDependencies) {
    const exitOffset = 6
    const enterPad = 7 // keep arrowhead off the target bar's left edge
    tasks.forEach((t, ti) => {
      if (!t.dependsOn) return
      for (const pi of t.dependsOn) {
        if (pi < 0 || pi >= tasks.length || pi === ti) continue
        const pred = tasks[pi]
        const x0 = xFor(pred.end)
        const y0 = yMid(pi)
        const x1 = xFor(t.start)
        const y1 = yMid(ti)
        const corridor = (y0 + y1) / 2 // horizontal lane between the two row centers
        const exitX = x0 + exitOffset  // step right out of predecessor row
        const enterX = x1 - enterPad   // stop just before target bar
        // 5 segments: right out of pred → down/up to corridor → across to enter column → down/up to target row → right into target
        const d = `M ${x0} ${y0} L ${exitX} ${y0} L ${exitX} ${corridor} L ${enterX} ${corridor} L ${enterX} ${y1} L ${x1 - 2} ${y1}`
        deps.push({ d, fromIdx: pi, toIdx: ti })
      }
    })
  }

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
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 1.5 L 9 5 L 0 8.5 Z" fill="var(--vl-gantt-dep, var(--ac-text))" />
        </marker>
      </defs>

      {/* Row backgrounds — zebra stripes + outer frame */}
      {zebra && (
        <g data-vl-gantt-rows="">
          <rect
            x={PAD_L}
            y={PAD_T}
            width={innerW}
            height={innerH}
            fill="var(--vl-gantt-plot, var(--bg-1))"
          />
          {tasks.map((_, i) => (
            i % 2 === 1 ? (
              <rect
                key={`zebra-${i}`}
                x={PAD_L}
                y={PAD_T + i * rowH}
                width={innerW}
                height={rowH}
                fill="var(--vl-gantt-stripe, var(--bg-2))"
                opacity={0.35}
              />
            ) : null
          ))}
          {/* Horizontal row dividers */}
          {tasks.slice(0, -1).map((_, i) => (
            <line
              key={`rowline-${i}`}
              x1={PAD_L}
              x2={PAD_L + innerW}
              y1={PAD_T + (i + 1) * rowH}
              y2={PAD_T + (i + 1) * rowH}
              stroke="var(--line)"
              strokeWidth={0.5}
              opacity={0.6}
            />
          ))}
          {/* Plot frame */}
          <rect
            x={PAD_L}
            y={PAD_T}
            width={innerW}
            height={innerH}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
          />
        </g>
      )}

      {/* Vertical time-axis grid */}
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

      {/* Task bars + row labels */}
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

      {/* Dependency arrows — accent-tinted, routed in the row-gap so they stay off the bars */}
      {deps.map((dep, i) => (
        <path
          key={`dep-${i}`}
          data-vl-gantt-dep=""
          d={dep.d}
          fill="none"
          stroke="var(--vl-gantt-dep, var(--ac-text))"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${arrowId})`}
          opacity={0.9}
        />
      ))}

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
