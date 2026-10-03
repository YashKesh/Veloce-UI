import { useState } from 'react'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Preview', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Density', id: 'density' },
]

const TOTAL = 12

function PageButton({
  label, active, disabled, onClick,
}: { label: string; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 7,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background .2s, color .2s',
        ...(active
          ? { background: 'var(--fg)', color: 'var(--bg)', fontWeight: 500, border: '1px solid var(--fg)' }
          : { background: 'var(--bg-1)', color: 'var(--fg-2)', border: '1px solid var(--line)' }),
      }}
    >
      {label}
    </button>
  )
}

export default function PaginationDoc() {
  const [page, setPage] = useState(2)

  const pages: (number | '…')[] =
    page <= 3 ? [1, 2, 3, '…', TOTAL]
    : page >= TOTAL - 2 ? [1, '…', TOTAL - 2, TOTAL - 1, TOTAL]
    : [1, '…', page, '…', TOTAL]

  return (
    <ComponentDoc
      slug="pagination"
      name="Pagination"
      description="Paged navigation for long collections. The active page background slides — 200ms."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PageButton label="‹" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
            {pages.map((p, i) =>
              p === '…' ? (
                <span key={`e${i}`} style={{ width: 30, textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>…</span>
              ) : (
                <PageButton key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
              ),
            )}
            <PageButton label="›" disabled={page === TOTAL} onClick={() => setPage((p) => Math.min(TOTAL, p + 1))} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>
            Page {page} of {TOTAL}
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Pagination }'} <span className="p">from</span> <span className="s">"@/components/ui/pagination"</span>
          {'\n\n'}
          <span className="p">const</span> [page, setPage] = useState(<span className="p">1</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Pagination{'\n'}
          {'  '}<span className="p">page=</span>{'{'}page{'}'}{'\n'}
          {'  '}<span className="p">count=</span>{'{'}12{'}'}{'\n'}
          {'  '}<span className="p">onPageChange=</span>{'{'}setPage{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="density" title="Density">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-2)' }}>
            <PageButton label="‹" />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>3 / 12</span>
            <PageButton label="›" />
          </div>
          <span>compact — for toolbars and table footers</span>
        </div>
      </Section>
    </ComponentDoc>
  )
}
