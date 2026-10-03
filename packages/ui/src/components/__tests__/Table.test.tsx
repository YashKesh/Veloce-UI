import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from '../Table'

describe('Table', () => {
  it('renders a <table> with caption', () => {
    const { container } = render(
      <Table caption="Projects">
        <Table.Body>
          <Table.Row>
            <Table.Cell>a</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(container.querySelector('table[data-vl-table]')).toBeTruthy()
    expect(container.querySelector('caption')?.textContent).toBe('Projects')
  })

  it('striped variant sets data attribute', () => {
    const { container } = render(
      <Table variant="striped">
        <Table.Body>
          <Table.Row>
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(container.querySelector('[data-vl-table]')).toHaveAttribute('data-variant', 'striped')
  })

  it('column align=end applies text-align end', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Column align="end" data-testid="col">
              Size
            </Table.Column>
          </Table.Row>
        </Table.Header>
      </Table>,
    )
    const th = screen.getByTestId('col')
    expect(th.style.textAlign).toBe('end')
    expect(th).toHaveAttribute('data-align', 'end')
  })

  it('row selected applies data-selected', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row selected data-testid="row">
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(screen.getByTestId('row')).toHaveAttribute('data-selected', '')
  })

  it('cell variant=num applies tabular-nums', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell variant="num" data-testid="c">
              42
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    const cell = screen.getByTestId('c')
    expect(cell.style.fontVariantNumeric).toBe('tabular-nums')
    expect(cell.style.textAlign).toBe('end')
  })

  it('status cell renders dot + label', () => {
    const { container } = render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell variant="status" tone="ok">
              Ready
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    const wrap = container.querySelector('[data-vl-table-status]')
    expect(wrap).toBeTruthy()
    expect(wrap?.textContent).toContain('Ready')
    // First child is the dot <span>
    expect(wrap?.firstElementChild?.tagName).toBe('SPAN')
  })

  it('sticky header applies position: sticky inline on <th>', () => {
    const { container } = render(
      <Table>
        <Table.Header sticky offset={12}>
          <Table.Row>
            <Table.Column>Col</Table.Column>
          </Table.Row>
        </Table.Header>
      </Table>,
    )
    const th = container.querySelector('th') as HTMLTableCellElement
    expect(th).toBeTruthy()
    expect(th.style.position).toBe('sticky')
    expect(th.style.top).toBe('12px')
  })

  it('row tone applies data-tone', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row tone="err" data-testid="row">
            <Table.Cell>x</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(screen.getByTestId('row')).toHaveAttribute('data-tone', 'err')
  })
})
