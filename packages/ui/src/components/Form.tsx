/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  cloneElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from '../utils/cx'

interface FormFieldCtx {
  id: string
  descriptionId: string
  errorId: string
  invalid: boolean
}

const FieldContext = createContext<FormFieldCtx | null>(null)

export interface FormProps extends ComponentProps<'form'> {}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form(
  { children, className, style, ...rest },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cx('vl-form', className)}
      style={{ display: 'flex', flexDirection: 'column', gap: 18, ...style }}
      {...rest}
    >
      {children}
    </form>
  )
})

export interface FormFieldProps {
  name?: string
  invalid?: boolean
  children: ReactNode
  className?: string
}

function Field({ invalid = false, children, className }: FormFieldProps) {
  const uid = useId().replace(/:/g, '')
  const ctx: FormFieldCtx = {
    id: `vl-field-${uid}`,
    descriptionId: `vl-field-${uid}-desc`,
    errorId: `vl-field-${uid}-err`,
    invalid,
  }
  return (
    <FieldContext.Provider value={ctx}>
      <div className={cx('vl-form-field', className)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </FieldContext.Provider>
  )
}

export interface FormLabelProps extends ComponentProps<'label'> {
  required?: boolean
  optional?: boolean
}

function Label({ required, optional, children, style, ...rest }: FormLabelProps) {
  const ctx = useContext(FieldContext)
  return (
    <label
      htmlFor={ctx?.id}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 13, fontWeight: 500, color: 'var(--fg)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {required && <span aria-hidden style={{ color: 'var(--ac-text)' }}>*</span>}
      {optional && !required && <span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 400 }}>(optional)</span>}
    </label>
  )
}

export interface FormControlProps {
  children: ReactElement
}

function Control({ children }: FormControlProps) {
  const ctx = useContext(FieldContext)
  if (!ctx) return children
  const child = children as ReactElement<Record<string, any>>
  const existingDescribed = child.props['aria-describedby'] as string | undefined
  const describedBy = [existingDescribed, ctx.descriptionId, ctx.invalid ? ctx.errorId : undefined].filter(Boolean).join(' ') || undefined
  return cloneElement(child, {
    id: ctx.id,
    'aria-describedby': describedBy,
    'aria-invalid': ctx.invalid || child.props['aria-invalid'],
  })
}

export interface FormDescriptionProps extends ComponentProps<'span'> {}
function Description({ children, style, ...rest }: FormDescriptionProps) {
  const ctx = useContext(FieldContext)
  return (
    <span id={ctx?.descriptionId} style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5, ...style }} {...rest}>
      {children}
    </span>
  )
}

export interface FormErrorProps extends ComponentProps<'span'> {}
function ErrorMsg({ children, style, ...rest }: FormErrorProps) {
  const ctx = useContext(FieldContext)
  if (!children) return null
  return (
    <span id={ctx?.errorId} role="alert" style={{ fontSize: 12, color: 'var(--err)', lineHeight: 1.5, ...style }} {...rest}>
      {children}
    </span>
  )
}

export const Form = Object.assign(FormRoot, {
  Field,
  Label,
  Control,
  Description,
  Error: ErrorMsg,
})
