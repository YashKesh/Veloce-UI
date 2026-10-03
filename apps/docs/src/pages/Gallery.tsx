import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DocsShell } from '../components/DocsShell'
import { DOCS_SIDEBAR } from '../docsNav'
import './Gallery.css'

type Category = 'Primitives' | 'Forms' | 'Overlays' | 'Feedback' | 'Navigation' | 'Data' | 'Layout' | 'Motion'
const FILTERS: Array<'All' | Category> = ['All', 'Primitives', 'Forms', 'Overlays', 'Feedback', 'Navigation', 'Data', 'Layout', 'Motion']

const HASH_TO_CATEGORY: Record<string, Category> = {
  '#primitives': 'Primitives',
  '#forms': 'Forms',
  '#overlays': 'Overlays',
  '#feedback': 'Feedback',
  '#navigation': 'Navigation',
  '#data': 'Data',
  '#layout': 'Layout',
  '#motion': 'Motion',
}

const mono: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }

function MiniButton() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 13px', borderRadius: 8, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 13.5, fontWeight: 500, boxShadow: 'inset 0 1px 0 oklch(1 0 0/.2)' }}>Deploy</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 13px', borderRadius: 8, border: '1px solid var(--line-2)', fontSize: 13.5, fontWeight: 500 }}>Preview</span>
    </div>
  )
}

function MiniInput() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 200 }}>
      <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Project name</span>
      <div style={{ display: 'flex', alignItems: 'center', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13.5, boxShadow: '0 0 0 2px var(--bg-1),0 0 0 4px var(--ac)' }}>
        acme-design
        <span style={{ width: 1.5, height: 15, background: 'var(--fg)', marginLeft: 1 }} />
      </div>
    </div>
  )
}

function MiniSelect() {
  return (
    <div style={{ position: 'relative', width: 190, marginTop: -72 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, padding: '0 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13.5 }}>
        Region<span style={{ color: 'var(--fg-3)' }}>⌄</span>
      </div>
      <div style={{ position: 'absolute', top: 42, left: 0, right: 0, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 13, transformOrigin: 'top', transform: 'scaleY(.98)', opacity: 0.95 }}>
        <div style={{ padding: '7px 9px', borderRadius: 6, background: 'var(--bg-3)', display: 'flex', justifyContent: 'space-between' }}>
          us-east-1<span style={{ color: 'var(--ac-text)' }}>✓</span>
        </div>
        <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>eu-west-2</div>
      </div>
    </div>
  )
}

function MiniDialog() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'oklch(0 0 0/.4)' }} />
      <div className="gal__mini-dialog">
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>Archive project?</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3 }}>You can restore it within 30 days.</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
          <span style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid var(--line-2)', fontSize: 12 }}>Cancel</span>
          <span style={{ padding: '5px 9px', borderRadius: 6, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 12, fontWeight: 500 }}>Archive</span>
        </div>
      </div>
    </>
  )
}

function MiniDropdown() {
  return (
    <div style={{ width: 180, padding: 4, borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 13 }}>
      <div style={{ padding: '7px 9px', borderRadius: 6, display: 'flex', justifyContent: 'space-between', color: 'var(--fg-2)' }}>
        Rename<span style={mono}>R</span>
      </div>
      <div style={{ padding: '7px 9px', borderRadius: 6, background: 'var(--bg-3)', display: 'flex', justifyContent: 'space-between' }}>
        Duplicate<span style={mono}>⌘D</span>
      </div>
      <div style={{ padding: '7px 9px', color: 'var(--fg-2)' }}>Move to…</div>
      <div style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
      <div style={{ padding: '7px 9px', color: 'var(--err)' }}>Delete</div>
    </div>
  )
}

function MiniTooltip() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', padding: '6px 9px', borderRadius: 6, background: 'var(--fg)', color: 'var(--bg)', fontSize: 12, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)' }}>
        Copy link <span style={{ opacity: 0.55, fontFamily: 'var(--font-mono)', fontSize: 11 }}>⌘C</span>
      </div>
      <div style={{ position: 'absolute', bottom: 39, left: '50%', width: 8, height: 8, background: 'var(--fg)', transform: 'translateX(-50%) rotate(45deg)' }} />
      <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg-2)', fontSize: 14 }}>⛓</span>
    </div>
  )
}

