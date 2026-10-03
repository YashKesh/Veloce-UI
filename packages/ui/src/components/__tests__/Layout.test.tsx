import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Container, Grid, Stack, AspectRatio } from '../..'

describe('Container', () => {
  it('applies maxWidth and centers horizontally', () => {
    const { container } = render(<Container maxWidth={720}>x</Container>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.maxWidth).toBe('720px')
    expect(el.style.marginInline).toBe('auto')
  })

  it('accepts a string maxWidth', () => {
    const { container } = render(<Container maxWidth="42rem">x</Container>)
    expect((container.firstElementChild as HTMLElement).style.maxWidth).toBe('42rem')
  })
})

describe('Grid', () => {
  it('renders a grid with equal columns', () => {
    const { container } = render(<Grid cols={3}><span /><span /><span /></Grid>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.display).toBe('grid')
    expect(el.style.gridTemplateColumns).toContain('repeat(3')
  })

  it('switches to auto-fit when minItemWidth is set', () => {
    const { container } = render(<Grid minItemWidth={240}><span /></Grid>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.gridTemplateColumns).toContain('auto-fit')
    expect(el.style.gridTemplateColumns).toContain('240px')
  })

  it('respects separate rowGap/colGap', () => {
    const { container } = render(<Grid rowGap={6} colGap={20}><span /></Grid>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.rowGap).toBe('6px')
    expect(el.style.columnGap).toBe('20px')
  })
})

describe('Stack', () => {
  it('defaults to vertical flex with gap', () => {
    const { container } = render(<Stack gap={12}><span /><span /></Stack>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.display).toBe('flex')
    expect(el.style.flexDirection).toBe('column')
    expect(el.style.gap).toBe('12px')
  })

  it('maps align/justify tokens', () => {
    const { container } = render(<Stack direction="row" align="center" justify="between">x</Stack>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.flexDirection).toBe('row')
    expect(el.style.alignItems).toBe('center')
    expect(el.style.justifyContent).toBe('space-between')
  })

  it('applies wrap when wrap is true', () => {
    const { container } = render(<Stack wrap>x</Stack>)
    expect((container.firstElementChild as HTMLElement).style.flexWrap).toBe('wrap')
  })
})

describe('AspectRatio', () => {
  it('applies aspect-ratio from a string', () => {
    const { container } = render(<AspectRatio ratio="4 / 3">x</AspectRatio>)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.aspectRatio).toBe('4 / 3')
  })

  it('accepts a numeric ratio', () => {
    const { container } = render(<AspectRatio ratio={2}>x</AspectRatio>)
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('2')
  })
})
