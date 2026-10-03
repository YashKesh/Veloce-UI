import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from 'react'
import { cx } from '../../utils/cx'

export interface GaugeThreshold {
  /** Position along 0..max where the threshold sits. */
  at: number
  /** Threshold label, drawn above the arc. */
  label?: string
  /** Tick + label colour. Defaults to var(--warn). */
  color?: string
}

export interface GaugeChartProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'format'> {
  value: number
  max?: number
  size?: number
  thickness?: number
  color?: string
  trackColor?: string
  label?: ReactNode
  sublabel?: ReactNode
  showNeedle?: boolean
  showTicks?: boolean
  showEndLabels?: boolean
  thresholds?: GaugeThreshold[]
  /** Formatter used by the hover tooltip (and the centre label when provided). */
  format?: (n: number) => string
  /** Enable hover tooltip over the value arc. Default true. */
  showHoverTooltip?: boolean
  /** Enable mount sweep + needle tween animations. Default true. */
  animated?: boolean
  className?: string
  style?: CSSProperties
}

function polar(cxp: number, cyp: number, r: number, a: number) {
  return [cxp + r * Math.cos(a), cyp + r * Math.sin(a)] as const
}

function arcPath(cxp: number, cyp: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cxp, cyp, r, a0)
  const [x1, y1] = polar(cxp, cyp, r, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

const EASE = 'cubic-bezier(.16,1,.3,1)'

export const GaugeChart = forwardRef<SVGSVGElement, GaugeChartProps>(function GaugeChart(
  {
    value, max = 100, size = 240, thickness = 18,
    color = 'var(--ac)', trackColor = 'var(--bg-3)',
    label, sublabel, showNeedle = true, showTicks = true, showEndLabels = true,
    thresholds, format, showHoverTooltip = true, animated = true,
    className, style, ...rest
  },
  ref,
) {
  const uid = useId().replace(/:/g, ''); void uid

  const pad = Math.max(26, thickness + 10)
  const w = size
  const h = Math.round(size / 2 + pad)
  const cx0 = size / 2
  const cy0 = size / 2
  const r = size / 2 - thickness / 2 - 10

  const a0 = Math.PI
  const a1 = 2 * Math.PI
  const span = a1 - a0

  const clamped = Math.max(0, Math.min(max, value))
  const t = max > 0 ? clamped / max : 0
  const aVal = a0 + t * span

  const stops = (() => {
    if (thresholds && thresholds.length > 0) {
      const ratios = thresholds.map((th) => Math.max(0, Math.min(1, th.at / max))).sort((a, b) => a - b)
      return [0, ...ratios, 1]
    }
    return [0, 0.5, 0.9, 1]
  })()

  const trackSegments: { d: string }[] = []
  for (let i = 0; i < stops.length - 1; i++) {
    const sa = a0 + stops[i] * span + 0.015
    const ea = a0 + stops[i + 1] * span - 0.015
    if (ea > sa) trackSegments.push({ d: arcPath(cx0, cy0, r, sa, ea) })
  }

  const valD = t > 0 ? arcPath(cx0, cy0, r, a0, aVal) : null

  const tickTs = [0, 0.25, 0.5, 0.75, 1]
  const thresholdList = thresholds ?? [
    { at: 0.5 * max, color: 'var(--warn)', label: `${Math.round(0.5 * max)}` },
    { at: 0.9 * max, color: 'var(--ok)', label: `${Math.round(0.9 * max)}` },
  ]

  // --- Animation state ---
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const shouldAnimate = animated && !reduced
  const valPathRef = useRef<SVGPathElement | null>(null)
  const [needleAngle, setNeedleAngle] = useState<number>(shouldAnimate ? a0 : aVal)
  const rafRef = useRef<number | null>(null)
  const prevAngleRef = useRef<number>(shouldAnimate ? a0 : aVal)

  useEffect(() => {
    if (!shouldAnimate) { setNeedleAngle(aVal); prevAngleRef.current = aVal; return }
    const from = prevAngleRef.current
    const to = aVal
    const start = performance.now()
    const dur = 600
    const ease = (x: number) => 1 - Math.pow(1 - x, 4)
    function step(now: number) {
      const p = Math.min(1, (now - start) / dur)
      setNeedleAngle(from + (to - from) * ease(p))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
      else prevAngleRef.current = to
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [aVal, shouldAnimate])

  useEffect(() => {
    const p = valPathRef.current
    if (!p) return
    if (!shouldAnimate) {
      p.style.transition = ''
      p.style.strokeDasharray = ''
      p.style.strokeDashoffset = ''
      return
    }
    const len = p.getTotalLength ? p.getTotalLength() : 0
    p.style.transition = 'none'
    p.style.strokeDasharray = `${len}`
    p.style.strokeDashoffset = `${len}`
    void p.getBoundingClientRect()
    p.style.transition = `stroke-dashoffset 600ms ${EASE}`
    p.style.strokeDashoffset = '0'
  }, [valD, shouldAnimate])

  const [nx, ny] = polar(cx0, cy0, r - thickness / 2 - 6, needleAngle)

  // --- Hover tooltip ---
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [hovered, setHovered] = useState(false)

  const setMergedRef = (el: SVGSVGElement | null) => {
    svgRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) (ref as React.MutableRefObject<SVGSVGElement | null>).current = el
  }

  const fmt = format ?? ((n: number) => String(n))
  // Pin the tooltip to the end of the value arc so it reflects the current value.
  const tooltipPos = useMemo(() => {
    if (!hovered) return null
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const sx = rect.width / w, sy = rect.height / h
    const [px, py] = polar(cx0, cy0, r, aVal)
    return { left: px * sx, top: py * sy - 28 }
  }, [hovered, cx0, cy0, r, w, h, aVal])

  const centreLabel = label != null ? label : format ? fmt(clamped) : null

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} data-vl-chart-wrap="gauge">
      <svg
        ref={setMergedRef}
        width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        data-vl-chart="gauge"
        className={cx('vl-chart', className)}
        style={{ fontFamily: 'var(--font-sans)', ...style }}
        {...rest}
      >
        {trackSegments.map((seg, i) => (
          <path key={`tk-${i}`} d={seg.d} stroke={trackColor} strokeWidth={thickness} fill="none" strokeLinecap="butt" />
        ))}
        {valD && (
          <path ref={valPathRef} d={valD} stroke={color} strokeWidth={thickness} fill="none" strokeLinecap="round" />
        )}
        {showHoverTooltip && valD && (
          <path
            data-vl-gauge-hit=""
            d={valD}
            stroke="transparent"
            strokeWidth={thickness + 10}
            fill="none"
            strokeLinecap="round"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
        )}
        {showTicks && tickTs.map((tt, i) => {
          const a = a0 + tt * span
          const [x0, y0] = polar(cx0, cy0, r + thickness / 2 + 4, a)
          const [x1, y1] = polar(cx0, cy0, r + thickness / 2 + 9, a)
          return <line key={`tick-${i}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--line-2)" strokeWidth={1} />
        })}
        {thresholdList.map((th, i) => {
          const a = a0 + Math.max(0, Math.min(1, th.at / max)) * span
          const [x0, y0] = polar(cx0, cy0, r - thickness / 2 - 2, a)
          const [x1, y1] = polar(cx0, cy0, r + thickness / 2 + 2, a)
          return <line key={`th-${i}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke={th.color ?? 'var(--warn)'} strokeWidth={1.5} />
        })}
        {thresholdList.map((th, i) => {
          if (!th.label) return null
          const a = a0 + Math.max(0, Math.min(1, th.at / max)) * span
          const [lx, ly] = polar(cx0, cy0, r + thickness / 2 + 20, a)
          return (
            <text key={`thl-${i}`} x={lx} y={ly} fill={th.color ?? 'var(--warn)'} fontSize={11} textAnchor="middle" dominantBaseline="middle">
              {th.label}
            </text>
          )
        })}
        {showNeedle && (
          <g>
            <path d={`M ${cx0} ${cy0} L ${nx} ${ny}`} stroke="var(--fg)" strokeWidth={2.5} strokeLinecap="round" fill="none" />
            <circle cx={cx0} cy={cy0} r={5} fill="var(--fg)" />
          </g>
        )}
        {showEndLabels && (
          <>
            <text x={cx0 - r} y={cy0 + 14} fill="var(--fg-3)" fontSize={11} textAnchor="middle">0</text>
            <text x={cx0 + r} y={cy0 + 14} fill="var(--fg-3)" fontSize={11} textAnchor="middle">{max}</text>
          </>
        )}
        {centreLabel != null && (
          <text x={cx0} y={cy0 - 10} fill="var(--fg)" fontSize={Math.round(size * 0.16)} fontWeight={600} textAnchor="middle" dominantBaseline="middle">
            {centreLabel}
          </text>
        )}
        {sublabel != null && (
          <text x={cx0} y={cy0 + 10} fill="var(--fg-3)" fontSize={11} textAnchor="middle" dominantBaseline="middle">
            {sublabel}
          </text>
        )}
      </svg>
      {showHoverTooltip && hovered && tooltipPos && (
        <div
          data-vl-gauge-tooltip=""
          style={{
            background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 6,
            padding: '6px 10px', boxShadow: 'var(--shadow-md)', fontSize: 12.5, color: 'var(--fg)',
            pointerEvents: 'none', position: 'absolute',
            left: tooltipPos.left, top: tooltipPos.top,
            transform: 'translate(-50%, -100%)', whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 600 }}>{fmt(clamped)}</div>
          <div style={{ color: 'var(--fg-3)', fontSize: 11 }}>
            {Math.round((clamped / max) * 100)}% of {max}
          </div>
        </div>
      )}
    </div>
  )
})