function MiniTabs() {
  return (
    <div className="vl-seg" style={{ fontSize: 13 }}>
      <span className="vl-seg__item" style={{ padding: '6px 12px' }}>Overview</span>
      <span className="vl-seg__item vl-seg__item--active" style={{ padding: '6px 12px' }}>Usage</span>
      <span className="vl-seg__item" style={{ padding: '6px 12px' }}>Billing</span>
    </div>
  )
}

function MiniToast() {
  return (
    <div style={{ display: 'flex', gap: 10, width: 210, padding: 12, border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--bg-2)', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ok)', marginTop: 5, flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Saved</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Changes synced to main</div>
      </div>
      <span style={{ color: 'var(--fg-3)', fontSize: 11 }}>✕</span>
    </div>
  )
}

function MiniSwitch() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="vl-switch vl-switch--on" style={{ display: 'block' }}><span className="thumb" /></span>
        Auto-deploy
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="vl-switch" style={{ display: 'block' }}><span className="thumb" /></span>
        Notifications
      </div>
    </div>
  )
}

function MiniCheckbox() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="vl-checkbox vl-checkbox--checked">✓</span>Run tests
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="vl-checkbox vl-checkbox--checked">
          <span style={{ width: 8, height: 2, background: 'var(--ac-fg)', borderRadius: 1 }} />
        </span>
        Lint
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="vl-checkbox" />Type-check
      </div>
    </div>
  )
}

function MiniAccordion() {
  return (
    <div style={{ width: 210, fontSize: 13, border: '1px solid var(--line-2)', borderRadius: 9, background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ padding: '9px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        Is it tree-shakeable?<span style={{ color: 'var(--fg-3)' }}>⌄</span>
      </div>
      <div style={{ padding: '9px 12px', display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
        Does it ship JS?<span style={{ color: 'var(--ac-text)' }}>⌃</span>
      </div>
      <div style={{ padding: '0 12px 10px', color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.45 }}>Only the component. Motion is CSS.</div>
    </div>
  )
}

function MiniPopover() {
  return (
    <div style={{ width: 224, padding: 14, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-md)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontWeight: 600 }}>Share</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--line-2)', background: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', padding: '0 8px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          veloce.dev/8fk2
        </div>
        <span style={{ height: 30, padding: '0 10px', borderRadius: 6, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 12, fontWeight: 500, display: 'grid', placeItems: 'center' }}>Copy</span>
      </div>
    </div>
  )
}

function MiniCard() {
  return (
    <div style={{ width: 200, borderRadius: 10, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden', fontSize: 13 }}>
      <div style={{ height: 56, background: 'linear-gradient(135deg,var(--ac-soft),var(--bg-3))' }} />
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontWeight: 600 }}>Edge Functions</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>Deploy in 14 regions</div>
      </div>
    </div>
  )
}

function MiniBadge() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: 200 }}>
      <span className="vl-badge vl-badge--accent">Beta</span>
      <span className="vl-badge vl-badge--success">Live</span>
      <span className="vl-badge vl-badge--error">Failed</span>
      <span className="vl-badge vl-badge--outline">Draft</span>
      <span className="vl-badge vl-badge--inverted">v1.0</span>
    </div>
  )
}

