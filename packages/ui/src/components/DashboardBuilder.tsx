import {
  useMemo, useState, useId, useRef, type ReactNode, type CSSProperties, type DragEvent,
} from 'react'
import { cx } from '../utils/cx'
import { AreaChart } from './charts/AreaChart'
import { LineChart } from './charts/LineChart'
import { BarChart } from './charts/BarChart'
import { PieChart } from './charts/PieChart'
import { GaugeChart } from './charts/GaugeChart'
import { SparklineChart } from './charts/SparklineChart'
import { Progress } from './Progress'
import { Badge } from './Badge'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Table } from './Table'
import { Input } from './Input'
import { Select } from './Select'
import { Switch } from './Switch'
import { Checkbox } from './Checkbox'
import { Textarea } from './Textarea'
import { Card } from './Card'
import { Slider } from './Slider'

// =============================================================================
// DashboardBuilder — visual drag-and-drop assembler for Veloce components.
//
// Usage:
//   import { DashboardBuilder } from 'veloce-ui'
//   <DashboardBuilder /> // full editor with default seed
//   <DashboardBuilder initialRows={...} onChange={(rows) => ...} />
// =============================================================================

export type DashboardBuilderWidgetKind =
  | 'stat' | 'heading' | 'divider' | 'spacer' | 'text'
  | 'area' | 'line' | 'bar' | 'pie' | 'gauge' | 'spark'
  | 'progress' | 'badge' | 'avatar' | 'button' | 'table'
  | 'input' | 'select' | 'switch' | 'checkbox' | 'textarea' | 'card' | 'slider'

export interface DashboardBuilderWidget {
  id: string
  kind: DashboardBuilderWidgetKind
  span: number // 1..12 grid columns
  props: Record<string, unknown>
}

export interface DashboardBuilderRow {
  id: string
  title?: string
  widgets: DashboardBuilderWidget[]
}

export interface DashboardBuilderProps {
  /** Initial canvas contents. If omitted, ships with a 2-row demo. */
  initialRows?: DashboardBuilderRow[]
  /** Fired every time the canvas state changes. */
  onChange?: (rows: DashboardBuilderRow[]) => void
  /** Hide the top toolbar entirely. */
  hideToolbar?: boolean
  className?: string
  style?: CSSProperties
}

interface PaletteItem {
  kind: DashboardBuilderWidgetKind
  label: string
  icon: string
  category: 'Metric' | 'Chart' | 'Data' | 'Form' | 'Layout'
  defaults: Omit<DashboardBuilderWidget, 'id'>
}

const SAMPLE_SERIES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, i) => ({
  label, value: Math.round(40 + Math.sin(i * 0.6) * 20 + i * 3)
}))
const SAMPLE_PIE = [
  { label: 'A', value: 42 }, { label: 'B', value: 28 }, { label: 'C', value: 18 }, { label: 'D', value: 12 },
]
const SAMPLE_TABLE = [
  { id: 1, name: 'Project Nova',   status: 'live',     users: 1240 },
  { id: 2, name: 'Project Atlas',  status: 'beta',     users: 324 },
  { id: 3, name: 'Project Zephyr', status: 'planning', users: 0 },
]
const SELECT_OPTIONS = [
  { value: 'option-1', label: 'Option one' },
  { value: 'option-2', label: 'Option two' },
  { value: 'option-3', label: 'Option three' },
]

