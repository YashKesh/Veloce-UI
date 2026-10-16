import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../../utils/cx'

/**
 * Composable annotations overlay for LineChart (and other evenly-spaced x-axis charts
 * that share the same inner padding). Positioned absolutely — drop it inside a wrapper
 * that also contains the chart.
 */

export interface AnnotationPoint {
  type: 'point'
  x: number // index into the data array
  y: number
  label?: ReactNode
  color?: string
}

export interface AnnotationThreshold {
  type: 'threshold'
  y: number
  label?: ReactNode
  color?: string
  dashed?: boolean
}

export interface AnnotationRange {
  type: 'range'
  from: number // index
  to: number // index
  label?: ReactNode
  color?: string
}

export type Annotation = AnnotationPoint | AnnotationThreshold | AnnotationRange

/** Must match LineChart's defaults. */
const PAD_L = 40
const PAD_R = 12
const PAD_T = 12
const PAD_B = 28

export interface AnnotationsLayerProps {
  /** Must match the chart's width/height exactly. */
  width: number
  height: number
  /** The length of the data array passed to the chart (needed to compute x positions). */
  dataLength: number
  /** Y-axis bounds the chart renders with. Pass the same values you pass to the chart. */
  yMin: number
  yMax: number
  annotations: Annotation[]
  /** Override chart padding if you've customized it. */
  padding?: { left?: number; right?: number; top?: number; bottom?: number }
  className?: string
  style?: CSSProperties
}

export const AnnotationsLayer = forwardRef<SVGSVGElement, AnnotationsLayerProps>(
  function AnnotationsLayer(
    { width, height, dataLength, yMin, yMax, annotations, padding, className, style },
    ref,
  ) {
    const padL = padding?.left ?? PAD_L
    const padR = padding?.right ?? PAD_R
    const padT = padding?.top ?? PAD_T
    const padB = padding?.bottom ?? PAD_B
    const innerW = width - padL - padR
    const innerH = height - padT - padB

    const xFor = (i: number) =>
      padL + (dataLength <= 1 ? innerW / 2 : (i / (dataLength - 1)) * innerW)
    const yFor = (v: number) => padT + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        data-vl-annotations=""
        className={cx('vl-annotations', className)}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          fontFamily: 'var(--font-sans)',
          ...style,
        }}
      >
        {annotations.map((a, i) => {
          const stroke = a.color ?? 'var(--ac)'
          if (a.type === 'threshold') {
            const y = yFor(a.y)
            return (
              <g key={i}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={y}
                  y2={y}
                  stroke={stroke}
                  strokeWidth={1.25}
                  strokeDasharray={a.dashed === false ? undefined : '4 3'}
                  opacity={0.9}
                />
                {a.label != null && (
                  <text
                    x={width - padR - 6}
                    y={y - 4}
                    fill={stroke}
                    fontSize={11}
                    textAnchor="end"
                    fontFamily="var(--font-mono)"
                  >
                    {typeof a.label === 'string' ? a.label : null}
                  </text>
                )}
              </g>
            )
          }
          if (a.type === 'range') {
            const x1 = xFor(a.from)
            const x2 = xFor(a.to)
            return (
              <g key={i}>
                <rect
                  x={Math.min(x1, x2)}
                  y={padT}
                  width={Math.abs(x2 - x1)}
                  height={innerH}
                  fill={stroke}
                  opacity={0.1}
                />
                <line x1={x1} x2={x1} y1={padT} y2={padT + innerH} stroke={stroke} strokeDasharray="3 3" opacity={0.6} />
                <line x1={x2} x2={x2} y1={padT} y2={padT + innerH} stroke={stroke} strokeDasharray="3 3" opacity={0.6} />
                {a.label != null && (
                  <text
                    x={(x1 + x2) / 2}
                    y={padT + 14}
                    fill={stroke}
                    fontSize={11}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                  >
                    {typeof a.label === 'string' ? a.label : null}
                  </text>
                )}
              </g>
            )
          }
          // point
          const px = xFor(a.x)
          const py = yFor(a.y)
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={5} fill="var(--bg-1)" stroke={stroke} strokeWidth={2} />
              <circle cx={px} cy={py} r={2} fill={stroke} />
              {a.label != null && (
                <g>
                  <rect
                    x={px + 8}
                    y={py - 18}
                    rx={4}
                    ry={4}
                    width={getTextWidth(a.label) + 10}
                    height={18}
                    fill="var(--bg-1)"
                    stroke="var(--line)"
                  />
                  <text
                    x={px + 13}
                    y={py - 5}
                    fill="var(--fg)"
                    fontSize={11}
                    fontFamily="var(--font-mono)"
                  >
                    {typeof a.label === 'string' ? a.label : null}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    )
  },
)

function getTextWidth(label: ReactNode): number {
  if (typeof label !== 'string') return 60
  // 6.5px per char is a reasonable proxy at 11px mono.
  return Math.max(20, label.length * 6.5)
}