function MiniCommandPalette() {
  return (
    <div style={{ width: 220, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', fontSize: 12.5, overflow: 'hidden' }}>
      <div style={{ padding: '9px 12px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8 }}>
        <span style={{ color: 'var(--fg-3)' }}>›</span>dep
        <span style={{ width: 1.5, height: 14, background: 'var(--fg)' }} />
      </div>
      <div style={{ padding: 4 }}>
        <div style={{ padding: '6px 8px', borderRadius: 6, background: 'var(--bg-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span><span style={{ color: 'var(--ac-text)' }}>Dep</span>loy to production</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>↵</span>
        </div>
        <div style={{ padding: '6px 8px', color: 'var(--fg-2)' }}>
          <span style={{ color: 'var(--ac-text)' }}>Dep</span>endencies
        </div>
      </div>
    </div>
  )
}

function MiniProgress() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
        <span style={{ color: 'var(--fg-2)' }}>Uploading</span>
        <span style={{ ...mono, fontSize: 11.5, color: 'var(--fg-3)' }}>64%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-3)', overflow: 'hidden' }}>
        <div style={{ width: '64%', height: '100%', borderRadius: 999, background: 'var(--ac)' }} />
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--bg-3)', overflow: 'hidden' }}>
        <div style={{ width: '28%', height: '100%', borderRadius: 999, background: 'var(--ok)' }} />
      </div>
    </div>
  )
}

function MiniSkeleton() {
  return (
    <div style={{ display: 'flex', gap: 12, width: 200, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-3)', flex: 'none' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-3)', width: '80%' }} />
        <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-3)', width: '100%' }} />
        <div style={{ height: 10, borderRadius: 5, background: 'var(--bg-3)', width: '55%' }} />
      </div>
    </div>
  )
}

function MiniDataGrid() {
  return (
    <div style={{ width: 220, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden', fontSize: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr', padding: '7px 10px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 10, letterSpacing: '.06em' }}>
        <span />
        <span>PROJECT</span>
        <span style={{ color: 'var(--fg)' }}>STATUS ↓</span>
      </div>
      {[
        ['veloce-docs', 'var(--ok)', true],
        ['api-gateway', 'var(--ok)', false],
        ['veloce-www', 'var(--err)', false],
      ].map(([name, dot, sel]) => (
        <div key={name as string} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr', alignItems: 'center', padding: '7px 10px', borderBottom: '1px solid var(--line)', background: sel ? 'var(--ac-soft)' : undefined }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, border: sel ? 'none' : '1px solid var(--line-2)', background: sel ? 'var(--ac)' : 'var(--bg)', display: 'inline-grid', placeItems: 'center', color: 'var(--ac-fg)', fontSize: 8, fontWeight: 700 }}>{sel ? '✓' : ''}</span>
          <span style={{ fontWeight: 500 }}>{name as string}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot as string }} />
            {dot === 'var(--err)' ? 'Failed' : 'Ready'}
          </span>
        </div>
      ))}
    </div>
  )
}

function MiniTextarea() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 200 }}>
      <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)' }}>Description</span>
      <div style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
        Fast, composable UI with
        <br />
        motion built in.
      </div>
      <span style={{ ...mono, fontSize: 10.5, alignSelf: 'flex-end' }}>42/200</span>
    </div>
  )
}

function MiniRadio() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--ac)', display: 'inline-grid', placeItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ac)' }} />
        </span>
        Hobby
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-2)' }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--line-2)' }} />
        Pro
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-2)' }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--line-2)' }} />
        Enterprise
      </div>
    </div>
  )
}

function MiniSlider() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
        <span style={{ color: 'var(--fg-2)' }}>Opacity</span>
        <span style={{ ...mono, fontSize: 11.5 }}>60</span>
      </div>
      <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', height: 5, borderRadius: 999, background: 'var(--bg-3)' }}>
          <div style={{ width: '60%', height: '100%', borderRadius: 999, background: 'var(--ac)' }} />
        </div>
        <span style={{ position: 'absolute', left: '60%', transform: 'translateX(-50%)', width: 15, height: 15, borderRadius: '50%', background: 'var(--bg)', border: '1.5px solid var(--ac)', boxShadow: 'var(--shadow-md)' }} />
      </div>
    </div>
  )
}

function MiniToggleGroup() {
  return (
    <div className="vl-seg" style={{ fontSize: 13 }}>
      <span className="vl-seg__item" style={{ padding: '6px 12px' }}>Left</span>
      <span className="vl-seg__item vl-seg__item--active" style={{ padding: '6px 12px' }}>Center</span>
      <span className="vl-seg__item" style={{ padding: '6px 12px' }}>Right</span>
    </div>
  )
}

