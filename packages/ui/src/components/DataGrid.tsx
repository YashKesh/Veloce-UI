import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cx } from '../utils/cx'
import { Checkbox } from './Checkbox'
import { Input } from './Input'

export type SortDir = 'asc' | 'desc' | null
export type DataGridAlign = 'start' | 'center' | 'end'
export type DataGridDensity = 'compact' | 'cozy' | 'comfortable'
export type DataGridEditor = 'text' | 'number' | 'select'

export interface MultiSortEntry {
  key: string
  dir: 'asc' | 'desc'
}

export interface ColumnDef<Row> {
  key: string
  header: string
  width?: number | string
  align?: DataGridAlign
  sortable?: boolean
  render?: (row: Row, index: number) => ReactNode
  pin?: 'left' | 'right'
  resizable?: boolean
  minWidth?: number
  hidden?: boolean
  editable?: boolean
  editor?: DataGridEditor
  options?: { label: string; value: string }[]
}

export interface DataGridProps<Row extends object> {
  rows: Row[]
  columns: ColumnDef<Row>[]
  /** Preferred name for the row id accessor going forward. */
  rowKey?: (row: Row) => string
  /** Alias retained for backwards compat; same signature as rowKey. */
  getRowId?: (row: Row) => string
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectedIdsChange?: (ids: Set<string>) => void
  sortKey?: string
  sortDir?: SortDir
  onSortChange?: (key: string, dir: SortDir) => void
  /** Controlled multi-sort stack. If provided, takes precedence over sortKey/sortDir. */
  sort?: MultiSortEntry[]
  onSortChangeMulti?: (sort: MultiSortEntry[]) => void
  pageIndex?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  totalRows?: number
  stickyHeader?: boolean
  density?: DataGridDensity
  emptyState?: ReactNode
  className?: string
  style?: CSSProperties
  virtualize?: boolean
  onColumnResize?: (key: string, width: number) => void
  visibleColumnKeys?: string[]
  onVisibleColumnKeysChange?: (keys: string[]) => void
  quickFilter?: string
  onQuickFilterChange?: (q: string) => void
  onCellEdit?: (row: Row, key: string, newValue: string | number) => void
  /** Per-row style merged into the `<tr>` inline style. Receives the row object. */
  rowStyle?: (row: Row) => CSSProperties | undefined
  /** Per-row click handler. Fires when the row (not a cell) is clicked. */
  onRowClick?: (row: Row) => void
  children?: ReactNode
}

const padMap: Record<DataGridDensity, string> = {
  compact: '0 10px',
  cozy: '0 12px',
  comfortable: '0 14px',
}

const headerPadMap: Record<DataGridDensity, string> = {
  compact: '0 10px',
  cozy: '0 12px',
  comfortable: '0 14px',
}

const rowHeightMap: Record<DataGridDensity, number> = {
  compact: 32,
  cozy: 40,
  comfortable: 48,
}

const headerHeightMap: Record<DataGridDensity, number> = {
  compact: 32,
  cozy: 36,
  comfortable: 42,
}

const bodyFontMap: Record<DataGridDensity, number> = {
  compact: 13,
  cozy: 13.5,
  comfortable: 14,
}

const alignMap: Record<DataGridAlign, 'start' | 'center' | 'end'> = {
  start: 'start',
  center: 'center',
  end: 'end',
}

const SELECT_COL_WIDTH = 44

function nextSortDir(current: SortDir): SortDir {
  if (current === null) return 'asc'
  if (current === 'asc') return 'desc'
  return null
}