const PALETTE: PaletteItem[] = [
  // Metric
  { kind: 'stat',     label: 'Stat card',  icon: '▦', category: 'Metric', defaults: { kind: 'stat', span: 3, props: { label: 'Revenue', value: '$142k', delta: '+12%', deltaDir: 'up' } } },
  // Chart
  { kind: 'area',     label: 'Area chart', icon: '▲', category: 'Chart',  defaults: { kind: 'area',  span: 8, props: { height: 220 } } },
  { kind: 'line',     label: 'Line chart', icon: '╱', category: 'Chart',  defaults: { kind: 'line',  span: 8, props: { height: 220 } } },
  { kind: 'bar',      label: 'Bar chart',  icon: '▎', category: 'Chart',  defaults: { kind: 'bar',   span: 6, props: { height: 220 } } },
  { kind: 'pie',      label: 'Pie chart',  icon: '◔', category: 'Chart',  defaults: { kind: 'pie',   span: 4, props: { size: 220 } } },
  { kind: 'gauge',    label: 'Gauge',      icon: '◕', category: 'Chart',  defaults: { kind: 'gauge', span: 4, props: { value: 72, size: 220, label: '72', sublabel: 'score' } } },
  { kind: 'spark',    label: 'Sparkline',  icon: '〰', category: 'Chart',  defaults: { kind: 'spark', span: 3, props: { height: 48 } } },
  // Data
  { kind: 'progress', label: 'Progress',   icon: '━', category: 'Data',   defaults: { kind: 'progress', span: 6, props: { value: 64, label: 'Deploy progress' } } },
  { kind: 'badge',    label: 'Badge',      icon: '●', category: 'Data',   defaults: { kind: 'badge',    span: 3, props: { text: 'Live', tone: 'ok' } } },
  { kind: 'avatar',   label: 'Avatar',     icon: '◉', category: 'Data',   defaults: { kind: 'avatar',   span: 3, props: { name: 'Ada Lovelace' } } },
  { kind: 'button',   label: 'Button',     icon: '▭', category: 'Data',   defaults: { kind: 'button',   span: 3, props: { text: 'Click me', variant: 'primary' } } },
  { kind: 'table',    label: 'Table',      icon: '▦', category: 'Data',   defaults: { kind: 'table',    span: 12, props: {} } },
  { kind: 'card',     label: 'Card',       icon: '▢', category: 'Data',   defaults: { kind: 'card',     span: 6, props: { title: 'Card title', body: 'Short description of what this card is about.' } } },
  // Form
  { kind: 'input',    label: 'Input',      icon: '┃', category: 'Form',   defaults: { kind: 'input',    span: 4, props: { placeholder: 'Enter text…', label: 'Email' } } },
  { kind: 'textarea', label: 'Textarea',   icon: '¶', category: 'Form',   defaults: { kind: 'textarea', span: 6, props: { placeholder: 'Say something…', rows: 3, label: 'Message' } } },
  { kind: 'select',   label: 'Select',     icon: '▾', category: 'Form',   defaults: { kind: 'select',   span: 4, props: { label: 'Choose' } } },
  { kind: 'checkbox', label: 'Checkbox',   icon: '☑', category: 'Form',   defaults: { kind: 'checkbox', span: 4, props: { label: 'I agree to the terms' } } },
  { kind: 'switch',   label: 'Switch',     icon: '◉', category: 'Form',   defaults: { kind: 'switch',   span: 4, props: { label: 'Enable notifications' } } },
  { kind: 'slider',   label: 'Slider',     icon: '━', category: 'Form',   defaults: { kind: 'slider',   span: 4, props: { value: 50, label: 'Volume' } } },
  // Layout
  { kind: 'heading',  label: 'Heading',    icon: 'H', category: 'Layout', defaults: { kind: 'heading',  span: 12, props: { text: 'Section heading', size: 'lg' } } },
  { kind: 'text',     label: 'Text',       icon: '¶', category: 'Layout', defaults: { kind: 'text',     span: 12, props: { text: 'Add paragraph text here. Click to edit on the right.' } } },
  { kind: 'divider',  label: 'Divider',    icon: '━', category: 'Layout', defaults: { kind: 'divider',  span: 12, props: {} } },
  { kind: 'spacer',   label: 'Spacer',     icon: '⇅', category: 'Layout', defaults: { kind: 'spacer',   span: 12, props: { height: 24 } } },
]

const PALETTE_CATEGORIES: PaletteItem['category'][] = ['Metric', 'Chart', 'Data', 'Form', 'Layout']

const DEFAULT_INITIAL: DashboardBuilderRow[] = [
  {
    id: 'r1', title: 'Overview',
    widgets: [
      { id: 'w1', kind: 'stat', span: 3, props: { label: 'Revenue',       value: '$142k', delta: '+12%',   deltaDir: 'up' } },
      { id: 'w2', kind: 'stat', span: 3, props: { label: 'Active users',  value: '8,420', delta: '+3.2%',  deltaDir: 'up' } },
      { id: 'w3', kind: 'stat', span: 3, props: { label: 'Churn',         value: '1.4%',  delta: '-0.2pp', deltaDir: 'up' } },
      { id: 'w4', kind: 'stat', span: 3, props: { label: 'NPS',           value: '68',    delta: '+4',     deltaDir: 'up' } },
    ],
  },
  {
    id: 'r2', title: 'Performance',
    widgets: [
      { id: 'w5', kind: 'area',  span: 8, props: { height: 220 } },
      { id: 'w6', kind: 'gauge', span: 4, props: { value: 72, size: 200, label: '72', sublabel: 'score' } },
    ],
  },
]

const MIME_WIDGET_KIND = 'application/x-vl-widget-kind'
const MIME_WIDGET_MOVE = 'application/x-vl-widget-move'

// =============================================================================