function MiniSheet() {
  return (
    <div style={{ position: 'relative', width: 210, height: 120, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'oklch(0 0 0/.25)' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 110, background: 'var(--bg-2)', borderLeft: '1px solid var(--line-2)', boxShadow: 'var(--shadow-lg)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
          Filters<span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>✕</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-3)', width: '85%' }} />
        <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-3)', width: '65%' }} />
        <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-3)', width: '75%' }} />
      </div>
    </div>
  )
}

function MiniAlert() {
  return (
    <div style={{ display: 'flex', gap: 12, width: 210, padding: '12px 14px', borderRadius: 9, border: '1px solid color-mix(in oklab, var(--ok) 35%, transparent)', background: 'color-mix(in oklab, var(--ok) 10%, transparent)' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--ok)', color: 'oklch(0.15 0 0)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, flex: 'none', marginTop: 1 }}>✓</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Deploy succeeded</div>
        <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>Live in 14 regions</div>
      </div>
    </div>
  )
}

function MiniSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {[14, 20, 28].map((s) => (
        <span key={s} style={{ width: s, height: s, borderRadius: '50%', border: s === 28 ? '2.5px solid var(--ac)' : '2px solid var(--fg-3)', borderRightColor: 'transparent', animation: 'vl-spin .7s linear infinite' }} />
      ))}
    </div>
  )
}

function MiniEmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 190, textAlign: 'center' }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, border: '1px dashed var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-3)', fontSize: 15 }}>▤</span>
      <div style={{ fontSize: 13, fontWeight: 600 }}>No deployments yet</div>
      <span style={{ padding: '5px 11px', borderRadius: 6, background: 'var(--ac)', color: 'var(--ac-fg)', fontSize: 12, fontWeight: 500 }}>Deploy now</span>
    </div>
  )
}

function MiniAvatar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {[
        ['YK', 'oklch(0.55 0.12 292)'],
        ['MJ', 'oklch(0.6 0.12 200)'],
        ['AL', 'oklch(0.62 0.12 40)'],
      ].map(([txt, bg], i) => (
        <span key={txt} style={{ width: 34, height: 34, borderRadius: '50%', background: bg, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, border: '2px solid var(--bg-1)', marginLeft: i ? -8 : 0 }}>{txt}</span>
      ))}
      <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bg-3)', border: '2px solid var(--bg-1)', color: 'var(--fg-3)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 500, marginLeft: -8 }}>+2</span>
    </div>
  )
}

function MiniChip() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: 200, fontSize: 12.5 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 6px 0 12px', borderRadius: 999, background: 'var(--bg-3)' }}>
        React
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--line-2)', display: 'inline-grid', placeItems: 'center', fontSize: 9, color: 'var(--fg-3)' }}>✕</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--ac)', background: 'var(--ac-soft)', color: 'var(--ac-text)', fontWeight: 500 }}>✓ Motion</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 12px', borderRadius: 999, border: '1px solid var(--line-2)', background: 'transparent', color: 'var(--fg-2)' }}>Vue</span>
    </div>
  )
}

function MiniSeparator() {
  return (
    <div style={{ width: 200, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', fontSize: 12.5, overflow: 'hidden' }}>
      <div style={{ padding: '9px 12px', color: 'var(--fg-2)' }}>General</div>
      <div style={{ height: 1, background: 'var(--line)' }} />
      <div style={{ padding: '9px 12px', color: 'var(--fg-2)' }}>Members</div>
      <div style={{ height: 1, background: 'var(--line)' }} />
      <div style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10, ...mono, fontSize: 11 }}>
        Docs<span style={{ width: 1, height: 12, background: 'var(--line-2)' }} />API<span style={{ width: 1, height: 12, background: 'var(--line-2)' }} />CLI
      </div>
    </div>
  )
}

function MiniBreadcrumbs() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--fg-3)' }}>
      <span style={{ color: 'var(--fg-2)' }}>Dashboard</span>
      <span>›</span>
      <span>…</span>
      <span>›</span>
      <span style={{ color: 'var(--fg)', fontWeight: 500 }}>Settings</span>
    </div>
  )
}

