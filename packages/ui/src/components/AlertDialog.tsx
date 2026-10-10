import { type CSSProperties, type ReactNode } from 'react'
import { Dialog } from './Dialog'

export type AlertDialogTone = 'default' | 'destructive'

export interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Short, imperative title: "Delete workspace?" */
  title: string
  /** Longer explanation of consequences. */
  description?: ReactNode
  /** Confirm button label. */
  confirmLabel?: string
  /** Cancel button label. */
  cancelLabel?: string
  /** Called when the user confirms. The dialog closes after this returns. */
  onConfirm?: () => void
  /** Called when the user cancels or dismisses. */
  onCancel?: () => void
  /** `destructive` colors the confirm button red. */
  tone?: AlertDialogTone
  className?: string
  style?: CSSProperties
}

const baseButton: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  fontSize: 13.5,
  fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'background 150ms var(--ease-swift-out)',
}

/** Confirmation dialog. Blocks until the user picks Confirm or Cancel.
 *  Use for destructive or irreversible actions where a plain Dialog would be too soft. */
export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  tone = 'default',
  className,
  style,
}: AlertDialogProps) {
  const close = (next: boolean) => {
    if (!next) onCancel?.()
    onOpenChange(next)
  }
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }
  return (
    <Dialog
      open={open}
      onOpenChange={close}
      title={title}
      description={typeof description === 'string' ? description : undefined}
      className={className}
      style={style}
    >
      {typeof description !== 'string' && description && (
        <Dialog.Body>{description}</Dialog.Body>
      )}
      <Dialog.Footer>
        <button
          onClick={() => close(false)}
          style={{
            ...baseButton,
            background: 'var(--bg-2)',
            color: 'var(--fg)',
            borderColor: 'var(--line-2)',
          }}
        >
          {cancelLabel}
        </button>
        <button
          onClick={handleConfirm}
          autoFocus
          style={{
            ...baseButton,
            background: tone === 'destructive' ? 'var(--err)' : 'var(--ac)',
            color: tone === 'destructive' ? 'oklch(0.99 0 0)' : 'var(--ac-fg)',
            boxShadow: 'inset 0 1px 0 oklch(1 0 0/.2)',
          }}
        >
          {confirmLabel}
        </button>
      </Dialog.Footer>
    </Dialog>
  )
}
