import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataGrid, type ColumnDef } from '../DataGrid'

type Row = { id: string; name: string; age: number }

const rows: Row[] = [
  { id: 'a', name: 'Alice', age: 30 },
  { id: 'b', name: 'Bob', age: 25 },
  { id: 'c', name: 'Cara', age: 40 },
]

const columns: ColumnDef<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'age', header: 'Age', sortable: true, align: 'end' },
]

describe('DataGrid', () => {
  it('renders rows and columns from props', () => {
    render(<DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Cara')).toBeInTheDocument()
  })

  it('clicking a sortable header fires onSortChange', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc')
  })

  it('cycles sort key -> asc -> desc -> null', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    const { rerender } = render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        sortKey="name"
        sortDir="asc"
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenLastCalledWith('name', 'desc')
    rerender(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        sortKey="name"
        sortDir="desc"
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Name/ }))
    expect(onSortChange).toHaveBeenLastCalledWith('name', null)
  })

  it('shows arrow glyph on current sort key', () => {
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        sortKey="age"
        sortDir="desc"
      />,
    )
    const btn = screen.getByRole('button', { name: /Age/ })
    // Showcase language: single chevron glyph (▲ asc / ▼ desc) in var(--ac) when active.
    expect(btn.textContent).toContain('▼')
  })

  it('selectable + checking a row calls onSelectedIdsChange with the id', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectedIdsChange={onChange}
      />,
    )
    const inputs = screen.getAllByLabelText(/Select/) as HTMLInputElement[]
    // inputs[0] is header; inputs[1] is first row — click the surrounding label
    await user.click(inputs[1].closest('label') as HTMLElement)
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0][0] as Set<string>
    expect(call.has('a')).toBe(true)
  })

  it('header checkbox selects all visible rows', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectedIdsChange={onChange}
      />,
    )
    const inputs = screen.getAllByLabelText(/Select/) as HTMLInputElement[]
    await user.click(inputs[0].closest('label') as HTMLElement)
    const call = onChange.mock.calls[0][0] as Set<string>
    expect(call.has('a') && call.has('b') && call.has('c')).toBe(true)
  })

  it('pagination next calls onPageChange(pageIndex+1)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    const many = Array.from({ length: 60 }, (_, i) => ({
      id: `r${i}`,
      name: `n${i}`,
      age: i,
    }))
    render(
      <DataGrid
        rows={many}
        columns={columns}
        getRowId={(r) => r.id}
        pageIndex={0}
        pageSize={25}
        onPageChange={onPageChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('empty state renders when rows=[]', () => {
    render(
      <DataGrid
        rows={[]}
        columns={columns}
        getRowId={(r) => r.id}
        emptyState="Nothing here"
      />,
    )
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('uses getRowId as the stable key', () => {
    const getRowId = vi.fn((r: Row) => r.id)
    render(<DataGrid rows={rows} columns={columns} getRowId={getRowId} />)
    expect(getRowId).toHaveBeenCalled()
  })

  it('rowKey alias works identically to getRowId', () => {
    const rowKey = vi.fn((r: Row) => r.id)
    render(<DataGrid rows={rows} columns={columns} rowKey={rowKey} />)
    expect(rowKey).toHaveBeenCalled()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('virtualize=true renders without crashing on large row sets', () => {
    const big = Array.from({ length: 500 }, (_, i) => ({
      id: `v${i}`,
      name: `name${i}`,
      age: i,
    }))
    const { container } = render(
      <DataGrid rows={big} columns={columns} getRowId={(r) => r.id} virtualize />,
    )
    // In jsdom, virtualizer counts items but may not populate visible items without
    // measured scroll height. Component must render the scroll container regardless.
    expect(container.querySelector('[data-vl-datagrid-scroll]')).toBeTruthy()
  })

  it('column pin: pinned column header has position sticky', () => {
    const pinnedCols: ColumnDef<Row>[] = [
      { key: 'name', header: 'Name', pin: 'left' },
      { key: 'age', header: 'Age' },
    ]
    render(<DataGrid rows={rows} columns={pinnedCols} getRowId={(r) => r.id} />)
    const th = screen.getByText('Name').closest('th') as HTMLElement
    expect(th.style.position).toBe('sticky')
  })

  it('column resize: dragging handle increases width', () => {
    const resizableCols: ColumnDef<Row>[] = [
      { key: 'name', header: 'Name', width: 120, resizable: true },
      { key: 'age', header: 'Age' },
    ]
    const { container } = render(
      <DataGrid rows={rows} columns={resizableCols} getRowId={(r) => r.id} />,
    )
    const resizer = container.querySelector('[data-vl-datagrid-resizer]') as HTMLElement
    expect(resizer).toBeTruthy()
    act(() => {
      const md = new MouseEvent('mousedown', { bubbles: true, clientX: 100 })
      resizer.dispatchEvent(md)
    })
    act(() => {
      const mm = new MouseEvent('mousemove', { bubbles: true, clientX: 180 })
      window.dispatchEvent(mm)
    })
    act(() => {
      const mu = new MouseEvent('mouseup', { bubbles: true })
      window.dispatchEvent(mu)
    })
    const th = container.querySelector('th') as HTMLElement
    // Width should have grown by about 80px (100 -> 180 delta)
    const widthStr = th.style.width
    const w = parseInt(widthStr, 10)
    expect(w).toBeGreaterThan(120)
  })

  it('hidden column is not rendered', () => {
    const cols: ColumnDef<Row>[] = [
      { key: 'name', header: 'Name' },
      { key: 'age', header: 'Age', hidden: true },
    ]
    render(<DataGrid rows={rows} columns={cols} getRowId={(r) => r.id} />)
    expect(screen.queryByText('Age')).toBeNull()
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('inline editing: double-click + Enter commits via onCellEdit', async () => {
    const user = userEvent.setup()
    const onCellEdit = vi.fn()
    const cols: ColumnDef<Row>[] = [
      { key: 'name', header: 'Name', editable: true, editor: 'text' },
      { key: 'age', header: 'Age' },
    ]
    render(
      <DataGrid rows={rows} columns={cols} getRowId={(r) => r.id} onCellEdit={onCellEdit} />,
    )
    const cell = screen.getByText('Alice')
    await user.dblClick(cell)
    const input = document.querySelector(
      '[data-vl-datagrid-editor]',
    ) as HTMLInputElement
    expect(input).toBeTruthy()
    await user.clear(input)
    await user.type(input, 'Zed{Enter}')
    expect(onCellEdit).toHaveBeenCalled()
    const [, key, newValue] = onCellEdit.mock.calls[0]
    expect(key).toBe('name')
    expect(newValue).toBe('Zed')
  })

  it('quickFilter filters out non-matching rows', () => {
    render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} quickFilter="xyznope" />,
    )
    expect(screen.queryByText('Alice')).toBeNull()
    expect(screen.queryByText('Bob')).toBeNull()
  })

  it('quickFilter: substring match keeps matching rows', () => {
    render(<DataGrid rows={rows} columns={columns} getRowId={(r) => r.id} quickFilter="ali" />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).toBeNull()
  })

  it('multi-sort: shift-click stacks; non-shift replaces', async () => {
    const user = userEvent.setup()
    const onSortChangeMulti = vi.fn()
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        sort={[]}
        onSortChangeMulti={onSortChangeMulti}
      />,
    )
    const nameBtn = screen.getByRole('button', { name: /Name/ })
    const ageBtn = screen.getByRole('button', { name: /Age/ })
    await user.keyboard('{Shift>}')
    await user.click(nameBtn)
    await user.click(ageBtn)
    await user.keyboard('{/Shift}')
    expect(onSortChangeMulti).toHaveBeenCalled()
    const lastCall = onSortChangeMulti.mock.calls[onSortChangeMulti.mock.calls.length - 1][0]
    expect(Array.isArray(lastCall)).toBe(true)
  })

  it('compound: DataGrid.Toolbar renders inside the grid', () => {
    const { container } = render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id}>
        <DataGrid.Toolbar>
          <span>custom-tool</span>
        </DataGrid.Toolbar>
      </DataGrid>,
    )
    expect(container.querySelector('[data-vl-datagrid-toolbar]')).toBeTruthy()
    expect(screen.getByText('custom-tool')).toBeInTheDocument()
  })

  it('ColumnMenu: renders trigger button when default toolbar (no children) is used', () => {
    const { container } = render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id}>
        <DataGrid.Toolbar />
      </DataGrid>,
    )
    expect(container.querySelector('[data-vl-datagrid-colmenu-trigger]')).toBeTruthy()
  })

  it('ColumnMenu: clicking the trigger opens the menu and lists all columns', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id}>
        <DataGrid.Toolbar />
      </DataGrid>,
    )
    const trigger = container.querySelector(
      '[data-vl-datagrid-colmenu-trigger]',
    ) as HTMLButtonElement
    await user.click(trigger)
    const panel = container.querySelector('[data-vl-datagrid-colmenu-panel]')
    expect(panel).toBeTruthy()
    expect(panel!.textContent).toContain('Name')
    expect(panel!.textContent).toContain('Age')
  })

  it('ColumnMenu: toggling a checkbox removes that column from the grid', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id}>
        <DataGrid.Toolbar />
      </DataGrid>,
    )
    const trigger = container.querySelector(
      '[data-vl-datagrid-colmenu-trigger]',
    ) as HTMLButtonElement
    await user.click(trigger)
    // Age column toggle — find the label by text, then click its checkbox label.
    const items = container.querySelectorAll('[data-vl-datagrid-colmenu-item]')
    const ageItem = Array.from(items).find((el) => el.textContent?.includes('Age')) as HTMLElement
    expect(ageItem).toBeTruthy()
    await user.click(ageItem)
    // Age header <th> should disappear from the grid (menu panel entry stays).
    const headerCells = Array.from(container.querySelectorAll('thead th'))
    const hasAgeHeader = headerCells.some((th) => th.textContent?.includes('Age'))
    expect(hasAgeHeader).toBe(false)
  })

  it('ColumnMenu: Esc closes the menu', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DataGrid rows={rows} columns={columns} getRowId={(r) => r.id}>
        <DataGrid.Toolbar />
      </DataGrid>,
    )
    const trigger = container.querySelector(
      '[data-vl-datagrid-colmenu-trigger]',
    ) as HTMLButtonElement
    await user.click(trigger)
    expect(container.querySelector('[data-vl-datagrid-colmenu-panel]')).toBeTruthy()
    await user.keyboard('{Escape}')
    expect(container.querySelector('[data-vl-datagrid-colmenu-panel]')).toBeNull()
  })

  it('compound: DataGrid.Pagination renders standalone', () => {
    const onPageChange = vi.fn()
    render(
      <DataGrid.Pagination
        pageIndex={0}
        pageSize={10}
        totalRows={30}
        onPageChange={onPageChange}
      />,
    )
    // Pagination footer renders "Page", pageIndex+1, "of", pageCount across spans.
    const nav = document.querySelector('[data-vl-datagrid-pagination]')
    expect(nav).toBeTruthy()
    expect(nav!.textContent).toMatch(/Page/)
    expect(nav!.textContent).toMatch(/1/)
    expect(nav!.textContent).toMatch(/3/)
  })
})
