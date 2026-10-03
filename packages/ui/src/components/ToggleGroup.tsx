import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

type ToggleGroupType = 'single' | 'multiple'

interface ToggleGroupCtx {
  type: ToggleGroupType
  value: string | string[] | undefined
  onValueChange?: (v: any) => void
  disabled?: boolean
}

const Ctx = createContext<ToggleGroupCtx | null>(null)

interface SingleProps {
  type: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
}
interface MultipleProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (v: string[]) => void
}

export type ToggleGroupProps = (SingleProps | MultipleProps) &
  Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> & {
    disabled?: boolean
  }

const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroupRoot(
  props,
  ref,
) {
  const { type, value, onValueChange, disabled, className, style, children, ...rest } = props as any
  return (
    <Ctx.Provider value={{ type, value, onValueChange, disabled }}>
      <div
        ref={ref}
        role="group"
        data-vl-toggle-group=""
        data-type={type}
        className={cx('vl-toggle-group', className)}
        style={{
          display: 'inline-flex',
          gap: 4,
          padding: 4,
          borderRadius: 'var(--r-md)',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

export interface ToggleGroupItemProps extends Omit<ComponentProps<'button'>, 'value'> {
  value: string
  children?: ReactNode
}

const Item = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function Item(
  { value, children, className, style, disabled, onClick, ...rest },
  ref,
) {
  const ctx = useContext(Ctx)
  const selected =
    ctx?.type === 'single' ? ctx?.value === value : Array.isArray(ctx?.value) && ctx.value.includes(value)
  const isDisabled = disabled || ctx?.disabled
  const base: CSSProperties = {
    minHeight: 28,
    padding: '0 10px',
    border: 'none',
    borderRadius: 'var(--r-sm)',
    background: `var(--vl-toggle-bg, ${selected ? 'var(--bg-1)' : 'transparent'})`,
    color: `var(--vl-toggle-fg, ${selected ? 'var(--fg)' : 'var(--fg-2)'})`,
    boxShadow: selected ? 'var(--shadow-sm)' : 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.55 : 1,
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...style,
  }
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || isDisabled) return
    if (ctx?.type === 'single') {
      ctx?.onValueChange?.(selected ? '' : value)
    } else if (ctx?.type === 'multiple') {
      const cur = Array.isArray(ctx.value) ? ctx.value : []
      ctx?.onValueChange?.(selected ? cur.filter((v) => v !== value) : [...cur, value])
    }
  }
  return (
    <button
      ref={ref}
      type="button"
      data-vl-toggle-group-item=""
      data-value={value}
      data-state={selected ? 'on' : 'off'}
      aria-pressed={selected}
      disabled={isDisabled}
      className={cx('vl-toggle-group__item', className)}
      style={base}
      onClick={handle}
      {...rest}
    >
      {children}
    </button>
  )
})

export const ToggleGroup = Object.assign(ToggleGroupRoot, { Item })
