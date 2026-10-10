import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface ContextMenuProps {
  children: ReactNode
  /** The menu items. Rendered inside a positioned popup when the user right-clicks. */
  items: ContextMenuItemDef[]
}

export interface ContextMenuItemDef {
  label: ReactNode
  onSelect?: () => void
  disabled?: boolean
  separator?: boolean
  tone?: 'default' | 'danger'
}

export function ContextMenu({ children, items }: ContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!pos) return
    const handle = (e: MouseEvent | KeyboardEvent) => {
      if ('key' in e && e.key === 'Escape') setPos(null)
      if ('type' in e && e.type === 'mousedown') {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) setPos(null)
      }
    }
    window.addEventListener('mousedown', handle as EventListener)
    window.addEventListener('keydown', handle as EventListener)
    return () => {
      window.removeEventListener('mousedown', handle as EventListener)
      window.removeEventListener('keydown', handle as EventListener)
    }
  }, [pos])

  const open = (e: React.MouseEvent) => {
    e.preventDefault()
    setPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div onContextMenu={open} style={{ display: 'contents' }}>
        {children}
      </div>
      {pos && (
        <div
          ref={menuRef}
          role="menu"
          className={cx('vl-context-menu')}
          style={{
            position: 'fixed',
            top: pos.y,
            left: pos.x,
            zIndex: 1000,
            minWidth: 180,
            padding: 4,
            borderRadius: 9,
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: 13,
            animation: 'vl-in .15s cubic-bezier(.16,1,.3,1) both',
          }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={`sep-${i}`} style={{ height: 1, background: 'var(--line)', margin: '4px 0' }} />
            ) : (
              <button
                key={i}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect?.()
                  setPos(null)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 9px',
                  borderRadius: 6,
                  background: 'transparent',
                  color: item.tone === 'danger' ? 'var(--err)' : item.disabled ? 'var(--fg-3)' : 'var(--fg-2)',
                  fontSize: 13,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { if (!item.disabled) (e.currentTarget.style.background = 'var(--bg-3)') }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </>
  )
}

export interface ContextMenuTargetProps extends ComponentProps<'div'> {}
export const ContextMenuTarget = (props: ContextMenuTargetProps) => {
  const style: CSSProperties = {
    userSelect: 'none',
    ...props.style,
  }
  return <div {...props} style={style} />
}
