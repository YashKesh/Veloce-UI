import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface HorizonSeries {
  label: string
  data: number[]
}

export interface HorizonChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  series: HorizonSeries[]
  bands?: number
  labels?: string[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const PAD_L = 90
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28
const LANE_H = 28

function areaPath(
  pts: { x: number; y: number }[],
  baseY: number,
): string {
  if (pts.length === 0) return ''
  let d = `M ${pts[0].x} ${baseY}`
  for (const p of pts) d += ` L ${p.x} ${p.y}`
  d += ` L ${pts[pts.length - 1].x} ${baseY} Z`
  return d
}

export const HorizonChart = forwardRef<SVGSVGElement, HorizonChartProps>(function HorizonChart(
  { series, bands = 3, labels, width = 520, height, className, style, ...rest },
  ref,
) {
  const laneCount = series?.length ?? 0
  const h = height ?? PAD_T + PAD_B + laneCount * LANE_H

  if (!series || series.length === 0 || series.every((s) => s.data.length === 0)) {
    return (
      <svg
        ref={ref}
        width={width}
        height={h}
        data-vl-chart="horizon"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const nb = Math.max(1, Math.floor(bands))
  const innerW = width - PAD_L - PAD_R
  const absMax = Math.max(1, ...series.flatMap((s) => s.data.map((v) => Math.abs(v))))
  const bandSize = absMax / nb

  const posColor = (k: number) =>
    `color-mix(in oklch, var(--ac) ${Math.round(((k + 1) / nb) * 85 + 15)}%, var(--bg-1))`
  const negColor = (k: number) =>
    `color-mix(in oklch, var(--err) ${Math.round(((k + 1) / nb) * 85 + 15)}%, var(--bg-1))`

  const n = Math.max(...series.map((s) => s.data.length))
  const xFor = (i: number) => PAD_L + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)

  return (
    <svg
      ref={ref}
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      data-vl-chart="horizon"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {series.map((s, si) => {
        const laneTop = PAD_T + si * LANE_H
        const laneBottom = laneTop + LANE_H - 2
        const yFor = (mag: number) => laneBottom - (Math.min(mag, bandSize) / bandSize) * (LANE_H - 2)
        return (
          <g key={si}>
            <clipPath id={`vl-horizon-lane-${si}`}>
              <rect x={PAD_L} y={laneTop} width={innerW} height={LANE_H - 2} />
            </clipPath>
            <g clipPath={`url(#vl-horizon-lane-${si})`}>
              {Array.from({ length: nb }).map((_, k) => {
                const posPts = s.data.map((v, i) => ({
                  x: xFor(i),
                  y: yFor(Math.max(0, Math.abs(v) - k * bandSize) * (v >= 0 ? 1 : 0)),
                }))
                const negPts = s.data.map((v, i) => ({
                  x: xFor(i),
                  y: yFor(Math.max(0, Math.abs(v) - k * bandSize) * (v < 0 ? 1 : 0)),
                }))
                return (
                  <g key={k}>
                    <path d={areaPath(posPts, laneBottom)} fill={posColor(k)} />
                    <path d={areaPath(negPts, laneBottom)} fill={negColor(k)} />
                  </g>
                )
              })}
            </g>
            <text
              x={PAD_L - 10}
              y={laneTop + (LANE_H - 2) / 2}
              fill="var(--fg-2)"
              fontSize={11}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {s.label}
            </text>
          </g>
        )
      })}

      {labels &&
        labels.map((l, i) => (
          <text
            key={i}
            x={xFor(i)}
            y={h - PAD_B + 16}
            fill="var(--fg-3)"
            fontSize={11}
            textAnchor="middle"
          >
            {l}
          </text>
        ))}
    </svg>
  )
})
