import { SERIES_PALETTE as PALETTE } from './palette'
import { forwardRef, type CSSProperties, type SVGProps } from 'react'
import { cx } from '../../utils/cx'

export interface WordDatum {
  text: string
  value: number
}

export interface WordCloudChartProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  words: WordDatum[]
  width?: number
  height?: number
  className?: string
  style?: CSSProperties
}

const MIN_FONT = 12
const MAX_FONT = 44

interface Box {
  x: number
  y: number
  w: number
  h: number
}

function overlaps(a: Box, b: Box): boolean {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y)
}

export const WordCloudChart = forwardRef<SVGSVGElement, WordCloudChartProps>(function WordCloudChart(
  { words, width = 520, height = 320, className, style, ...rest },
  ref,
) {
  if (!words || words.length === 0) {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        data-vl-chart="word-cloud"
        className={cx('vl-chart', className)}
        style={style}
        {...rest}
      />
    )
  }

  const sorted = [...words]
    .map((w, i) => ({ ...w, rank: i }))
    .sort((a, b) => b.value - a.value)
  const maxV = Math.max(...sorted.map((w) => w.value))
  const minV = Math.min(...sorted.map((w) => w.value))
  const span = maxV - minV || 1

  const cx0 = width / 2
  const cy0 = height / 2

  const placed: Box[] = []
  interface Rendered {
    word: WordDatum
    x: number
    y: number
    fontSize: number
    color: string
  }
  const out: Rendered[] = []

  sorted.forEach((w, order) => {
    const t = (w.value - minV) / span
    const fontSize = MIN_FONT + t * (MAX_FONT - MIN_FONT)
    const bw = fontSize * w.text.length * 0.55
    const bh = fontSize
    // Archimedean spiral: r = step * theta, deterministic.
    const step = 4
    let found: { x: number; y: number } | null = null
    for (let theta = 0; theta < Math.PI * 2 * 40; theta += 0.25) {
      const r = step * theta
      const px = cx0 + r * Math.cos(theta)
      const py = cy0 + r * Math.sin(theta)
      const box: Box = { x: px - bw / 2, y: py - bh / 2, w: bw, h: bh }
      if (box.x < 0 || box.y < 0 || box.x + box.w > width || box.y + box.h > height) continue
      if (placed.some((p) => overlaps(box, p))) continue
      found = { x: px, y: py }
      placed.push(box)
      break
    }
    if (!found) return
    out.push({
      word: w,
      x: found.x,
      y: found.y,
      fontSize,
      color: PALETTE[order % PALETTE.length],
    })
  })

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      data-vl-chart="word-cloud"
      className={cx('vl-chart', className)}
      style={{ fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {out.map((r, i) => (
        <text
          key={`word-${i}`}
          x={r.x}
          y={r.y}
          fill={r.color}
          fontSize={r.fontSize}
          fontWeight={600}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {r.word.text}
          <title>{`${r.word.text}: ${r.word.value}`}</title>
        </text>
      ))}
    </svg>
  )
})