export function DashboardBuilder({ initialRows, onChange, hideToolbar, className, style }: DashboardBuilderProps = {}) {
  const uid = useId().replace(/:/g, '')
  const [rows, setRowsState] = useState<DashboardBuilderRow[]>(initialRows ?? DEFAULT_INITIAL)
  const [selectedId, setSelectedId] = useState<string | null>('w5')
  const [showCode, setShowCode] = useState(false)
  const [dragKind, setDragKind] = useState<DashboardBuilderWidgetKind | null>(null)
  const [dragMoveId, setDragMoveId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null) // rowId being hovered

  function setRows(next: DashboardBuilderRow[]) {
    setRowsState(next)
    onChange?.(next)
  }

  // Persist across renders so every added widget/row gets a unique id.
  const widgetSeq = useRef(100)
  const rowSeq = useRef(100)
  const nextWidgetId = () => `${uid}-w${++widgetSeq.current}`
  const nextRowId = () => `${uid}-r${++rowSeq.current}`

  const selected = useMemo(() => {
    for (const r of rows) for (const w of r.widgets) if (w.id === selectedId) return { row: r, widget: w }
    return null
  }, [rows, selectedId])

  function updateWidget(id: string, next: Partial<DashboardBuilderWidget>) {
    setRows(rows.map((r) => ({
      ...r,
      widgets: r.widgets.map((w) => w.id === id ? { ...w, ...next, props: next.props ? { ...w.props, ...next.props } : w.props } : w),
    })))
  }

  function updateRow(id: string, next: Partial<DashboardBuilderRow>) {
    setRows(rows.map((r) => r.id === id ? { ...r, ...next } : r))
  }

  function deleteWidget(id: string) {
    setRows(rows
      .map((r) => ({ ...r, widgets: r.widgets.filter((w) => w.id !== id) }))
      .filter((r) => r.widgets.length > 0))
    if (selectedId === id) setSelectedId(null)
  }

  function deleteRow(rowId: string) {
    setRows(rows.filter((r) => r.id !== rowId))
  }

  function appendWidgetToRow(rowId: string, kind: DashboardBuilderWidgetKind) {
    const def = PALETTE.find((p) => p.kind === kind)
    if (!def) return
    const newWidget: DashboardBuilderWidget = { ...def.defaults, id: nextWidgetId() }
    setRows(rows.map((r) => r.id === rowId ? { ...r, widgets: [...r.widgets, newWidget] } : r))
    setSelectedId(newWidget.id)
  }

  function addNewRowWithKind(kind: DashboardBuilderWidgetKind) {
    const def = PALETTE.find((p) => p.kind === kind)
    if (!def) return
    const newWidget: DashboardBuilderWidget = { ...def.defaults, id: nextWidgetId() }
    const newRow: DashboardBuilderRow = { id: nextRowId(), widgets: [newWidget] }
    setRows([...rows, newRow])
    setSelectedId(newWidget.id)
  }

  function moveWidgetToRow(widgetId: string, targetRowId: string, insertBeforeIndex?: number) {
    let moving: DashboardBuilderWidget | null = null
    let sourceRowId: string | null = null
    for (const r of rows) {
      for (const w of r.widgets) if (w.id === widgetId) { moving = w; sourceRowId = r.id }
    }
    if (!moving || !sourceRowId) return

    // If dropping into the same spot, no-op
    const next: DashboardBuilderRow[] = rows
      .map((r) => ({ ...r, widgets: r.widgets.filter((w) => w.id !== widgetId) }))
      .map((r) => {
        if (r.id !== targetRowId) return r
        const copy = [...r.widgets]
        const at = insertBeforeIndex == null ? copy.length : Math.min(insertBeforeIndex, copy.length)
        copy.splice(at, 0, moving as DashboardBuilderWidget)
        return { ...r, widgets: copy }
      })
      .filter((r) => r.widgets.length > 0 || r.id === targetRowId)
    setRows(next)
  }

  function moveWidgetToNewRow(widgetId: string) {
    let moving: DashboardBuilderWidget | null = null
    for (const r of rows) for (const w of r.widgets) if (w.id === widgetId) moving = w
    if (!moving) return
    const next: DashboardBuilderRow[] = rows
      .map((r) => ({ ...r, widgets: r.widgets.filter((w) => w.id !== widgetId) }))
      .filter((r) => r.widgets.length > 0)
    next.push({ id: nextRowId(), widgets: [moving] })
    setRows(next)
  }

  function clearCanvas() {
    if (typeof window !== 'undefined' && !window.confirm('Clear the entire canvas?')) return
    setRows([])
    setSelectedId(null)
  }

  // ---- DnD handlers ----------------------------------------------------------

  function handlePaletteDragStart(kind: DashboardBuilderWidgetKind) {
    return (e: DragEvent) => {
      e.dataTransfer.setData(MIME_WIDGET_KIND, kind)
      e.dataTransfer.effectAllowed = 'copy'
      setDragKind(kind)
    }
  }

  function handleWidgetDragStart(widgetId: string) {
    return (e: DragEvent) => {
      e.stopPropagation()
      e.dataTransfer.setData(MIME_WIDGET_MOVE, widgetId)
      e.dataTransfer.effectAllowed = 'move'
      setDragMoveId(widgetId)
    }
  }

  function handleDragEnd() {
    setDragKind(null)
    setDragMoveId(null)
    setDropTarget(null)
  }

  function handleRowDragOver(rowId: string) {
    return (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = dragMoveId ? 'move' : 'copy'
      setDropTarget(rowId)
    }
  }

  function handleRowDrop(rowId: string) {
    return (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const moveId = e.dataTransfer.getData(MIME_WIDGET_MOVE)
      const newKind = e.dataTransfer.getData(MIME_WIDGET_KIND) as DashboardBuilderWidgetKind | ''
      if (moveId) {
        moveWidgetToRow(moveId, rowId)
      } else if (newKind) {
        appendWidgetToRow(rowId, newKind)
      }
      handleDragEnd()
    }
  }

  function handleWidgetDrop(targetRowId: string, targetWidgetId: string) {
    return (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const moveId = e.dataTransfer.getData(MIME_WIDGET_MOVE)
      const newKind = e.dataTransfer.getData(MIME_WIDGET_KIND) as DashboardBuilderWidgetKind | ''
      const row = rows.find((r) => r.id === targetRowId)
      if (!row) return
      const targetIndex = row.widgets.findIndex((w) => w.id === targetWidgetId)
      if (moveId && moveId !== targetWidgetId) {
        moveWidgetToRow(moveId, targetRowId, targetIndex)
      } else if (newKind) {
        // Insert new widget before target
        const def = PALETTE.find((p) => p.kind === newKind)
        if (def) {
          const newWidget: DashboardBuilderWidget = { ...def.defaults, id: nextWidgetId() }
          setRows(rows.map((r) => r.id === targetRowId
            ? { ...r, widgets: [...r.widgets.slice(0, targetIndex), newWidget, ...r.widgets.slice(targetIndex)] }
            : r))
          setSelectedId(newWidget.id)
        }
      }
      handleDragEnd()
    }
  }

  function handleNewRowDrop(e: DragEvent) {
    e.preventDefault()
    const moveId = e.dataTransfer.getData(MIME_WIDGET_MOVE)
    const newKind = e.dataTransfer.getData(MIME_WIDGET_KIND) as DashboardBuilderWidgetKind | ''
    if (moveId) moveWidgetToNewRow(moveId)
    else if (newKind) addNewRowWithKind(newKind)
    handleDragEnd()
  }

  const code = useMemo(() => generateJsx(rows), [rows])

  return (
    <div
      data-vl-dashboard-builder=""
      className={cx('vl-dashboard-builder', className)}
      style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', minHeight: 600, ...style }}
    >
      {!hideToolbar && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', background: 'var(--bg-1)' }}>
          <div style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
            Drag from the left · click to edit · drag any widget to re-order
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowCode((v) => !v)} style={toolbarBtn(showCode)}>{showCode ? '✕ Close code' : '{ } View code'}</button>
            <button onClick={clearCanvas} style={toolbarBtn(false)}>Clear</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: `240px 1fr 300px${showCode ? ' 440px' : ''}`, flex: 1, minHeight: 0, transition: 'grid-template-columns 180ms ease' }}>
        {/* === Palette === */}
        <aside style={{ borderRight: '1px solid var(--line)', background: 'var(--bg-1)', overflowY: 'auto', padding: 14 }}>
          {PALETTE_CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{cat}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {PALETTE.filter((p) => p.category === cat).map((p) => (
                  <div
                    key={p.kind}
                    draggable
                    onDragStart={handlePaletteDragStart(p.kind)}
                    onDragEnd={handleDragEnd}
                    style={{
                      padding: '10px 8px', border: '1px solid var(--line)', borderRadius: 8,
                      background: dragKind === p.kind ? 'var(--bg-3)' : 'var(--bg)',
                      cursor: 'grab', display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 4, fontSize: 11, color: 'var(--fg-2)', textAlign: 'center',
                      transition: 'background 100ms, border-color 100ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ac-line)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)' }}
                  >
                    <span style={{ fontSize: 16, color: 'var(--ac)' }}>{p.icon}</span>
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding: 10, borderRadius: 8, background: 'var(--bg-2)', fontSize: 11.5, color: 'var(--fg-3)', lineHeight: 1.5 }}>
            Rows are sections — click the title to rename. Drag widgets between rows to re-order.
          </div>
        </aside>

        {/* === Canvas === */}
        <main style={{ overflow: 'auto', background: 'var(--bg)', padding: 24 }}>
          {rows.length === 0 && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleNewRowDrop}
              style={{ padding: 60, border: '2px dashed var(--line-2)', borderRadius: 12, textAlign: 'center', color: 'var(--fg-3)' }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>📥</div>
              <div style={{ fontSize: 14 }}>Drag any component from the left to get started.</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rows.map((row) => (
              <SectionRow
                key={row.id}
                row={row}
                dropTarget={dropTarget === row.id}
                isDragging={!!(dragKind || dragMoveId)}
                dragMoveId={dragMoveId}
                selectedId={selectedId}
                onTitleChange={(t) => updateRow(row.id, { title: t })}
                onDeleteRow={() => deleteRow(row.id)}
                onDragOver={handleRowDragOver(row.id)}
                onDragLeave={() => setDropTarget(null)}
                onDrop={handleRowDrop(row.id)}
                onWidgetDrop={(wid) => handleWidgetDrop(row.id, wid)}
                onWidgetDragStart={handleWidgetDragStart}
                onWidgetDragEnd={handleDragEnd}
                onWidgetSelect={setSelectedId}
                onWidgetDelete={deleteWidget}
              />
            ))}
            {rows.length > 0 && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleNewRowDrop}
                style={{
                  padding: 20, border: '2px dashed var(--line)', borderRadius: 10, textAlign: 'center', color: 'var(--fg-3)', fontSize: 12.5,
                  background: (dragKind || dragMoveId) ? 'color-mix(in oklch, var(--ac) 7%, transparent)' : 'transparent',
                  transition: 'background 100ms',
                }}
              >
                + Drop here to add a new row
              </div>
            )}
          </div>
        </main>

        {/* === Inspector === */}
        <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--bg-1)', padding: 16, overflowY: 'auto' }}>
          {selected ? (
            <Inspector
              widget={selected.widget}
              onChange={(next) => updateWidget(selected.widget.id, next)}
              onDelete={() => deleteWidget(selected.widget.id)}
            />
          ) : (
            <div style={{ fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.6 }}>
              Click a widget on the canvas to edit its properties here.
            </div>
          )}
        </aside>

        {/* === Code side panel === */}
        {showCode && (
          <aside style={{ borderLeft: '1px solid var(--line)', background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Generated JSX</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>Updates live. Paste into any Veloce project.</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(code).catch(() => {}) }}
                  style={toolbarBtn(false)}
                >Copy</button>
                <button onClick={() => setShowCode(false)} style={toolbarBtn(false)}>✕</button>
              </div>
            </div>
            <pre style={{ margin: 0, padding: 14, overflow: 'auto', flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11.5, lineHeight: 1.55, color: 'var(--fg-2)', whiteSpace: 'pre' }}>
              {code}
            </pre>
          </aside>
        )}
      </div>
    </div>
  )
}

