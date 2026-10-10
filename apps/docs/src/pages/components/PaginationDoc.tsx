import { useState } from 'react'
import { Pagination } from 'veloce-ui'
import { ComponentDoc, Section } from '../../components/ComponentDoc'

const TOC = [
  { label: 'Live example', id: 'preview', active: true },
  { label: 'Installation', id: 'install' },
  { label: 'Usage', id: 'usage' },
  { label: 'Variations', id: 'variations' },
]

export default function PaginationDoc() {
  const [page, setPage] = useState(2)

  return (
    <ComponentDoc
      slug="pagination"
      name="Pagination"
      description="Paged navigation for long collections. Keyboard accessible, with ellipses on long ranges."
      toc={TOC}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-3)', fontVariantNumeric: 'tabular-nums' }}>
            Page {page} of 12
          </span>
        </div>
      }
      usage={
        <>
          <span className="p">import</span> {'{ Pagination }'} <span className="p">from</span> <span className="s">"veloce-ui"</span>
          {'\n\n'}
          <span className="p">const</span> [page, setPage] = useState(<span className="p">1</span>)
          {'\n\n'}
          <span className="p">&lt;</span>Pagination{'\n'}
          {'  '}<span className="p">page=</span>{'{'}page{'}'}{'\n'}
          {'  '}<span className="p">pageCount=</span>{'{'}12{'}'}{'\n'}
          {'  '}<span className="p">onPageChange=</span>{'{'}setPage{'}'}{'\n'}
          <span className="p">/&gt;</span>
        </>
      }
    >
      <Section id="variations" title="Variations">
        <div className="vl-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Pagination page={1} pageCount={5} />
            short (no ellipses)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Pagination page={25} pageCount={50} />
            long range, centered
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Pagination page={50} pageCount={50} />
            at the end
          </div>
        </div>
      </Section>
    </ComponentDoc>
  )
}
