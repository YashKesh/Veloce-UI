import { useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react'
import { cx } from '../utils/cx'

export interface FileUploadProps {
  value?: File[]
  defaultValue?: File[]
  onValueChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  /** Custom slot inside the dropzone. If omitted, default copy renders. */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

function humanBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  value,
  defaultValue = [],
  onValueChange,
  accept,
  multiple,
  maxSize,
  disabled,
  children,
  className,
  style,
}: FileUploadProps) {
  const [internal, setInternal] = useState<File[]>(defaultValue)
  const files = value ?? internal
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const commit = (next: File[]) => {
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const incoming = Array.from(list)
    if (maxSize) {
      const bad = incoming.find((f) => f.size > maxSize)
      if (bad) { setError(`"${bad.name}" exceeds ${humanBytes(maxSize)}`); return }
    }
    setError(null)
    commit(multiple ? [...files, ...incoming] : incoming.slice(0, 1))
  }

  const remove = (idx: number) => {
    commit(files.filter((_, i) => i !== idx))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className={cx('vl-file-upload', className)} style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          padding: 24,
          border: `2px dashed ${dragging ? 'var(--ac)' : 'var(--line-2)'}`,
          borderRadius: 12,
          background: dragging ? 'var(--ac-soft)' : 'var(--bg-1)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          color: 'var(--fg-2)',
          fontSize: 13.5,
          opacity: disabled ? 0.6 : 1,
          transition: 'background 150ms, border-color 150ms',
        }}
      >
        {children ?? (
          <>
            <div style={{ fontSize: 24, color: 'var(--fg-3)', marginBottom: 6 }}>⇡</div>
            <div style={{ color: 'var(--fg)', fontWeight: 500, marginBottom: 2 }}>Drop files here or click to browse</div>
            <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
              {accept ? `Accepts ${accept}` : 'Any file type'}{maxSize ? ` · up to ${humanBytes(maxSize)}` : ''}
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
          style={{ display: 'none' }}
        />
      </div>
      {error && <div style={{ fontSize: 12.5, color: 'var(--err)' }}>{error}</div>}
      {files.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {files.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 8, background: 'var(--bg)', fontSize: 13 }}>
              <span style={{ fontSize: 16, color: 'var(--fg-3)' }}>📄</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--fg)' }}>{f.name}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>{humanBytes(f.size)}</span>
              <button
                aria-label={`Remove ${f.name}`}
                onClick={() => remove(i)}
                style={{ background: 'none', border: 'none', color: 'var(--fg-3)', cursor: 'pointer', fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
