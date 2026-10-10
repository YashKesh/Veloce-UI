import { Fragment, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'veloce-ui'
import { DocsShell, RightRail, useViewport } from '../../components/DocsShell'
import type { TocItem } from '../../components/DocsShell'
import { DOCS_SIDEBAR, prevNext } from '../../docsNav'

const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }
const sans: CSSProperties = { fontFamily: 'var(--font-sans)' }

const TOC: TocItem[] = [
  { label: 'Anatomy', id: 'anatomy', active: true },
  { label: 'Composition', id: 'composition' },
  { label: 'Row variants & density', id: 'row-variants' },
  { label: 'Cell variants', id: 'cell-variants' },
  { label: 'Sticky header & scroll', id: 'sticky' },
  { label: 'Accessibility', id: 'accessibility' },
  { label: 'API', id: 'api' },
]

const h2Style: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }
const sectionStyle: CSSProperties = { scrollMarginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }
const cardStyle: CSSProperties = {
  padding: 16, border: '1px solid var(--line)', borderRadius: 10,
  background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', gap: 10,
}
const cardTitle: CSSProperties = { fontSize: 13.5, fontWeight: 600 }
const cardFoot: CSSProperties = { ...mono, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }

/* ─────────────────────────── Tree row ─────────────────────────── */

function TreeRow({ depth, chev, icon, label, meta, selected }: { depth: number; chev?: string; icon?: string; label: ReactNode; meta?: ReactNode; selected?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 8px', paddingLeft: 8 + depth * 15,
      borderRadius: selected ? 7 : 0,
      background: selected ? 'var(--ac-soft)' : undefined,
      color: selected ? 'var(--ac-text)' : 'var(--fg-2)',
      fontWeight: selected ? 500 : 400,
    }}>
      <span style={{ width: 14, fontSize: 10, textAlign: 'center', color: 'var(--fg-3)' }}>{chev ?? ''}</span>
      <span style={{ width: 16, textAlign: 'center', color: selected ? 'var(--ac-text)' : 'var(--fg-3)', fontSize: 12 }}>{icon ?? ''}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {meta ? <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>{meta}</span> : null}
    </div>
  )
}

/* ─────────────────────────── Status cell ─────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'ac'
function StatusCell({ tone, label, spinner }: { tone: Tone; label: string; spinner?: boolean }) {
  const map: Record<Tone, { fg: string; dot: string }> = {
    ok: { fg: 'var(--ok)', dot: 'var(--ok)' },
    warn: { fg: 'var(--warn)', dot: 'var(--warn)' },
    err: { fg: 'var(--err)', dot: 'var(--err)' },
    ac: { fg: 'var(--ac-text)', dot: 'var(--ac)' },
  }
  const c = map[tone]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: c.fg, fontSize: 12.5, fontWeight: 500 }} aria-label={label}>
      {spinner ? (
        <span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid var(--ac)', borderRightColor: 'transparent', display: 'inline-block', animation: 'vl-spin .8s linear infinite' }} />
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      )}
      {label}
    </span>
  )
}

function Avatar({ initials, hue = 200 }: { initials: string; hue?: number }) {
  return (
    <span style={{
      width: 22, height: 22, borderRadius: '50%',
      background: `oklch(0.6 0.12 ${hue})`, color: 'oklch(0.98 0 0)',
      display: 'inline-grid', placeItems: 'center', fontSize: 10, fontWeight: 600,
    }}>{initials}</span>
  )
}

/* ─────────────────────────── Anatomy preview ─────────────────────────── */