function MiniPagination() {
  return (
    <div style={{ display: 'flex', gap: 5, fontSize: 12.5 }}>
      {['‹', '1', '2', '3', '…', '8', '›'].map((p) => (
        <span key={p} style={{ display: 'grid', placeItems: 'center', minWidth: 28, height: 28, padding: '0 4px', borderRadius: 7, border: p === '2' ? 'none' : '1px solid var(--line-2)', background: p === '2' ? 'var(--ac)' : 'var(--bg)', color: p === '2' ? 'var(--ac-fg)' : p === '…' ? 'var(--fg-3)' : 'var(--fg-2)', fontWeight: p === '2' ? 600 : 400 }}>{p}</span>
      ))}
    </div>
  )
}

function MiniStepper() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: 200 }}>
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--ac)', color: 'var(--ac-fg)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flex: 'none' }}>✓</span>
      <span style={{ flex: 1, height: 2, background: 'var(--ac)' }} />
      <span style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--ac)', boxShadow: '0 0 0 4px var(--ac-soft)', color: 'var(--ac-text)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, flex: 'none' }}>2</span>
      <span style={{ flex: 1, height: 2, background: 'var(--bg-3)' }} />
      <span style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--line-2)', color: 'var(--fg-3)', display: 'grid', placeItems: 'center', fontSize: 11, flex: 'none' }}>3</span>
    </div>
  )
}

function MiniLayout() {
  return (
    <div style={{ width: 200, padding: 10, borderRadius: 9, border: '1px dashed var(--line-2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ height: 16, borderRadius: 4, background: 'var(--bg-3)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <div style={{ height: 32, borderRadius: 4, background: 'var(--bg-3)' }} />
        <div style={{ height: 32, borderRadius: 4, background: 'var(--bg-3)' }} />
        <div style={{ height: 32, borderRadius: 4, background: 'var(--bg-3)' }} />
      </div>
      <div style={{ height: 12, borderRadius: 4, background: 'var(--bg-3)', width: '55%' }} />
    </div>
  )
}

function MiniNavbar() {
  return (
    <div style={{ width: 210, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--ac-soft)' }} />
        <div style={{ display: 'inline-flex', gap: 4 }}>
          <div style={{ width: 32, height: 10, borderRadius: 3, background: 'var(--bg-3)' }} />
          <div style={{ width: 28, height: 10, borderRadius: 3, background: 'var(--ac-soft)' }} />
          <div style={{ width: 24, height: 10, borderRadius: 3, background: 'var(--bg-3)' }} />
        </div>
        <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-3)' }} />
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 10, borderRadius: 3, background: 'var(--bg-3)', width: '70%' }} />
        <div style={{ height: 10, borderRadius: 3, background: 'var(--bg-3)', width: '85%' }} />
      </div>
    </div>
  )
}

function MiniSidebar() {
  return (
    <div style={{ width: 210, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '80px 1fr' }}>
      <div style={{ borderRight: '1px solid var(--line)', padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 8, borderRadius: 3, background: 'var(--bg-3)', width: '70%' }} />
        <div style={{ height: 10, borderRadius: 4, background: 'var(--ac-soft)' }} />
        <div style={{ height: 10, borderRadius: 4, background: 'var(--bg-3)' }} />
        <div style={{ height: 10, borderRadius: 4, background: 'var(--bg-3)' }} />
        <div style={{ height: 8, borderRadius: 3, background: 'var(--bg-3)', width: '55%', marginTop: 4 }} />
        <div style={{ height: 10, borderRadius: 4, background: 'var(--bg-3)' }} />
      </div>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 10, borderRadius: 3, background: 'var(--bg-3)' }} />
        <div style={{ height: 10, borderRadius: 3, background: 'var(--bg-3)', width: '75%' }} />
        <div style={{ height: 10, borderRadius: 3, background: 'var(--bg-3)', width: '55%' }} />
      </div>
    </div>
  )
}