const toolbarBtn = (active: boolean): CSSProperties => ({
  padding: '6px 12px', fontSize: 12.5, borderRadius: 7,
  border: `1px solid ${active ? 'var(--ac)' : 'var(--line-2)'}`,
  background: active ? 'color-mix(in oklch, var(--ac) 10%, transparent)' : 'var(--bg)',
  color: active ? 'var(--ac-text)' : 'var(--fg-2)',
  cursor: 'pointer', fontFamily: 'inherit',
})

// =============================================================================
// SectionRow
// =============================================================================

function SectionRow({
  row, dropTarget, isDragging, dragMoveId, selectedId,
  onTitleChange, onDeleteRow,
  onDragOver, onDragLeave, onDrop, onWidgetDrop,
  onWidgetDragStart, onWidgetDragEnd, onWidgetSelect, onWidgetDelete,
}: {
  row: DashboardBuilderRow
  dropTarget: boolean
  isDragging: boolean
  dragMoveId: string | null
  selectedId: string | null
  onTitleChange: (t: string) => void
  onDeleteRow: () => void
  onDragOver: (e: DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: DragEvent) => void
  onWidgetDrop: (targetWidgetId: string) => (e: DragEvent) => void
  onWidgetDragStart: (widgetId: string) => (e: DragEvent) => void
  onWidgetDragEnd: () => void
  onWidgetSelect: (id: string) => void
  onWidgetDelete: (id: string) => void
}) {
  const [editingTitle, setEditingTitle] = useState(false)
  const title = row.title ?? ''

  return (
    <section>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingInline: 2 }}>
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditingTitle(false) }}
            placeholder="Section title"
            style={{
              fontSize: 13, fontWeight: 600, color: 'var(--fg)', background: 'transparent',
              border: '1px solid var(--line-2)', borderRadius: 6, padding: '4px 8px',
              fontFamily: 'inherit', outline: 'none', minWidth: 180,
            }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            style={{
              background: 'transparent', border: 'none', padding: '2px 6px', borderRadius: 5,
              fontSize: 12.5, fontWeight: 500, color: title ? 'var(--fg-2)' : 'var(--fg-3)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            title="Click to rename section"
          >
            {title || '＋ add section title'}
          </button>
        )}
        <button
          onClick={onDeleteRow}
          style={{
            fontSize: 11, color: 'var(--fg-3)', background: 'transparent', border: 'none',
            cursor: 'pointer', padding: '2px 6px', fontFamily: 'inherit',
          }}
          title="Delete row"
        >Remove row</button>
      </div>

      {/* Drop area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12,
          padding: 12, border: `1px dashed ${dropTarget ? 'var(--ac)' : 'var(--line)'}`,
          borderRadius: 10,
          background: dropTarget ? 'color-mix(in oklch, var(--ac) 6%, transparent)' : (isDragging ? 'color-mix(in oklch, var(--ac) 2%, transparent)' : 'transparent'),
          transition: 'background 100ms, border-color 100ms',
          minHeight: 60,
        }}
      >
        {row.widgets.map((w) => (
          <WidgetHost
            key={w.id}
            widget={w}
            selected={w.id === selectedId}
            isGhost={dragMoveId === w.id}
            onSelect={() => onWidgetSelect(w.id)}
            onDelete={() => onWidgetDelete(w.id)}
            onDragStart={onWidgetDragStart(w.id)}
            onDragEnd={onWidgetDragEnd}
            onDrop={onWidgetDrop(w.id)}
          />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// Widget host
// =============================================================================

function WidgetHost({ widget, selected, isGhost, onSelect, onDelete, onDragStart, onDragEnd, onDrop }: {
  widget: DashboardBuilderWidget; selected: boolean; isGhost: boolean
  onSelect: () => void; onDelete: () => void
  onDragStart: (e: DragEvent) => void
  onDragEnd: () => void
  onDrop: (e: DragEvent) => void
}) {
  const span = Math.min(12, Math.max(1, widget.span))
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move' }}
      onDrop={onDrop}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      style={{
        gridColumn: `span ${span}`,
        position: 'relative',
        border: `2px solid ${selected ? 'var(--ac)' : 'transparent'}`,
        borderRadius: 10,
        padding: widget.kind === 'divider' || widget.kind === 'spacer' ? 0 : 8,
        background: selected ? 'color-mix(in oklch, var(--ac) 4%, var(--bg))' : 'var(--bg-1)',
        cursor: isGhost ? 'grabbing' : 'grab',
        minHeight: 40,
        opacity: isGhost ? 0.4 : 1,
        transition: 'border-color 100ms, opacity 100ms',
      }}
    >
      {selected && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{
            position: 'absolute', top: -12, right: -8, zIndex: 5,
            width: 24, height: 24, borderRadius: 999, border: '1px solid var(--line-2)',
            background: 'var(--bg-1)', color: 'var(--err)', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}
          title="Delete widget"
        >×</button>
      )}
      <RenderWidget widget={widget} />
    </div>
  )
}

// =============================================================================
// Widget renderers
// =============================================================================

function RenderWidget({ widget: w }: { widget: DashboardBuilderWidget }) {
  const p = w.props as Record<string, unknown>
  switch (w.kind) {
    case 'stat': {
      const col = p.deltaDir === 'up' ? 'var(--ok)' : p.deltaDir === 'down' ? 'var(--err)' : 'var(--fg-3)'
      return (
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{String(p.label ?? '')}</div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)', marginTop: 4 }}>{String(p.value ?? '')}</div>
          {p.delta ? <div style={{ fontSize: 12, color: col, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {p.deltaDir === 'up' ? '↑' : p.deltaDir === 'down' ? '↓' : '→'} {String(p.delta)}
          </div> : null}
        </div>
      )
    }
    case 'heading': {
      const size = p.size === 'lg' ? 28 : p.size === 'md' ? 20 : 15
      return <h2 style={{ margin: 0, padding: '6px 4px', fontSize: size, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>{String(p.text ?? '')}</h2>
    }
    case 'text': return <p style={{ margin: 0, padding: '6px 4px', fontSize: 14, lineHeight: 1.6, color: 'var(--fg-2)' }}>{String(p.text ?? '')}</p>
    case 'divider': return <hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '12px 0' }} />
    case 'spacer': return <div style={{ height: Number(p.height) || 0 }} />
    case 'area':  return <AreaChart data={SAMPLE_SERIES} height={Number(p.height) || 220} />
    case 'line':  return <LineChart data={SAMPLE_SERIES} height={Number(p.height) || 220} />
    case 'bar':   return <BarChart data={SAMPLE_SERIES} height={Number(p.height) || 220} />
    case 'pie':   return <PieChart data={SAMPLE_PIE} size={Number(p.size) || 220} />
    case 'spark': return <SparklineChart data={SAMPLE_SERIES.map((d) => d.value)} height={Number(p.height) || 48} />
    case 'gauge': return <div style={{ display: 'flex', justifyContent: 'center' }}><GaugeChart value={Number(p.value) || 0} size={Number(p.size) || 200} label={p.label ? String(p.label) : undefined} sublabel={p.sublabel ? String(p.sublabel) : undefined} /></div>
    case 'progress': return (
      <div style={{ padding: '6px 4px' }}>
        {p.label ? <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}>{String(p.label)}</div> : null}
        <Progress value={Number(p.value) || 0} />
      </div>
    )
    case 'badge': return <div style={{ padding: 8 }}><Badge tone={(p.tone as 'accent' | 'ok' | 'warn' | 'err' | 'neutral') ?? 'neutral'} variant="soft">{String(p.text ?? '')}</Badge></div>
    case 'avatar': return <div style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 10 }}><Avatar size="md" name={String(p.name ?? '')} /><span style={{ fontSize: 13, color: 'var(--fg)' }}>{String(p.name ?? '')}</span></div>
    case 'button': return <div style={{ padding: 8 }}><Button variant={(p.variant as 'primary' | 'ghost' | 'outline' | 'destructive') ?? 'primary'}>{String(p.text ?? '')}</Button></div>
    case 'table': return (
      <Table variant="plain" density="cozy" hoverable style={{ width: '100%' }}>
        <Table.Header>
          <Table.Row><Table.Column>Project</Table.Column><Table.Column>Status</Table.Column><Table.Column align="end">Users</Table.Column></Table.Row>
        </Table.Header>
        <Table.Body>
          {SAMPLE_TABLE.map((r) => (
            <Table.Row key={r.id}>
              <Table.Cell>{r.name}</Table.Cell>
              <Table.Cell><Badge tone={r.status === 'live' ? 'ok' : r.status === 'beta' ? 'accent' : 'warn'} variant="soft">{r.status}</Badge></Table.Cell>
              <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{r.users.toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
    case 'input': return (
      <div style={{ padding: 8 }}>
        {p.label ? <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}>{String(p.label)}</div> : null}
        <Input placeholder={String(p.placeholder ?? '')} readOnly />
      </div>
    )
    case 'textarea': return (
      <div style={{ padding: 8 }}>
        {p.label ? <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}>{String(p.label)}</div> : null}
        <Textarea placeholder={String(p.placeholder ?? '')} rows={Number(p.rows) || 3} readOnly />
      </div>
    )
    case 'select': return (
      <div style={{ padding: 8 }}>
        {p.label ? <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}>{String(p.label)}</div> : null}
        <Select options={SELECT_OPTIONS} value="option-1" onValueChange={() => {}} />
      </div>
    )
    case 'checkbox': return <div style={{ padding: 8 }}><Checkbox checked label={String(p.label ?? '')} onCheckedChange={() => {}} /></div>
    case 'switch': return (
      <div style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Switch checked onCheckedChange={() => {}} />
        <span style={{ fontSize: 13, color: 'var(--fg)' }}>{String(p.label ?? '')}</span>
      </div>
    )
    case 'slider': return (
      <div style={{ padding: 8 }}>
        {p.label ? <div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}><span>{String(p.label)}</span><span style={{ color: 'var(--fg-3)' }}>{Number(p.value) || 0}</span></div> : null}
        <Slider value={Number(p.value) || 0} min={0} max={100} onValueChange={() => {}} />
      </div>
    )
    case 'card': return (
      <Card padding="md" style={{ margin: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{String(p.title ?? '')}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{String(p.body ?? '')}</div>
      </Card>
    )
  }
}

// =============================================================================
// Inspector
// =============================================================================

function Inspector({ widget, onChange, onDelete }: { widget: DashboardBuilderWidget; onChange: (w: Partial<DashboardBuilderWidget>) => void; onDelete: () => void }) {
  const def = PALETTE.find((p) => p.kind === widget.kind)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>{def?.category ?? 'widget'}</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{def?.label ?? widget.kind}</div>
        </div>
        <button onClick={onDelete} style={{ ...toolbarBtn(false), color: 'var(--err)' }}>Delete</button>
      </div>

      <PropRow label="Column span (1–12)">
        <input type="range" min={1} max={12} value={widget.span} onChange={(e) => onChange({ span: Number(e.target.value) })} style={{ width: '100%' }} />
        <div style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'right' }}>{widget.span} / 12</div>
      </PropRow>

      {renderPropEditors(widget, (patch) => onChange({ props: patch }))}
    </div>
  )
}

function PropRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, color: 'var(--fg-2)', fontWeight: 500 }}>{label}</span>
      {children}
    </label>
  )
}

const textInput: CSSProperties = {
  padding: '6px 8px', borderRadius: 6, border: '1px solid var(--line-2)',
  background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13, outline: 'none',
}

function renderPropEditors(w: DashboardBuilderWidget, patch: (props: Record<string, unknown>) => void): ReactNode {
  const p = w.props as Record<string, unknown>
  switch (w.kind) {
    case 'stat': return (
      <>
        <PropRow label="Label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
        <PropRow label="Value"><input style={textInput} value={String(p.value ?? '')} onChange={(e) => patch({ value: e.target.value })} /></PropRow>
        <PropRow label="Delta"><input style={textInput} value={String(p.delta ?? '')} onChange={(e) => patch({ delta: e.target.value })} /></PropRow>
        <PropRow label="Delta direction">
          <select style={textInput} value={String(p.deltaDir ?? 'flat')} onChange={(e) => patch({ deltaDir: e.target.value })}>
            <option value="up">Up (green)</option><option value="down">Down (red)</option><option value="flat">Flat</option>
          </select>
        </PropRow>
      </>
    )
    case 'heading': return (
      <>
        <PropRow label="Text"><input style={textInput} value={String(p.text ?? '')} onChange={(e) => patch({ text: e.target.value })} /></PropRow>
        <PropRow label="Size">
          <select style={textInput} value={String(p.size ?? 'lg')} onChange={(e) => patch({ size: e.target.value })}>
            <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
          </select>
        </PropRow>
      </>
    )
    case 'text': return <PropRow label="Text"><textarea rows={4} style={{ ...textInput, resize: 'vertical' }} value={String(p.text ?? '')} onChange={(e) => patch({ text: e.target.value })} /></PropRow>
    case 'spacer': return <PropRow label="Height (px)"><input type="number" style={textInput} value={Number(p.height) || 0} onChange={(e) => patch({ height: Number(e.target.value) })} /></PropRow>
    case 'area': case 'line': case 'bar':
      return <PropRow label="Height (px)"><input type="number" style={textInput} value={Number(p.height) || 220} onChange={(e) => patch({ height: Number(e.target.value) })} /></PropRow>
    case 'pie': return <PropRow label="Size (px)"><input type="number" style={textInput} value={Number(p.size) || 220} onChange={(e) => patch({ size: Number(e.target.value) })} /></PropRow>
    case 'spark': return <PropRow label="Height (px)"><input type="number" style={textInput} value={Number(p.height) || 48} onChange={(e) => patch({ height: Number(e.target.value) })} /></PropRow>
    case 'gauge': return (
      <>
        <PropRow label="Value (0–100)"><input type="number" style={textInput} value={Number(p.value) || 0} onChange={(e) => patch({ value: Number(e.target.value) })} /></PropRow>
        <PropRow label="Size (px)"><input type="number" style={textInput} value={Number(p.size) || 200} onChange={(e) => patch({ size: Number(e.target.value) })} /></PropRow>
        <PropRow label="Centre label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
        <PropRow label="Sublabel"><input style={textInput} value={String(p.sublabel ?? '')} onChange={(e) => patch({ sublabel: e.target.value })} /></PropRow>
      </>
    )
    case 'progress': return (
      <>
        <PropRow label="Label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
        <PropRow label="Value (0–100)"><input type="range" min={0} max={100} value={Number(p.value) || 0} onChange={(e) => patch({ value: Number(e.target.value) })} /><div style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'right' }}>{Number(p.value) || 0}%</div></PropRow>
      </>
    )
    case 'badge': return (
      <>
        <PropRow label="Text"><input style={textInput} value={String(p.text ?? '')} onChange={(e) => patch({ text: e.target.value })} /></PropRow>
        <PropRow label="Tone">
          <select style={textInput} value={String(p.tone ?? 'neutral')} onChange={(e) => patch({ tone: e.target.value })}>
            <option value="neutral">Neutral</option><option value="accent">Accent</option><option value="ok">OK</option><option value="warn">Warn</option><option value="err">Error</option>
          </select>
        </PropRow>
      </>
    )
    case 'avatar': return <PropRow label="Name"><input style={textInput} value={String(p.name ?? '')} onChange={(e) => patch({ name: e.target.value })} /></PropRow>
    case 'button': return (
      <>
        <PropRow label="Label"><input style={textInput} value={String(p.text ?? '')} onChange={(e) => patch({ text: e.target.value })} /></PropRow>
        <PropRow label="Variant">
          <select style={textInput} value={String(p.variant ?? 'primary')} onChange={(e) => patch({ variant: e.target.value })}>
            <option value="primary">Primary</option><option value="ghost">Ghost</option><option value="outline">Outline</option><option value="destructive">Destructive</option>
          </select>
        </PropRow>
      </>
    )
    case 'input': case 'textarea': return (
      <>
        <PropRow label="Label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
        <PropRow label="Placeholder"><input style={textInput} value={String(p.placeholder ?? '')} onChange={(e) => patch({ placeholder: e.target.value })} /></PropRow>
        {w.kind === 'textarea' && <PropRow label="Rows"><input type="number" style={textInput} value={Number(p.rows) || 3} onChange={(e) => patch({ rows: Number(e.target.value) })} /></PropRow>}
      </>
    )
    case 'select': case 'checkbox': case 'switch':
      return <PropRow label="Label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
    case 'slider': return (
      <>
        <PropRow label="Label"><input style={textInput} value={String(p.label ?? '')} onChange={(e) => patch({ label: e.target.value })} /></PropRow>
        <PropRow label="Value (0–100)"><input type="range" min={0} max={100} value={Number(p.value) || 0} onChange={(e) => patch({ value: Number(e.target.value) })} /><div style={{ fontSize: 12, color: 'var(--fg-3)', textAlign: 'right' }}>{Number(p.value) || 0}</div></PropRow>
      </>
    )
    case 'card': return (
      <>
        <PropRow label="Title"><input style={textInput} value={String(p.title ?? '')} onChange={(e) => patch({ title: e.target.value })} /></PropRow>
        <PropRow label="Body"><textarea rows={4} style={{ ...textInput, resize: 'vertical' }} value={String(p.body ?? '')} onChange={(e) => patch({ body: e.target.value })} /></PropRow>
      </>
    )
    default: return <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>No properties for this widget.</div>
  }
}

// =============================================================================
// Code generator
// =============================================================================

function esc(s: string): string {
  return s.replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function widgetToJsx(w: DashboardBuilderWidget): string {
  const p = w.props as Record<string, unknown>
  switch (w.kind) {
    case 'stat': return `<div style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}><div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>${esc(String(p.label))}</div><div style={{ fontSize: 24, fontWeight: 600 }}>${esc(String(p.value))}</div>${p.delta ? `<div style={{ fontSize: 12, color: 'var(--${p.deltaDir === 'up' ? 'ok' : p.deltaDir === 'down' ? 'err' : 'fg-3'})' }}>${esc(String(p.delta))}</div>` : ''}</div>`
    case 'heading': return `<h2 style={{ margin: 0, fontSize: ${p.size === 'lg' ? 28 : p.size === 'md' ? 20 : 15}, fontWeight: 600 }}>${esc(String(p.text))}</h2>`
    case 'text': return `<p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--fg-2)' }}>${esc(String(p.text))}</p>`
    case 'divider': return `<hr style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '12px 0' }} />`
    case 'spacer': return `<div style={{ height: ${p.height} }} />`
    case 'area':  return `<AreaChart data={data} height={${p.height ?? 220}} />`
    case 'line':  return `<LineChart data={data} height={${p.height ?? 220}} />`
    case 'bar':   return `<BarChart data={data} height={${p.height ?? 220}} />`
    case 'pie':   return `<PieChart data={pieData} size={${p.size ?? 220}} />`
    case 'spark': return `<SparklineChart data={data.map(d => d.value)} height={${p.height ?? 48}} />`
    case 'gauge': return `<GaugeChart value={${p.value}} size={${p.size ?? 200}}${p.label ? ` label="${esc(String(p.label))}"` : ''}${p.sublabel ? ` sublabel="${esc(String(p.sublabel))}"` : ''} />`
    case 'progress': return `<div>${p.label ? `<div style={{ fontSize: 12, color: 'var(--fg-2)', marginBottom: 6 }}>${esc(String(p.label))}</div>` : ''}<Progress value={${p.value}} /></div>`
    case 'badge': return `<Badge tone="${p.tone}" variant="soft">${esc(String(p.text))}</Badge>`
    case 'avatar': return `<Avatar size="md" name="${esc(String(p.name))}" />`
    case 'button': return `<Button variant="${p.variant}">${esc(String(p.text))}</Button>`
    case 'table': return `<Table variant="plain" density="cozy" hoverable>…columns here…</Table>`
    case 'input': return `<Input placeholder="${esc(String(p.placeholder ?? ''))}" />`
    case 'textarea': return `<Textarea placeholder="${esc(String(p.placeholder ?? ''))}" rows={${p.rows ?? 3}} />`
    case 'select': return `<Select options={options} value={value} onValueChange={setValue} />`
    case 'checkbox': return `<Checkbox checked={checked} onCheckedChange={setChecked} label="${esc(String(p.label ?? ''))}" />`
    case 'switch': return `<Switch checked={checked} onCheckedChange={setChecked} />`
    case 'slider': return `<Slider value={${p.value ?? 0}} min={0} max={100} onValueChange={setValue} />`
    case 'card': return `<Card padding="md"><div style={{ fontWeight: 600 }}>${esc(String(p.title ?? ''))}</div><div>${esc(String(p.body ?? ''))}</div></Card>`
  }
}

function generateJsx(rows: DashboardBuilderRow[]): string {
  const header = `import {\n  AreaChart, LineChart, BarChart, PieChart, GaugeChart, SparklineChart,\n  Progress, Badge, Avatar, Button, Table, Card,\n  Input, Textarea, Select, Checkbox, Switch, Slider,\n} from 'veloce-ui'\n\nconst data = [\n  { label: 'Jan', value: 40 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 61 },\n  { label: 'Apr', value: 55 }, { label: 'May', value: 72 }, { label: 'Jun', value: 68 },\n]\nconst pieData = [{ label: 'A', value: 42 }, { label: 'B', value: 28 }, { label: 'C', value: 18 }, { label: 'D', value: 12 }]\n\nexport default function Dashboard() {\n  return (\n    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>\n`
  const body = rows.map((row) => {
    const items = row.widgets.map((w) => `          <div style={{ gridColumn: 'span ${w.span}' }}>\n            ${widgetToJsx(w)}\n          </div>`).join('\n')
    const titleBlock = row.title ? `        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--fg-2)' }}>${esc(row.title)}</h3>\n` : ''
    return `      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>\n${titleBlock}        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>\n${items}\n        </div>\n      </section>`
  }).join('\n')
  const footer = `\n    </div>\n  )\n}\n`
  return header + body + footer
}