const PROJECT_ROWS = [
  { id: 1, project: 'veloce-core', owner: 'Jonas Lind', initials: 'JL', hue: 200, when: '2 min ago', tone: 'ok' as Tone, status: 'Ready', spinner: false, size: '1.2 MB' },
  { id: 2, project: 'portpilot-ui', owner: 'Mika Chen', initials: 'MC', hue: 150, when: '14 min ago', tone: 'ac' as Tone, status: 'Running', spinner: true, size: '820 kB' },
  { id: 3, project: 'apiforge-ext', owner: 'Rhea Souza', initials: 'RS', hue: 20, when: '1 h ago', tone: 'err' as Tone, status: 'Failed', spinner: false, size: '2.4 MB' },
  { id: 4, project: 'orderflow-api', owner: 'Theo Park', initials: 'TP', hue: 280, when: '3 h ago', tone: 'warn' as Tone, status: 'Paused', spinner: false, size: '640 kB' },
  { id: 5, project: 'jsoncraft', owner: 'Sari Boone', initials: 'SB', hue: 90, when: 'yesterday', tone: 'ok' as Tone, status: 'Ready', spinner: false, size: '420 kB' },
  { id: 6, project: 'spellduel', owner: 'Nico Vale', initials: 'NV', hue: 320, when: '2 d ago', tone: 'ok' as Tone, status: 'Ready', spinner: false, size: '980 kB' },
]

const SELECTED_ID = 2