function MiniMotionUtils() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 190 }}>
      {['82%', '100%', '64%'].map((w, i) => (
        <div key={w} style={{ height: 12, width: w, borderRadius: 6, background: i === 1 ? 'var(--ac)' : 'var(--bg-3)', animation: 'vl-in .4s both', animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  )
}

function MiniTable() {
  return (
    <div style={{ width: 210, borderRadius: 9, border: '1px solid var(--line-2)', background: 'var(--bg)', overflow: 'hidden', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .8fr', padding: '7px 10px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', ...mono, fontSize: 10, letterSpacing: '.06em' }}>
        <span>PLAN</span>
        <span>MRR</span>
        <span>±</span>
      </div>
      {[
        ['Hobby', '$9.2k', '+4.1%', 'var(--ok)'],
        ['Pro', '$86.8k', '+12.8%', 'var(--ok)'],
        ['Enterprise', '$128.4k', '−0.6%', 'var(--err)'],
      ].map(([plan, mrr, delta, color], i) => (
        <div key={plan} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .8fr', padding: '7px 10px', background: i % 2 ? 'var(--bg-1)' : undefined }}>
          <span style={{ fontWeight: 500 }}>{plan}</span>
          <span style={{ color: 'var(--fg-2)' }}>{mrr}</span>
          <span style={{ color }}>{delta}</span>
        </div>
      ))}
    </div>
  )
}

interface Tile {
  name: string
  tag: string
  cat: Category
  lift?: boolean
  to?: string
  mini: ReactNode
}

const TILES: Tile[] = [
  { name: 'Button', tag: 'press 120ms', cat: 'Primitives', to: '/components/button', mini: <MiniButton /> },
  { name: 'Input', tag: 'ring 150ms', cat: 'Forms', to: '/components/input', mini: <MiniInput /> },
  { name: 'Select', tag: 'unfold 200ms', cat: 'Forms', to: '/components/select', mini: <MiniSelect /> },
  { name: 'Dialog', tag: 'scale-fade 200ms', cat: 'Overlays', lift: true, to: '/components/dialog', mini: <MiniDialog /> },
  { name: 'Dropdown', tag: 'unfold 180ms', cat: 'Overlays', to: '/components/dropdown', mini: <MiniDropdown /> },
  { name: 'Tooltip', tag: 'rise 150ms', cat: 'Overlays', to: '/components/tooltip', mini: <MiniTooltip /> },
  { name: 'Tabs', tag: 'slide 200ms', cat: 'Forms', to: '/components/tabs', mini: <MiniTabs /> },
  { name: 'Toast', tag: 'slide-in 250ms', cat: 'Feedback', to: '/components/toast', mini: <MiniToast /> },
  { name: 'Switch', tag: 'thumb 180ms', cat: 'Forms', to: '/components/switch', mini: <MiniSwitch /> },
  { name: 'Checkbox', tag: 'draw 150ms', cat: 'Forms', to: '/components/checkbox', mini: <MiniCheckbox /> },
  { name: 'Textarea', tag: 'ring 150ms', cat: 'Forms', to: '/components/textarea', mini: <MiniTextarea /> },
  { name: 'Radio', tag: 'dot 150ms', cat: 'Forms', to: '/components/radio', mini: <MiniRadio /> },
  { name: 'Slider', tag: 'thumb 180ms', cat: 'Forms', to: '/components/slider', mini: <MiniSlider /> },
  { name: 'Toggle group', tag: 'slide 200ms', cat: 'Forms', to: '/components/toggle-group', mini: <MiniToggleGroup /> },
  { name: 'Sheet', tag: 'slide 250ms', cat: 'Overlays', to: '/components/sheet', mini: <MiniSheet /> },
  { name: 'Alert', tag: 'fade 150ms', cat: 'Feedback', to: '/components/alert', mini: <MiniAlert /> },
  { name: 'Spinner', tag: 'spin 800ms', cat: 'Feedback', to: '/components/spinner', mini: <MiniSpinner /> },
  { name: 'Empty state', tag: 'stagger 40ms', cat: 'Feedback', to: '/components/empty-state', mini: <MiniEmptyState /> },
  { name: 'Progress', tag: 'fill 300ms', cat: 'Feedback', to: '/components/progress', mini: <MiniProgress /> },
  { name: 'Skeleton', tag: 'shimmer 1.2s', cat: 'Feedback', to: '/components/skeleton', mini: <MiniSkeleton /> },
  { name: 'Data grid', tag: 'settle 250ms', cat: 'Data', to: '/components/data-grid', mini: <MiniDataGrid /> },
  { name: 'Table', tag: 'unfold 200ms', cat: 'Data', to: '/components/table', mini: <MiniTable /> },
  { name: 'Accordion', tag: 'height 250ms', cat: 'Navigation', to: '/components/accordion', mini: <MiniAccordion /> },
  { name: 'Popover', tag: 'scale-fade 180ms', cat: 'Overlays', to: '/components/popover', mini: <MiniPopover /> },
  { name: 'Card', tag: 'lift 200ms', cat: 'Primitives', to: '/components/card', mini: <MiniCard /> },
  { name: 'Badge', tag: 'static', cat: 'Primitives', to: '/components/badge', mini: <MiniBadge /> },
  { name: 'Command Palette', tag: 'drop 200ms', cat: 'Overlays', to: '/components/command', mini: <MiniCommandPalette /> },
  { name: 'Avatar', tag: 'crossfade 200ms', cat: 'Primitives', to: '/components/avatar', mini: <MiniAvatar /> },
  { name: 'Chip', tag: 'exit 150ms', cat: 'Primitives', to: '/components/chip', mini: <MiniChip /> },
  { name: 'Separator', tag: 'static', cat: 'Primitives', to: '/components/separator', mini: <MiniSeparator /> },
  { name: 'Breadcrumbs', tag: 'static', cat: 'Navigation', to: '/components/breadcrumbs', mini: <MiniBreadcrumbs /> },
  { name: 'Pagination', tag: 'slide 200ms', cat: 'Navigation', to: '/components/pagination', mini: <MiniPagination /> },
  { name: 'Stepper', tag: 'fill 250ms', cat: 'Navigation', to: '/components/stepper', mini: <MiniStepper /> },
  { name: 'Navbar', tag: 'sticky 56px', cat: 'Navigation', to: '/components/navbar', mini: <MiniNavbar /> },
  { name: 'Sidebar', tag: 'collapse 200ms', cat: 'Navigation', to: '/components/sidebar', mini: <MiniSidebar /> },
  { name: 'Layout', tag: 'zero JS', cat: 'Layout', to: '/components/layout', mini: <MiniLayout /> },
  { name: 'Motion utils', tag: 'stagger 60ms', cat: 'Motion', to: '/components/motion-utilities', mini: <MiniMotionUtils /> },
]

export default function Gallery() {
  const { hash } = useLocation()
  const [filter, setFilter] = useState<'All' | Category>(() => HASH_TO_CATEGORY[hash] ?? 'All')

  useEffect(() => {
    const cat = HASH_TO_CATEGORY[hash]
    if (cat) setFilter(cat)
  }, [hash])

  const visible = filter === 'All' ? TILES : TILES.filter((t) => t.cat === filter)

  return (
    <DocsShell sidebar={DOCS_SIDEBAR}>
      <div className="gal">
        <div className="gal__head">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 className="gal__h1">Components</h1>
            <p className="gal__sub">35 production components. Hover any tile to see its enter choreography.</p>
          </div>
          <div className="gal__pills">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`gal__pill${filter === f ? ' gal__pill--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="gal__grid">
          {visible.map((t) => {
            const cls = `gal__tile${t.lift ? ' gal__tile--lift' : ''}`
            const inner = (
              <>
                <div className="gal__stage">{t.mini}</div>
                <div className="gal__foot">
                  <span className="gal__name">{t.name}</span>
                  <span className="gal__tag">{t.tag}</span>
                </div>
              </>
            )
            return t.to ? (
              <Link key={t.name} to={t.to} className={cls} style={{ color: 'inherit' }}>
                {inner}
              </Link>
            ) : (
              <div key={t.name} className={cls}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </DocsShell>
  )
}