function stringifyCell(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

const TOOLBAR_TAG = Symbol('vl-datagrid-toolbar')
const PAGINATION_TAG = Symbol('vl-datagrid-pagination')
const COLUMN_TAG = Symbol('vl-datagrid-column')
const DETAIL_PANEL_TAG = Symbol('vl-datagrid-detail-panel')
const COLUMN_MENU_TAG = Symbol('vl-datagrid-column-menu')

interface ColumnMenuCtxValue {
  columns: ColumnDef<object>[]
  visibleKeys: string[]
  toggleKey: (key: string) => void
}

const ColumnMenuCtx = createContext<ColumnMenuCtxValue | null>(null)

function ColumnMenu({ className, style }: { className?: string; style?: CSSProperties }) {
  const ctx = useContext(ColumnMenuCtx)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const el = rootRef.current
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(false)
    }
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!ctx) return null

  const triggerStyle: CSSProperties = {
    width: 44, height: 28, display: 'inline-grid', placeItems: 'center', borderRadius: 7,
    border: '1px solid var(--line-2, var(--line))', background: 'var(--bg-1)',
    color: 'var(--fg-2)', fontSize: 14, padding: 0, cursor: 'pointer',
  }
  const panelStyle: CSSProperties = {
    position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 220,
    background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 8,
    boxShadow: 'var(--shadow-md)', padding: 6, zIndex: 20,
  }
  const headerStyle: CSSProperties = {
    fontSize: 11, textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
    color: 'var(--fg-3)', letterSpacing: '0.06em', padding: '4px 8px 6px',
  }

  return (
    <div ref={rootRef} data-vl-datagrid-colmenu="" className={className} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        aria-label="Column visibility"
        aria-expanded={open}
        data-vl-datagrid-colmenu-trigger=""
        onClick={() => setOpen((o) => !o)}
        style={triggerStyle}
      >⚙</button>
      {open ? (
        <div data-vl-datagrid-colmenu-panel="" role="menu" style={panelStyle}>
          <div style={headerStyle}>Columns</div>
          {ctx.columns.map((col) => {
            const isPinned = col.pin === 'left' || col.pin === 'right'
            const checked = ctx.visibleKeys.includes(col.key) || isPinned
            return (
              <label
                key={col.key}
                data-vl-datagrid-colmenu-item=""
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, height: 28,
                  padding: '0 8px', borderRadius: 6, fontSize: 13, color: 'var(--fg)',
                  cursor: isPinned ? 'default' : 'pointer',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Checkbox
                  checked={checked}
                  disabled={isPinned}
                  onCheckedChange={() => { if (!isPinned) ctx.toggleKey(col.key) }}
                  aria-label={`Toggle column ${col.header}`}
                />
                <span style={{ flex: 1 }}>{col.header}</span>
                {isPinned ? <span style={{ fontSize: 10, color: 'var(--fg-3)' }}>pinned</span> : null}
              </label>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
;(ColumnMenu as unknown as SlotMarker).__vlSlot = COLUMN_MENU_TAG

interface SlotMarker {
  __vlSlot: symbol
}

type ToolbarProps = { children?: ReactNode; style?: CSSProperties; className?: string }
function Toolbar(props: ToolbarProps) {
  const { children, style, className } = props
  return (
    <div
      data-vl-datagrid-toolbar=""
      className={cx('vl-datagrid-toolbar', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 44,
        padding: '0 10px',
        borderBottom: '1px solid var(--line)',
        background: 'var(--bg-1)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
;(Toolbar as unknown as SlotMarker).__vlSlot = TOOLBAR_TAG

interface PaginationSlotProps {
  pageIndex: number
  pageSize: number
  totalRows: number
  onPageChange?: (p: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
  style?: CSSProperties
}
function PaginationFooter(props: PaginationSlotProps) {
  const { pageIndex, pageSize, totalRows, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], className, style } = props
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const canPrev = pageIndex > 0
  const canNext = pageIndex < pageCount - 1
  const btn = (dir: -1 | 1, label: string, glyph: string, enabled: boolean): ReactNode => (
    <button
      type="button" data-vl-datagrid-pagebtn="" aria-label={label} disabled={!enabled}
      onClick={() => onPageChange?.(pageIndex + dir)}
      style={{
        display: 'inline-grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7,
        border: '1px solid var(--line-2, var(--line))', background: 'var(--bg-1)',
        color: 'var(--fg-2)', fontSize: 13, padding: 0,
        opacity: enabled ? 1 : 0.4, cursor: enabled ? 'pointer' : 'not-allowed',
      }}
    >{glyph}</button>
  )
  return (
    <div
      data-vl-datagrid-pagination=""
      className={cx('vl-datagrid-pagination', className)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderTop: '1px solid var(--line)', background: 'var(--bg-1)',
        fontSize: 12.5, color: 'var(--fg-3)', fontFamily: 'var(--font-sans)', ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Rows per page</span>
        <select
          data-vl-datagrid-pagesize="" value={pageSize} disabled={!onPageSizeChange}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          style={{
            height: 26, padding: '0 6px', borderRadius: 6,
            border: '1px solid var(--line-2, var(--line))', background: 'var(--bg-1)',
            color: 'var(--fg-2)', fontSize: 12.5, fontFamily: 'inherit',
          }}
        >
          {pageSizeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div style={{ color: 'var(--fg-2)' }}>
        <span style={{ color: 'var(--fg-3)' }}>Page </span>{pageIndex + 1}
        <span style={{ color: 'var(--fg-3)' }}> of </span>{pageCount}
        <span style={{ color: 'var(--fg-3)', marginLeft: 10 }}>· {totalRows} total</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {btn(-1, 'Previous page', '‹', canPrev)}
        {btn(1, 'Next page', '›', canNext)}
      </div>
    </div>
  )
}
;(PaginationFooter as unknown as SlotMarker).__vlSlot = PAGINATION_TAG

// Column type helper — no-op at runtime; purely for doc-style JSX.
function ColumnPlaceholder(_props: ColumnDef<object>) {
  return null
}
;(ColumnPlaceholder as unknown as SlotMarker).__vlSlot = COLUMN_TAG

// DetailPanel — v1.1 slot; warns dev-only.
function DetailPanel(_props: { children?: ReactNode }) {
  const g = globalThis as unknown as { process?: { env?: { NODE_ENV?: string } } }
  if (g.process && g.process.env && g.process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[DataGrid] DetailPanel is coming in v1.1 and is currently a no-op.')
  }
  return null
}
;(DetailPanel as unknown as SlotMarker).__vlSlot = DETAIL_PANEL_TAG

function findSlot(children: ReactNode, tag: symbol): ReactElement | null {
  let found: ReactElement | null = null
  Children.forEach(children, (child) => {
    if (found) return
    if (!isValidElement(child)) return
    const type = child.type as unknown as SlotMarker | undefined
    if (type && type.__vlSlot === tag) {
      found = child
    }
  })
  return found
}

const PIN_SHADOW_L = '2px 0 6px -2px color-mix(in oklch, var(--fg) 20%, transparent)'
const PIN_SHADOW_R = '-2px 0 6px -2px color-mix(in oklch, var(--fg) 20%, transparent)'

export function DataGrid<Row extends object>(props: DataGridProps<Row>) {
  const {
    rows,
    columns,
    rowKey,
    getRowId,
    selectable = false,
    selectedIds,
    onSelectedIdsChange,
    sortKey,
    sortDir = null,
    onSortChange,
    sort,
    onSortChangeMulti,
    pageIndex = 0,
    pageSize = 25,
    onPageChange,
    totalRows,
    stickyHeader = true,
    density = 'cozy',
    emptyState,
    className,
    style,
    virtualize = false,
    onColumnResize,
    visibleColumnKeys,
    onVisibleColumnKeysChange,
    quickFilter,
    onQuickFilterChange,
    onCellEdit,
    rowStyle,
    onRowClick,
    children,
  } = props

  const resolveIdMaybe = rowKey ?? getRowId
  if (!resolveIdMaybe) {
    throw new Error('DataGrid: `rowKey` (or legacy `getRowId`) is required.')
  }
  const resolveId: (row: Row) => string = resolveIdMaybe

  const [focusIndex, setFocusIndex] = useState(0)
  // Uncontrolled visible-column keys fallback — initialised to all non-hidden columns.
  const [internalVisibleKeys, setInternalVisibleKeys] = useState<string[]>(() =>
    columns.filter((c) => !c.hidden).map((c) => c.key),
  )
  const effectiveVisibleKeys: string[] =
    visibleColumnKeys ?? internalVisibleKeys
  const setVisibleKeys = useCallback(
    (next: string[]) => {
      if (onVisibleColumnKeysChange) onVisibleColumnKeysChange(next)
      if (visibleColumnKeys === undefined) setInternalVisibleKeys(next)
    },
    [onVisibleColumnKeysChange, visibleColumnKeys],
  )
  const toggleVisibleKey = useCallback(
    (key: string) => {
      const cur = effectiveVisibleKeys
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]
      setVisibleKeys(next)
    },
    [effectiveVisibleKeys, setVisibleKeys],
  )
  const [internalSort, setInternalSort] = useState<MultiSortEntry[]>([])
  const [internalWidths, setInternalWidths] = useState<Record<string, number>>({})
  const [internalQuickFilter, setInternalQuickFilter] = useState('')
  const [debouncedQuickFilter, setDebouncedQuickFilter] = useState('')
  const [editing, setEditing] = useState<{ rowId: string; key: string } | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [hoverSortKey, setHoverSortKey] = useState<string | null>(null)
  const [resizeHoverKey, setResizeHoverKey] = useState<string | null>(null)
  const [activeResizeKey, setActiveResizeKey] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null)
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null)

  useEffect(() => {
    if (quickFilter !== undefined) return
    const t = setTimeout(() => setDebouncedQuickFilter(internalQuickFilter), 150)
    return () => clearTimeout(t)
  }, [internalQuickFilter, quickFilter])

  const visibleColumns = useMemo(() => {
    const visibleSet = new Set(effectiveVisibleKeys)
    const base = columns.filter((c) => {
      if (c.hidden) return false
      // Pinned columns always visible regardless of menu toggles.
      if (c.pin === 'left' || c.pin === 'right') return true
      return visibleSet.has(c.key)
    })
    const left = base.filter((c) => c.pin === 'left')
    const right = base.filter((c) => c.pin === 'right')
    const mid = base.filter((c) => c.pin !== 'left' && c.pin !== 'right')
    return [...left, ...mid, ...right]
  }, [columns, effectiveVisibleKeys])

  const effectiveSort: MultiSortEntry[] = useMemo(() => {
    if (sort && sort.length > 0) return sort
    if (sortKey && sortDir) return [{ key: sortKey, dir: sortDir }]
    return internalSort
  }, [sort, sortKey, sortDir, internalSort])

  const activeQuickFilter = quickFilter !== undefined ? quickFilter : debouncedQuickFilter

  const processedRows = useMemo(() => {
    let out = rows
    const q = activeQuickFilter.trim().toLowerCase()
    if (q) {
      out = out.filter((row) => {
        for (const col of columns) {
          const v = (row as Record<string, unknown>)[col.key]
          if (stringifyCell(v).toLowerCase().includes(q)) return true
        }
        return false
      })
    }
    const localSortActive =
      effectiveSort.length > 0 && (sort !== undefined || !onSortChange || effectiveSort.length > 1)
    if (localSortActive && effectiveSort.length > 0) {
      const sorts = effectiveSort
      out = [...out].sort((a, b) => {
        for (const s of sorts) {
          const av = (a as Record<string, unknown>)[s.key]
          const bv = (b as Record<string, unknown>)[s.key]
          let cmp = 0
          if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
          else cmp = stringifyCell(av).localeCompare(stringifyCell(bv))
          if (cmp !== 0) return s.dir === 'asc' ? cmp : -cmp
        }
        return 0
      })
    }
    return out
  }, [rows, columns, activeQuickFilter, effectiveSort, sort, onSortChange])

  const effectiveTotal = totalRows ?? processedRows.length
  const pageCount = Math.max(1, Math.ceil(effectiveTotal / pageSize))
  const start = pageIndex * pageSize
  const windowRows =
    totalRows == null && !virtualize ? processedRows.slice(start, start + pageSize) : processedRows

  const rowHeight = rowHeightMap[density]
  const headerHeight = headerHeightMap[density]
  const bodyFont = bodyFontMap[density]
  const virtualizer = useVirtualizer({
    count: virtualize ? windowRows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  })

  const selected = selectedIds ?? new Set<string>()
  const allSelected =
    windowRows.length > 0 && windowRows.every((r) => selected.has(resolveId(r)))
  const someSelected =
    !allSelected && windowRows.some((r) => selected.has(resolveId(r)))

  const toggleRow = useCallback(
    (id: string) => {
      if (!onSelectedIdsChange) return
      const next = new Set(selected)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      onSelectedIdsChange(next)
    },
    [selected, onSelectedIdsChange],
  )

  const toggleAll = useCallback(() => {
    if (!onSelectedIdsChange) return
    const next = new Set(selected)
    if (allSelected) {
      windowRows.forEach((r) => next.delete(resolveId(r)))
    } else {
      windowRows.forEach((r) => next.add(resolveId(r)))
    }
    onSelectedIdsChange(next)
  }, [selected, onSelectedIdsChange, allSelected, windowRows, resolveId])

  const handleHeaderClick = useCallback(
    (key: string, shift: boolean) => {
      if (shift) {
        const current = effectiveSort
        const idx = current.findIndex((e) => e.key === key)
        let nextStack: MultiSortEntry[]
        if (idx === -1) {
          nextStack = [...current, { key, dir: 'asc' }]
        } else {
          const entry = current[idx]
          if (entry.dir === 'asc') {
            nextStack = current.map((e, i) => (i === idx ? { key, dir: 'desc' as const } : e))
          } else {
            nextStack = current.filter((_, i) => i !== idx)
          }
        }
        if (onSortChangeMulti) onSortChangeMulti(nextStack)
        else setInternalSort(nextStack)
        return
      }
      if (onSortChange) {
        const dir = key === sortKey ? nextSortDir(sortDir) : 'asc'
        onSortChange(key, dir)
        return
      }
      const current = effectiveSort[0]
      let nextStack: MultiSortEntry[]
      if (!current || current.key !== key) nextStack = [{ key, dir: 'asc' }]
      else if (current.dir === 'asc') nextStack = [{ key, dir: 'desc' }]
      else nextStack = []
      if (onSortChangeMulti) onSortChangeMulti(nextStack)
      else setInternalSort(nextStack)
    },
    [effectiveSort, onSortChange, onSortChangeMulti, sortKey, sortDir],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableSectionElement>) => {
      if (windowRows.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusIndex((i) => Math.min(windowRows.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusIndex((i) => Math.max(0, i - 1))
      } else if (e.key === ' ' && selectable) {
        e.preventDefault()
        const row = windowRows[focusIndex]
        if (row) toggleRow(resolveId(row))
      }
    },
    [windowRows, focusIndex, selectable, toggleRow, resolveId],
  )

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const r = resizingRef.current
      if (!r) return
      const col = columns.find((c) => c.key === r.key)
      const minW = col?.minWidth ?? 40
      const next = Math.max(minW, r.startWidth + (e.clientX - r.startX))
      if (onColumnResize) onColumnResize(r.key, next)
      else setInternalWidths((w) => ({ ...w, [r.key]: next }))
    }
    function onUp() {
      resizingRef.current = null
      setActiveResizeKey(null)
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [columns, onColumnResize])

  const startResize = useCallback(
    (key: string, e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const currentWidth =
        internalWidths[key] ??
        (typeof columns.find((c) => c.key === key)?.width === 'number'
          ? (columns.find((c) => c.key === key)?.width as number)
          : 150)
      resizingRef.current = { key, startX: e.clientX, startWidth: currentWidth }
      setActiveResizeKey(key)
      if (typeof document !== 'undefined') document.body.style.userSelect = 'none'
    },
    [internalWidths, columns],
  )

  const colWidthMap = useMemo(() => {
    const m: Record<string, number> = {}
    for (const c of visibleColumns) {
      const w =
        internalWidths[c.key] ?? (typeof c.width === 'number' ? (c.width as number) : undefined)
      if (w !== undefined) m[c.key] = w
    }
    return m
  }, [visibleColumns, internalWidths])

  const lastLeftPinIdx = useMemo(() => {
    let last = -1
    for (let i = 0; i < visibleColumns.length; i++) if (visibleColumns[i].pin === 'left') last = i
    return last
  }, [visibleColumns])

  const firstRightPinIdx = useMemo(() => {
    for (let i = 0; i < visibleColumns.length; i++) {
      if (visibleColumns[i].pin === 'right') return i
    }
    return -1
  }, [visibleColumns])

  function getPinStyle(colIdx: number, isHeader: boolean): CSSProperties {
    const col = visibleColumns[colIdx]
    if (!col || !col.pin) return {}
    const bg = isHeader ? 'var(--bg-1)' : 'var(--vl-datagrid-row-bg, var(--bg-1))'
    if (col.pin === 'left') {
      let left = selectable ? SELECT_COL_WIDTH : 0
      for (let i = 0; i < colIdx; i++) {
        const prev = visibleColumns[i]
        if (prev.pin !== 'left') break
        left += colWidthMap[prev.key] ?? 150
      }
      return {
        position: 'sticky',
        left,
        zIndex: isHeader ? 3 : 2,
        background: bg,
        boxShadow: colIdx === lastLeftPinIdx ? PIN_SHADOW_L : undefined,
      }
    }
    let right = 0
    for (let i = visibleColumns.length - 1; i > colIdx; i--) {
      const nxt = visibleColumns[i]
      if (nxt.pin !== 'right') break
      right += colWidthMap[nxt.key] ?? 150
    }
    return {
      position: 'sticky',
      right,
      zIndex: isHeader ? 3 : 2,
      background: bg,
      boxShadow: colIdx === firstRightPinIdx ? PIN_SHADOW_R : undefined,
    }
  }

  const beginEdit = useCallback(
    (rowId: string, col: ColumnDef<Row>, row: Row) => {
      if (!col.editable) return
      const raw = (row as Record<string, unknown>)[col.key]
      setEditValue(stringifyCell(raw))
      setEditing({ rowId, key: col.key })
    },
    [],
  )

  const commitEdit = useCallback(
    (row: Row, col: ColumnDef<Row>) => {
      if (!editing) return
      const editor = col.editor ?? 'text'
      let value: string | number = editValue
      if (editor === 'number') {
        const n = Number(editValue)
        value = Number.isFinite(n) ? n : 0
      }
      onCellEdit?.(row, col.key, value)
      setEditing(null)
    },
    [editing, editValue, onCellEdit],
  )

  const cancelEdit = useCallback(() => setEditing(null), [])

  const headerCellStyle: CSSProperties = {
    padding: headerPadMap[density], height: headerHeight, textAlign: 'start',
    position: stickyHeader ? 'sticky' : undefined, top: stickyHeader ? 0 : undefined,
    background: 'var(--bg-1)', zIndex: stickyHeader ? 1 : undefined,
    fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)',
    borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap', verticalAlign: 'middle',
  }

  const bodyCellStyle: CSSProperties = {
    padding: padMap[density], height: rowHeight, verticalAlign: 'middle',
    fontSize: bodyFont, color: 'var(--fg)',
  }

  const totalCols = visibleColumns.length + (selectable ? 1 : 0)

  const toolbarSlot = findSlot(children, TOOLBAR_TAG)
  const paginationSlot = findSlot(children, PAGINATION_TAG)
  const toolbarHasChildren =
    toolbarSlot != null && (toolbarSlot.props as ToolbarProps).children != null

  const toolbarQuickFilter = toolbarSlot != null ? (
    <Input
      key="quick-filter" size="sm" type="search" placeholder="Search…"
      prefix={<span aria-hidden style={{ fontSize: 13 }}>⌕</span>}
      value={quickFilter !== undefined ? quickFilter : internalQuickFilter}
      onChange={(e) => {
        const v = (e.target as HTMLInputElement).value
        if (quickFilter !== undefined) onQuickFilterChange?.(v)
        else { setInternalQuickFilter(v); onQuickFilterChange?.(v) }
      }}
      data-vl-datagrid-quickfilter="" style={{ width: 230 }}
    />
  ) : null

  function renderRow(row: Row, i: number): ReactNode {
    const id = resolveId(row)
    const isSelected = selected.has(id)
    const rowBg = isSelected ? 'var(--ac-soft)' : 'transparent'
    return (
      <tr
        key={id}
        tabIndex={i === focusIndex ? 0 : -1}
        data-selected={isSelected ? '' : undefined}
        aria-selected={isSelected || undefined}
        onFocus={() => setFocusIndex(i)}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        style={{
          background: rowBg,
          borderBottom: '1px solid var(--line)',
          cursor: onRowClick ? 'pointer' : undefined,
          ['--vl-datagrid-row-bg' as string]: rowBg,
          ...(rowStyle?.(row) ?? null),
        } as CSSProperties}
      >
        {selectable ? (
          <td
            style={{
              ...bodyCellStyle, padding: 0, textAlign: 'center',
              position: 'sticky', left: 0, zIndex: 1,
              background: rowBg === 'transparent' ? 'var(--bg-1)' : rowBg,
              width: SELECT_COL_WIDTH,
            }}
          >
            <Checkbox checked={isSelected} onCheckedChange={() => toggleRow(id)} aria-label={`Select row ${id}`} />
          </td>
        ) : null}
        {visibleColumns.map((col, colIdx) => {
          const align = col.align ? alignMap[col.align] : undefined
          const w = internalWidths[col.key] ?? col.width
          const isEditing = editing && editing.rowId === id && editing.key === col.key
          const rawValue = (row as Record<string, unknown>)[col.key]
          const value = col.render ? col.render(row, start + i) : (rawValue as ReactNode)
          const pinStyle = getPinStyle(colIdx, false)
          const cellStyle: CSSProperties = {
            ...bodyCellStyle,
            textAlign: align,
            width: w,
            ...pinStyle,
          }
          if (isEditing) {
            cellStyle.padding = 0
            cellStyle.boxShadow = `inset 0 0 0 2px var(--ac)${pinStyle.boxShadow ? ', ' + pinStyle.boxShadow : ''}`
          }
          return (
            <td
              key={col.key}
              style={cellStyle}
              onDoubleClick={() => beginEdit(id, col, row)}
              onKeyDown={(e) => {
                if (col.editable && e.key === 'Enter' && !isEditing) {
                  e.preventDefault()
                  beginEdit(id, col, row)
                }
              }}
              tabIndex={col.editable ? 0 : undefined}
            >
              {isEditing ? (
                col.editor === 'select' ? (
                  <select
                    autoFocus
                    data-vl-datagrid-editor=""
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(row, col)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(row, col); else if (e.key === 'Escape') cancelEdit() }}
                    style={{ width: '100%', height: '100%', padding: padMap[density], border: 'none', outline: 'none', background: 'transparent', font: 'inherit', color: 'inherit' }}
                  >
                    {(col.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    autoFocus
                    data-vl-datagrid-editor=""
                    type={col.editor === 'number' ? 'number' : 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(row, col)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); commitEdit(row, col) }
                      else if (e.key === 'Escape') { e.preventDefault(); cancelEdit() }
                    }}
                    style={{ width: '100%', height: '100%', padding: padMap[density], border: 'none', outline: 'none', background: 'transparent', font: 'inherit', color: 'inherit', textAlign: align }}
                  />
                )
              ) : (
                (value as ReactNode)
              )}
            </td>
          )
        })}
      </tr>
    )
  }

  const virtualItems = virtualize ? virtualizer.getVirtualItems() : []
  const totalSize = virtualize ? virtualizer.getTotalSize() : 0

  const rootStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column',
    border: '1px solid var(--line)', borderRadius: 10,
    background: 'var(--bg-1)', overflow: 'hidden',
    fontFamily: 'var(--font-sans)', color: 'var(--fg)', ...style,
  }

  const columnMenuCtxValue: ColumnMenuCtxValue = {
    columns: columns as unknown as ColumnDef<object>[],
    visibleKeys: effectiveVisibleKeys,
    toggleKey: toggleVisibleKey,
  }

  return (
    <ColumnMenuCtx.Provider value={columnMenuCtxValue}>
    <div
      data-vl-datagrid=""
      data-density={density}
      className={cx('vl-datagrid', className)}
      style={rootStyle}
    >
      {toolbarSlot ? (
        <Fragment>
          <Toolbar {...((toolbarSlot.props as ToolbarProps) ?? {})}>
            {toolbarHasChildren ? (
              <>
                {toolbarQuickFilter}
                {(toolbarSlot.props as ToolbarProps).children}
              </>
            ) : (
              <>
                {toolbarQuickFilter}
                <div style={{ flex: 1 }} />
                <ColumnMenu />
              </>
            )}
          </Toolbar>
        </Fragment>
      ) : null}

      <div
        data-vl-datagrid-scroll=""
        ref={scrollRef}
        style={virtualize ? { maxHeight: 400, overflow: 'auto', position: 'relative' } : { overflow: 'auto' }}
      >
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ height: headerHeight }}>
              {selectable ? (
                <th
                  style={{
                    ...headerCellStyle,
                    width: SELECT_COL_WIDTH,
                    padding: 0,
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                  }}
                  scope="col"
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all rows"
                  />
                </th>
              ) : null}
              {visibleColumns.map((col, colIdx) => {
                const sortEntry = effectiveSort.find((s) => s.key === col.key)
                const isSorted = !!sortEntry
                const glyph = sortEntry?.dir === 'desc' ? '▼' : '▲'
                const sortIdx = effectiveSort.findIndex((s) => s.key === col.key)
                const align = col.align ? alignMap[col.align] : 'start'
                const w = internalWidths[col.key] ?? col.width
                const pinStyle = getPinStyle(colIdx, true)
                const sortColor = isSorted ? 'var(--ac)' : hoverSortKey === col.key ? 'var(--fg-2)' : 'var(--fg-3)'
                const resizeOn = activeResizeKey === col.key || resizeHoverKey === col.key
                const justify = align === 'end' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{
                      ...headerCellStyle, textAlign: align, width: w, ...pinStyle,
                      ...(pinStyle.position === 'sticky' ? { zIndex: 3 } : null),
                      position: pinStyle.position ?? headerCellStyle.position,
                    }}
                    aria-sort={isSorted ? (sortEntry!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: justify, position: 'relative', height: '100%' }}>
                      {col.sortable ? (
                        <button
                          type="button" data-vl-datagrid-sort=""
                          onClick={(e) => handleHeaderClick(col.key, e.shiftKey)}
                          onMouseEnter={() => setHoverSortKey(col.key)}
                          onMouseLeave={() => setHoverSortKey(null)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            background: 'none', border: 0, padding: 0, margin: 0, font: 'inherit',
                            color: isSorted ? 'var(--fg)' : 'inherit',
                            letterSpacing: 'inherit', textTransform: 'inherit', cursor: 'pointer',
                          }}
                        >
                          <span>{col.header}</span>
                          <span aria-hidden style={{ fontSize: 9, color: sortColor, transition: 'color 120ms', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                            {glyph}
                            {isSorted && effectiveSort.length > 1 ? <sup style={{ fontSize: 8, color: 'var(--ac)' }}>{sortIdx + 1}</sup> : null}
                          </span>
                        </button>
                      ) : (<span>{col.header}</span>)}
                      {col.resizable ? (
                        <div
                          data-vl-datagrid-resizer="" role="separator" aria-orientation="vertical"
                          onMouseDown={(e) => startResize(col.key, e)}
                          onMouseEnter={() => setResizeHoverKey(col.key)}
                          onMouseLeave={() => setResizeHoverKey(null)}
                          style={{ position: 'absolute', top: 0, right: -2, width: 4, height: '100%', cursor: 'col-resize', userSelect: 'none', background: 'transparent' }}
                        >
                          <div aria-hidden style={{ position: 'absolute', top: 0, left: 1, width: 2, height: '100%', background: resizeOn ? 'var(--ac)' : 'transparent', transition: 'background 120ms' }} />
                        </div>
                      ) : null}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody ref={tbodyRef} onKeyDown={handleKeyDown}>
            {windowRows.length === 0 ? (
              <tr>
                <td colSpan={totalCols}>
                  <div data-vl-datagrid-empty="" style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
                    {emptyState ?? 'No results'}
                  </div>
                </td>
              </tr>
            ) : virtualize ? (
              <>
                {virtualItems.length > 0 && virtualItems[0].start > 0 ? (
                  <tr aria-hidden style={{ height: virtualItems[0].start }}>
                    <td colSpan={totalCols} />
                  </tr>
                ) : null}
                {virtualItems.map((vi) => {
                  const row = windowRows[vi.index]
                  if (!row) return null
                  return renderRow(row, vi.index)
                })}
                {virtualItems.length > 0 &&
                virtualItems[virtualItems.length - 1].end < totalSize ? (
                  <tr
                    aria-hidden
                    style={{
                      height: totalSize - virtualItems[virtualItems.length - 1].end,
                    }}
                  >
                    <td colSpan={totalCols} />
                  </tr>
                ) : null}
              </>
            ) : (
              windowRows.map((row, i) => renderRow(row, i))
            )}
          </tbody>
        </table>
      </div>

      {paginationSlot ? (
        <PaginationFooter {...(paginationSlot.props as PaginationSlotProps)} />
      ) : onPageChange || pageCount > 1 ? (
        <PaginationFooter
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={effectiveTotal}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
    </ColumnMenuCtx.Provider>
  )
}

// Attach compound children
DataGrid.Toolbar = Toolbar
DataGrid.Pagination = PaginationFooter
DataGrid.Column = ColumnPlaceholder
DataGrid.DetailPanel = DetailPanel
DataGrid.ColumnMenu = ColumnMenu

// Silence unused tag constant
void COLUMN_MENU_TAG

// Silence unused helpers that TS might flag
void padMap
