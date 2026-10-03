import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cx } from '../utils/cx'

export type CardPadding = 'sm' | 'md' | 'lg'

export interface CardProps extends ComponentProps<'div'> {
  padding?: CardPadding
  elevated?: boolean
  children?: ReactNode
}

const padMap: Record<CardPadding, string> = {
  sm: '12px',
  md: '20px',
  lg: '28px',
}

function CardRoot({ padding = 'md', elevated, style, className, children, ...rest }: CardProps) {
  const styles: CSSProperties = {
    background: 'var(--bg-1)',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-xl)',
    padding: padMap[padding],
    boxShadow: elevated ? 'var(--shadow-md)' : undefined,
    color: 'var(--fg)',
    fontFamily: 'var(--font-sans)',
  }
  return (
    <div
      data-vl-card=""
      data-elevated={elevated ? '' : undefined}
      className={cx('vl-card', className)}
      style={{ ...styles, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

function CardHeader({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-card__header', className)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
        fontWeight: 600,
        color: 'var(--fg)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function CardBody({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-card__body', className)}
      style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.5, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}

function CardFooter({ style, className, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cx('vl-card__footer', className)}
      style={{
        marginTop: 16,
        paddingTop: 12,
        borderTop: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
