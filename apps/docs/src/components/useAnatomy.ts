import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'

export interface AnatomyTreeRow {
  id: string
  parent?: string
  depth: number
  chev?: string
  icon?: string
  label: unknown
  meta?: string
  role?: string
}

export type FocusForFn = (id: string | null) => string[] | null

const fade: CSSProperties = {
  transition: 'opacity 200ms var(--easing-standard, cubic-bezier(.22,1,.36,1))',
}

function computeVisible<T extends AnatomyTreeRow>(
  tree: T[],
  open: Record<string, boolean>,
): T[] {
  const byId: Record<string, T> = {}
  tree.forEach((r) => {
    byId[r.id] = r
  })
  return tree.filter((r) => {
    let cur: T | undefined = r
    while (cur && cur.parent) {
      const p: T | undefined = byId[cur.parent]
      if (!p) return true
      if (!open[p.id]) return false
      cur = p
    }
    return true
  })
}

export function useAnatomy<T extends AnatomyTreeRow>(
  tree: T[],
  focusFor: FocusForFn,
  defaultSelected: string,
  initialOpen?: (parents: Set<string>) => Record<string, boolean>,
) {
  const parents = useMemo(() => {
    const s = new Set<string>()
    tree.forEach((r) => {
      if (r.parent) s.add(r.parent)
    })
    return s
  }, [tree])

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    if (initialOpen) return initialOpen(parents)
    const o: Record<string, boolean> = {}
    parents.forEach((id) => {
      o[id] = true
    })
    return o
  })

  const [selected, setSelected] = useState<string | null>(defaultSelected)
  const treeRef = useRef<HTMLDivElement>(null)

  const focusSet = focusFor(selected)
  const isDimmed = (role?: string) =>
    focusSet !== null && !!role && !focusSet.includes(role)

  const onRowClick = (row: T, e: MouseEvent) => {
    if (e.altKey) {
      const next: Record<string, boolean> = {}
      parents.forEach((id) => {
        next[id] = true
      })
      setOpen(next)
    } else if (parents.has(row.id)) {
      setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
    }
    setSelected(row.id)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const vis = computeVisible(tree, open)
    const current = (document.activeElement as HTMLElement | null)?.dataset.node
    const i = current ? vis.findIndex((r) => r.id === current) : -1
    const next =
      vis[
        Math.min(
          vis.length - 1,
          Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)),
        )
      ]
    if (next)
      treeRef.current
        ?.querySelector<HTMLButtonElement>(`[data-node="${next.id}"]`)
        ?.focus()
  }

  const vis = computeVisible(tree, open)

  const selectedRole = useMemo(() => {
    const node = tree.find((r) => r.id === selected)
    return node?.role
  }, [tree, selected])

  const dimStyle = (role?: string, overrideSelectedRole?: string): CSSProperties => {
    const effectiveSelected = overrideSelectedRole ?? selectedRole
    const isSelected = !!role && role === effectiveSelected
    return {
      opacity: isDimmed(role) ? 0.3 : 1,
      boxShadow: isSelected
        ? '0 0 0 2px var(--ac), 0 0 0 4px color-mix(in oklch, var(--ac) 25%, transparent)'
        : undefined,
      borderRadius: isSelected ? 8 : undefined,
      ...fade,
      transition:
        'opacity 200ms var(--easing-standard, cubic-bezier(.22,1,.36,1)), box-shadow 180ms ease-out',
    }
  }

  return {
    vis,
    open,
    selected,
    selectedRole,
    parents,
    isDimmed,
    dimStyle,
    onRowClick,
    onKeyDown,
    treeRef,
  }
}