function AnatomyPreview() {
  const { isMobile, isTablet } = useViewport()
  const narrow = isMobile || isTablet
  return (
    <div style={{ overflowX: narrow ? 'auto' : 'visible', minWidth: 0 }}>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '320px 1fr', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg-1)', minWidth: narrow ? 760 : undefined }}>
      {/* Left: component tree */}
      <div style={{ borderRight: '1px solid var(--line)', padding: '10px 8px', fontSize: 13.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TreeRow depth={0} chev="⌄" icon="▦" label={<span style={{ color: 'var(--fg)' }}>Table</span>} />
        <TreeRow depth={1} chev="⌄" icon="▤" label={<span style={{ color: 'var(--fg)' }}>Table.Header</span>} meta="sticky" />
        <TreeRow depth={2} icon="⫿" label={<>Table.Column <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>project</span></>} />
        <TreeRow depth={2} icon="⫿" label={<>Table.Column <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>owner</span></>} />
        <TreeRow depth={2} icon="⫿" label={<>Table.Column <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>activity</span></>} />
        <TreeRow depth={2} icon="⫿" label={<>Table.Column <span style={{ ...mono, fontSize: 11, color: 'var(--fg-3)' }}>status · size</span></>} />
        <TreeRow depth={1} chev="⌄" icon="⫯" label={<span style={{ color: 'var(--fg)' }}>Table.Body</span>} />
        <TreeRow depth={2} icon="⊟" label="Table.Row · default" />
        <TreeRow depth={2} icon="⊟" label="Table.Row · striped" />
        <TreeRow depth={2} icon="⊟" label={<>Table.Row · <span style={{ color: 'var(--ac-text)' }}>selected</span></>} selected />
        <TreeRow depth={2} icon="⊟" label="Table.Row · disabled" />
        <TreeRow depth={2} chev="⌄" icon="▭" label="Table.Cell" />
        <TreeRow depth={3} icon="A" label={<span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>variant="text"</span>} />
        <TreeRow depth={3} icon="#" label={<span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>variant="num"</span>} />
        <TreeRow depth={3} icon="●" label={<span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>variant="status"</span>} />
        <TreeRow depth={3} icon="◉" label={<span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>variant="avatar"</span>} />
        <TreeRow depth={3} icon="⌁" label={<span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>variant="action"</span>} />
        <TreeRow depth={1} chev="›" icon="▣" label={<span style={{ color: 'var(--fg)' }}>Table.Footer</span>} />
        <TreeRow depth={1} icon="⌞" label="Caption" meta="aria-describedby" />
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--line)', ...mono, fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          real &lt;table&gt; underneath · zero JS runtime
        </div>
      </div>

      {/* Right: live mock table */}
      <div style={{
        background: 'var(--bg)', position: 'relative',
        backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--fg) 8%, transparent) 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}>
        <div style={{ padding: 18 }}>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)', overflow: 'hidden' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, color: 'var(--fg)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)' }}>
                  <th scope="col" style={headCellStyle('left')}>PROJECT</th>
                  <th scope="col" style={headCellStyle('left')}>OWNER</th>
                  <th scope="col" style={headCellStyle('left')}>LAST ACTIVITY</th>
                  <th scope="col" style={headCellStyle('left')}>STATUS</th>
                  <th scope="col" style={headCellStyle('right')}>SIZE</th>
                </tr>
              </thead>
              <tbody>
                {PROJECT_ROWS.map((r, i) => {
                  const selected = r.id === SELECTED_ID
                  const stripe = i % 2 === 1
                  return (
                    <tr key={r.id} style={{
                      background: selected ? 'var(--ac-soft)' : stripe ? 'var(--bg-2)' : 'transparent',
                      borderTop: '1px solid var(--line)',
                      boxShadow: selected ? 'inset 2px 0 0 var(--ac)' : undefined,
                    }}>
                      <td style={bodyCellStyle('left')}>
                        <span style={{ ...mono, fontSize: 12.5, color: selected ? 'var(--ac-text)' : 'var(--fg)' }}>{r.project}</span>
                      </td>
                      <td style={bodyCellStyle('left')}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <Avatar initials={r.initials} hue={r.hue} />
                          <span style={{ color: 'var(--fg-2)' }}>{r.owner}</span>
                        </span>
                      </td>
                      <td style={{ ...bodyCellStyle('left'), color: 'var(--fg-3)' }}>{r.when}</td>
                      <td style={bodyCellStyle('left')}>
                        <StatusCell tone={r.tone} label={r.status} spinner={r.spinner} />
                      </td>
                      <td style={{ ...bodyCellStyle('right'), ...mono, fontSize: 12.5, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>{r.size}</td>
                    </tr>
                  )
                })}
                <tr style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line-2)' }}>
                  <td style={{ ...bodyCellStyle('left'), fontWeight: 500 }}>Total</td>
                  <td style={bodyCellStyle('left')} />
                  <td style={bodyCellStyle('left')} />
                  <td style={{ ...bodyCellStyle('left'), ...mono, fontSize: 11, color: 'var(--fg-3)' }}>6 projects</td>
                  <td style={{ ...bodyCellStyle('right'), ...mono, fontSize: 12.5, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>6.5 MB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', ...mono, fontSize: 11, color: 'var(--fg-3)' }}>
            sticky header · striped bodies · no virtualisation
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

function headCellStyle(align: 'left' | 'right'): CSSProperties {
  return {
    padding: '10px 14px', textAlign: align,
    ...mono, fontSize: 10.5, letterSpacing: '0.08em', fontWeight: 500,
    color: 'var(--fg-3)', borderBottom: '1px solid var(--line)',
    position: 'sticky', top: 0, background: 'var(--bg-2)',
  }
}
function bodyCellStyle(align: 'left' | 'right'): CSSProperties {
  return { padding: '10px 14px', textAlign: align, verticalAlign: 'middle' }
}

/* ─────────────────────────── Composition code ─────────────────────────── */

function CompositionCode() {
  const dim = (t: string) => <span style={{ color: 'var(--fg-3)' }}>{t}</span>
  const tag = (t: string) => <span style={{ color: 'var(--fg)' }}>{t}</span>
  const str = (t: string) => <span style={{ color: 'var(--ac-text)' }}>{t}</span>
  const val = (t: string) => <span style={{ color: 'var(--fg-2)' }}>{t}</span>
  return (
    <pre style={{ margin: 0, padding: '18px 20px', borderRadius: 10, background: 'var(--bg-1)', border: '1px solid var(--line)', ...mono, fontSize: 13, lineHeight: 1.65, color: 'var(--fg-2)', overflowX: 'auto' }}>
{dim('import')}{' { Table } '}{dim('from')} {str('"veloce-ui"')}{'\n\n'}
{dim('<')}{tag('Table')} {dim('variant=')}{str('"striped"')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('Table.Header')} {dim('sticky>')}{'\n'}
{'    '}{dim('<')}{tag('Table.Column')}{dim('>')}Project{dim('</')}{tag('Table.Column')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Table.Column')}{dim('>')}Owner{dim('</')}{tag('Table.Column')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Table.Column')} {dim('align=')}{str('"end"')}{dim('>')}Size{dim('</')}{tag('Table.Column')}{dim('>')}{'\n'}
{'    '}{dim('<')}{tag('Table.Column')}{dim('>')}Status{dim('</')}{tag('Table.Column')}{dim('>')}{'\n'}
{'  '}{dim('</')}{tag('Table.Header')}{dim('>')}{'\n'}
{'  '}{dim('<')}{tag('Table.Body')}{dim('>')}{'\n'}
{'    '}{dim('{rows.map((r) => (')}{'\n'}
{'      '}{dim('<')}{tag('Table.Row')} {dim('key=')}{val('{r.id}')} {dim('selected=')}{val('{r.id === selectedId}')}{dim('>')}{'\n'}
{'        '}{dim('<')}{tag('Table.Cell')}{dim('>{r.project}</')}{tag('Table.Cell')}{dim('>')}{'\n'}
{'        '}{dim('<')}{tag('Table.Cell')} {dim('avatar=')}{val('{r.ownerAvatar}')}{dim('>{r.owner}</')}{tag('Table.Cell')}{dim('>')}{'\n'}
{'        '}{dim('<')}{tag('Table.Cell')} {dim('variant=')}{str('"num"')}{dim('>{bytes(r.size)}</')}{tag('Table.Cell')}{dim('>')}{'\n'}
{'        '}{dim('<')}{tag('Table.Cell')} {dim('variant=')}{str('"status"')} {dim('tone=')}{val('{r.tone}')}{dim('>{r.status}</')}{tag('Table.Cell')}{dim('>')}{'\n'}
{'      '}{dim('</')}{tag('Table.Row')}{dim('>')}{'\n'}
{'    '}{dim('))}')}{'\n'}
{'  '}{dim('</')}{tag('Table.Body')}{dim('>')}{'\n'}
{dim('</')}{tag('Table')}{dim('>')}
    </pre>
  )
}

/* ─────────────────────────── Row variant mini-table ─────────────────────────── */

function MiniTable({ variant, density }: { variant: 'striped' | 'hover' | 'plain'; density?: 'compact' | 'cozy' | 'comfortable' }) {
  const pad = density === 'compact' ? '5px 10px' : density === 'comfortable' ? '12px 10px' : '8px 10px'
  const rows = ['Hobby', 'Pro', 'Team']
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: 'var(--bg-2)' }}>
            <th style={{ padding: pad, textAlign: 'left', ...mono, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em' }}>PLAN</th>
            <th style={{ padding: pad, textAlign: 'right', ...mono, fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.08em' }}>MRR</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const stripe = variant === 'striped' && i % 2 === 1
            const hover = variant === 'hover' && i === 1
            return (
              <tr key={r} style={{
                background: hover ? 'var(--bg-2)' : stripe ? 'var(--bg-1)' : 'transparent',
                borderTop: '1px solid var(--line)',
              }}>
                <td style={{ padding: pad }}>{r}</td>
                <td style={{ padding: pad, textAlign: 'right', ...mono, fontVariantNumeric: 'tabular-nums' }}>${(i + 1) * 9200}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─────────────────────────── Cell variant samples ─────────────────────────── */

function CellCard({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>{title}</span>
        <span style={cardFoot}>{meta}</span>
      </div>
      <div style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)' }}>
        {children}
      </div>
    </div>
  )
}

/* ─────────────────────────── Sticky scroll card ─────────────────────────── */

function StickyCard() {
  return (
    <div style={{ ...cardStyle, gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={cardTitle}>Sticky header & scroll shadow</span>
        <span style={cardFoot}>position: sticky · backdrop-filter: blur(6px)</span>
      </div>
      <div style={{
        maxHeight: 220, overflow: 'auto', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr>
              {['PROJECT', 'OWNER', 'SIZE'].map((h) => (
                <th key={h} style={{
                  position: 'sticky', top: 0, zIndex: 1,
                  background: 'color-mix(in oklch, var(--bg-2) 92%, transparent)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  padding: '10px 14px', textAlign: 'left',
                  ...mono, fontSize: 10, letterSpacing: '0.08em', color: 'var(--fg-3)',
                  borderBottom: '1px solid var(--line)',
                  boxShadow: '0 6px 10px -8px color-mix(in oklch, var(--fg) 25%, transparent)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '9px 14px', ...mono, fontSize: 12 }}>project-{String(i + 1).padStart(2, '0')}</td>
                <td style={{ padding: '9px 14px', color: 'var(--fg-2)' }}>Jonas Lind</td>
                <td style={{ padding: '9px 14px', ...mono, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-2)' }}>{(0.3 + i * 0.4).toFixed(1)} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
        The header stays pinned using <span style={{ ...mono, color: 'var(--ac-text)' }}>position: sticky</span>, and a soft inset drop below the row — token <span style={{ ...mono, color: 'var(--ac-text)' }}>--shadow-sticky</span> — appears only when the body scrolls. A 6px backdrop blur lets striped rows glide under without clashing with content.
      </p>
    </div>
  )
}

/* ─────────────────────────── API ─────────────────────────── */

type ApiRow = { prop: string; type: string; def: string; desc: string }
type ApiGroup = { name: string; rows: ApiRow[] }

const API: ApiGroup[] = [
  {
    name: 'Table',
    rows: [
      { prop: 'variant', type: '"plain" | "striped"', def: '"plain"', desc: 'Zebra striping on alternate rows for scan-ability on dense content.' },
      { prop: 'density', type: '"compact" | "cozy" | "comfortable"', def: '"cozy"', desc: 'Row height preset. compact=32, cozy=40, comfortable=48.' },
      { prop: 'hoverable', type: 'boolean', def: 'true', desc: 'Row hover tint. Disable in read-only contexts to reduce noise.' },
      { prop: 'caption', type: 'string', def: '—', desc: 'Renders a visible <caption>, read by screen readers before the headers.' },
      { prop: 'aria-label', type: 'string', def: '—', desc: 'Fallback label when the table has no caption.' },
    ],
  },
  {
    name: 'Table.Header',
    rows: [
      { prop: 'sticky', type: 'boolean', def: 'false', desc: 'Pins the thead with position: sticky and a scroll shadow.' },
      { prop: 'offset', type: 'number', def: '0', desc: 'Top offset in px when nested beneath a sticky toolbar or app bar.' },
    ],
  },
  {
    name: 'Table.Column',
    rows: [
      { prop: 'align', type: '"start" | "center" | "end"', def: '"start"', desc: 'Horizontal alignment. Numeric cells should set "end".' },
      { prop: 'width', type: 'number | string', def: '—', desc: 'Fixed column width. Omit for intrinsic sizing.' },
      { prop: 'scope', type: '"col" | "colgroup"', def: '"col"', desc: 'ARIA scope for the <th>. Switch to colgroup for spanned headers.' },
      { prop: 'sortable', type: 'boolean', def: 'false', desc: 'Renders a sort affordance; emits aria-sort on toggle.' },
    ],
  },
  {
    name: 'Table.Row',
    rows: [
      { prop: 'selected', type: 'boolean', def: '—', desc: 'Visually selected: ac-soft background and 2px accent left bar.' },
      { prop: 'disabled', type: 'boolean', def: '—', desc: 'Dims the row and removes hover + focus affordances.' },
      { prop: 'tone', type: '"default" | "ok" | "warn" | "err"', def: '"default"', desc: 'Row-level tint used for status roll-ups and critical rows.' },
    ],
  },
  {
    name: 'Table.Cell',
    rows: [
      { prop: 'variant', type: '"text" | "num" | "status" | "avatar" | "link" | "action"', def: '"text"', desc: 'Styles the cell: tabular-nums for num, dot+label for status, etc.' },
      { prop: 'avatar', type: 'string', def: '—', desc: 'URL or initials for the leading avatar when variant="avatar".' },
      { prop: 'tone', type: '"default" | "ok" | "warn" | "err"', def: '"default"', desc: 'Semantic tint for the cell text — pairs with variant="status".' },
      { prop: 'align', type: '"start" | "center" | "end"', def: '—', desc: 'Overrides the column alignment for a single cell.' },
    ],
  },
]

function ApiTable() {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', fontSize: 13.5 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '180px 220px 110px 1fr', padding: '10px 16px', background: 'var(--bg-1)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-3)' }}>
        <span>PROP</span><span>TYPE</span><span>DEFAULT</span><span>DESCRIPTION</span>
      </div>
      {API.map((group, gi) => (
        <div key={group.name}>
          <div style={{
            padding: '10px 16px', background: 'var(--bg-2)',
            borderTop: gi === 0 ? 'none' : '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            ...mono, fontSize: 11.5, color: 'var(--ac-text)', letterSpacing: '0.04em',
          }}>{group.name}</div>
          {group.rows.map((r, i) => (
            <div key={r.prop} style={{
              display: 'grid', gridTemplateColumns: '180px 220px 110px 1fr',
              padding: '12px 16px',
              borderBottom: i < group.rows.length - 1 ? '1px solid var(--line)' : undefined,
              alignItems: 'baseline',
            }}>
              <span style={{ ...mono, color: 'var(--ac-text)' }}>{r.prop}</span>
              <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.type}</span>
              <span style={{ ...mono, fontSize: 12.5, color: 'var(--fg-2)' }}>{r.def}</span>
              <span style={{ color: 'var(--fg-2)' }}>{r.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────── Shared grid helper ─────────────────────────── */

const Grid = ({ cols, gap = 14, children }: { cols: string; gap?: number; children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: cols, gap }}>{children}</div>
)

/* ─────────────────────────── Page ─────────────────────────── */

function LiveTableDemo() {
  const [density, setDensity] = useState<'compact' | 'cozy' | 'comfortable'>('cozy')
  const [variant, setVariant] = useState<'plain' | 'striped'>('striped')
  const rows = [
    { name: 'veloce-docs', status: 'Live', region: '14 regions', last: '38s ago' },
    { name: 'edge-api', status: 'Live', region: '14 regions', last: '2m ago' },
    { name: 'preview-pr-218', status: 'Building', region: '—', last: 'now' },
    { name: 'blog', status: 'Live', region: '6 regions', last: '3h ago' },
    { name: 'admin-panel', status: 'Failed', region: '—', last: '12m ago' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--line)', borderRadius: 12, padding: 20, background: 'var(--bg-1)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', gap: 2, padding: 2, border: '1px solid var(--line)', borderRadius: 7, fontSize: 12 }}>
          {(['plain', 'striped'] as const).map((v) => (
            <button key={v} onClick={() => setVariant(v)} style={{ padding: '3px 10px', borderRadius: 5, background: variant === v ? 'var(--bg-3)' : 'transparent', color: variant === v ? 'var(--fg)' : 'var(--fg-2)' }}>{v}</button>
          ))}
        </div>
        <div style={{ display: 'inline-flex', gap: 2, padding: 2, border: '1px solid var(--line)', borderRadius: 7, fontSize: 12 }}>
          {(['compact', 'cozy', 'comfortable'] as const).map((d) => (
            <button key={d} onClick={() => setDensity(d)} style={{ padding: '3px 10px', borderRadius: 5, background: density === d ? 'var(--bg-3)' : 'transparent', color: density === d ? 'var(--fg)' : 'var(--fg-2)' }}>{d}</button>
          ))}
        </div>
      </div>
      <Table variant={variant} density={density} hoverable style={{ width: '100%' }}>
        <Table.Header>
          <Table.Row>
            <Table.Column>Project</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Regions</Table.Column>
            <Table.Column align="end">Last deploy</Table.Column>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r) => (
            <Table.Row key={r.name}>
              <Table.Cell style={{ fontWeight: 500 }}>{r.name}</Table.Cell>
              <Table.Cell variant="status" tone={r.status === 'Live' ? 'ok' : r.status === 'Failed' ? 'err' : 'warn'}>
                {r.status}
              </Table.Cell>
              <Table.Cell>{r.region}</Table.Cell>
              <Table.Cell align="end" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>{r.last}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default function TableDoc() {
  const { prev, next } = prevNext('table')
  return (
    <DocsShell sidebar={DOCS_SIDEBAR} rail={<RightRail toc={TOC} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--ac-soft)', border: '1px solid color-mix(in oklch, var(--ac) 40%, transparent)', display: 'grid', placeItems: 'center', color: 'var(--ac-text)', fontSize: 12 }}>▦</span>
          <span style={{ color: 'var(--fg-3)' }}>Veloce</span>
          <span style={{ color: 'var(--fg-3)' }}>/</span>
          <Link to="/components" style={{ color: 'var(--fg-2)' }}>Components</Link>
          <span style={{ color: 'var(--fg-3)' }}>/</span>
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Table</span>
        </div>

        {/* Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600, letterSpacing: '-0.035em' }}>Table</h1>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, background: 'color-mix(in oklch,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>a11y ✓</span>
            <span style={{ ...mono, fontSize: 11.5, padding: '3px 8px', borderRadius: 6, border: '1px solid var(--line-2)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>SVG · 0 kB runtime</span>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--fg-2)', maxWidth: 720 }}>
            Static tabular layout for small- and medium-sized datasets. Striped rows, sticky headers, column alignment helpers and status cells — no virtualisation, no runtime state. Reach for Data Grid when rows exceed ~100 or you need sorting/filtering/selection.
          </p>

          {/* Segmented tabs */}
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: 3, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--bg-1)', fontSize: 12.5, gap: 2 }}>
            {['Figma', 'GitHub', 'Storybook'].map((t, i) => (
              <span key={t} style={{
                padding: '6px 12px', borderRadius: 7,
                background: i === 0 ? 'var(--bg)' : 'transparent',
                border: i === 0 ? '1px solid var(--line-2)' : '1px solid transparent',
                color: i === 0 ? 'var(--fg)' : 'var(--fg-3)',
                fontWeight: i === 0 ? 500 : 400,
              }}>{t}</span>
            ))}
          </div>

          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, maxWidth: 760 }}>
            {[['18', 'variants'], ['6', 'column types'], ['0 kB', 'runtime'], ['AA', 'contrast']].map(([v, l]) => (
              <div key={l} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--bg-1)' }}>
                <div style={{ ...sans, fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live demo — real component */}
        <section id="live" style={{ display: 'flex', flexDirection: 'column', gap: 14, scrollMarginTop: 20 }}>
          <h2 style={h2Style}>Live example</h2>
          <LiveTableDemo />
        </section>

        {/* Anatomy */}
        <section id="anatomy" style={sectionStyle}>
          <AnatomyPreview />
        </section>

        {/* Composition */}
        <section id="composition" style={sectionStyle}>
          <h2 style={h2Style}>Composition</h2>
          <CompositionCode />
        </section>

        {/* Row variants & density */}
        <section id="row-variants" style={sectionStyle}>
          <h2 style={h2Style}>Row variants &amp; density</h2>
          <Grid cols="1fr 1fr 1fr 1fr">
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={cardTitle}>Striped</span><span style={cardFoot}>variant="striped"</span>
              </div>
              <MiniTable variant="striped" />
              <span style={cardFoot}>alt rows tinted var(--bg-1)</span>
            </div>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={cardTitle}>Hoverable</span><span style={cardFoot}>hoverable</span>
              </div>
              <MiniTable variant="hover" />
              <span style={cardFoot}>row tints on pointer / focus-within</span>
            </div>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={cardTitle}>Compact</span><span style={cardFoot}>density="compact"</span>
              </div>
              <MiniTable variant="plain" density="compact" />
              <span style={cardFoot}>32px rows for dashboards</span>
            </div>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={cardTitle}>Comfortable</span><span style={cardFoot}>density="comfortable"</span>
              </div>
              <MiniTable variant="plain" density="comfortable" />
              <span style={cardFoot}>48px rows for forms & reports</span>
            </div>
          </Grid>
        </section>

        {/* Cell variants */}
        <section id="cell-variants" style={sectionStyle}>
          <h2 style={h2Style}>Cell variants</h2>
          <Grid cols="1fr 1fr 1fr">
            <CellCard title="Text" meta='variant="text"'>
              <span style={{ fontSize: 13 }}>veloce-core</span>
            </CellCard>
            <CellCard title="Number" meta='variant="num"'>
              <span style={{ ...mono, fontSize: 13, fontVariantNumeric: 'tabular-nums', display: 'block', textAlign: 'right' }}>$128,400</span>
            </CellCard>
            <CellCard title="Status" meta='variant="status"'>
              <StatusCell tone="ok" label="Ready" />
            </CellCard>
            <CellCard title="Avatar + name" meta='variant="avatar"'>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <Avatar initials="JL" hue={200} /> Jonas Lind
              </span>
            </CellCard>
            <CellCard title="Link" meta='variant="link"'>
              <a style={{ color: 'var(--ac-text)', textDecoration: 'none', borderBottom: '1px solid color-mix(in oklch, var(--ac) 50%, transparent)', fontSize: 13 }}>pr-218 · restore focus</a>
            </CellCard>
            <CellCard title="Action buttons" meta='variant="action"'>
              <span style={{ display: 'inline-flex', gap: 6 }}>
                <span style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line-2)', fontSize: 12, color: 'var(--fg-2)' }}>Edit</span>
                <span style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid color-mix(in oklch, var(--err) 40%, var(--line-2))', fontSize: 12, color: 'var(--err)' }}>Delete</span>
              </span>
            </CellCard>
          </Grid>
        </section>

        {/* Sticky */}
        <section id="sticky" style={sectionStyle}>
          <h2 style={h2Style}>Sticky header &amp; scroll shadows</h2>
          <StickyCard />
        </section>

        {/* Accessibility */}
        <section id="accessibility" style={sectionStyle}>
          <h2 style={h2Style}>Accessibility</h2>
          <Grid cols="1fr 1fr">
            <div style={cardStyle}>
              <span style={cardTitle}>Semantics</span>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--fg-2)' }}>
                The real <span style={{ ...mono, color: 'var(--ac-text)' }}>&lt;table&gt;</span> element is preserved under the hood: header cells are <span style={{ ...mono, color: 'var(--ac-text)' }}>scope="col"</span>, caption is linked via <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-describedby</span>, status cells expose their state in <span style={{ ...mono, color: 'var(--ac-text)' }}>aria-label</span> so colour is never the only cue. Row-level actions appear only on <span style={{ ...mono, color: 'var(--ac-text)' }}>focus-within</span> so they don't clutter the layout for assistive tech.
              </p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Keyboard</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 13, alignItems: 'center' }}>
                {[
                  ['Tab', 'navigate between cells'],
                  ['↑ ↓', 'move between rows'],
                  ['Space', 'select row (when selectable)'],
                  ['Enter', 'activate row action'],
                ].map(([k, d]) => (
                  <Fragment key={k}>
                    <span style={{
                      ...mono, fontSize: 12, padding: '3px 8px', borderRadius: 6,
                      border: '1px solid var(--line-2)', background: 'var(--bg)',
                      color: 'var(--fg)', justifySelf: 'start',
                    }}>{k}</span>
                    <span style={{ color: 'var(--fg-2)' }}>{d}</span>
                  </Fragment>
                ))}
              </div>
            </div>
          </Grid>
        </section>

        {/* API */}
        <section id="api" style={sectionStyle}>
          <h2 style={h2Style}>API <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--fg-3)', marginLeft: 6 }}>Table &amp; subcomponents</span></h2>
          <ApiTable />
        </section>

        {/* Prev/Next */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13.5 }}>
          {prev ? (
            <Link to={`/components/${prev.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>← Previous</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{prev.label}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/components/${next.slug}`} style={{ padding: '14px 16px', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right', color: 'inherit' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Next →</span>
              <span style={{ fontWeight: 500, color: 'var(--fg)' }}>{next.label}</span>
            </Link>
          ) : <span />}
        </div>
      </div>
    </DocsShell>
  )
}
