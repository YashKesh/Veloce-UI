import { useState, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface TreeNode {
  id: string
  label: ReactNode
  icon?: ReactNode
  children?: TreeNode[]
}

export interface TreeProps extends Omit<ComponentProps<'ul'>, 'onSelect'> {
  data: TreeNode[]
  defaultExpandedIds?: string[]
  selectedId?: string
  onSelect?: (id: string) => void
}

export function Tree({
  data,
  defaultExpandedIds = [],
  selectedId,
  onSelect,
  className,
  style,
  ...rest
}: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedIds))

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <ul
      role="tree"
      className={cx('vl-tree', className)}
      style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 13.5, ...style }}
      {...rest}
    >
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}

function TreeItem({
  node,
  depth,
  expanded,
  toggle,
  selectedId,
  onSelect,
}: {
  node: TreeNode
  depth: number
  expanded: Set<string>
  toggle: (id: string) => void
  selectedId?: string
  onSelect?: (id: string) => void
}) {
  const hasChildren = (node.children?.length ?? 0) > 0
  const isOpen = expanded.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-selected={isSelected}>
      <div
        onClick={() => {
          if (hasChildren) toggle(node.id)
          onSelect?.(node.id)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 8px',
          paddingLeft: 8 + depth * 16,
          borderRadius: 6,
          cursor: 'pointer',
          background: isSelected ? 'var(--ac-soft)' : 'transparent',
          color: isSelected ? 'var(--ac-text)' : 'var(--fg)',
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        <span style={{ width: 14, display: 'inline-flex', justifyContent: 'center', color: 'var(--fg-3)' }}>
          {hasChildren ? (isOpen ? '▾' : '▸') : ''}
        </span>
        {node.icon && <span style={{ color: 'var(--fg-2)' }}>{node.icon}</span>}
        <span>{node.label}</span>
      </div>
      {hasChildren && isOpen && (
        <ul role="group" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
