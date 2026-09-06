import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/index.tsx'
import { Icon } from './Icon.tsx'

type Props = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
}

/** Bottom sheet. No entrance animation — motion is for confirmation only. */
export function Sheet({ open, onClose, title, children }: Props) {
  const { t } = useI18n()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="sheet__scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
      >
        <div className="sheet__grip" />
        <div className="sheet__head">
          <h2 className="text-heading">{title}</h2>
          <button
            type="button"
            className="sheet__close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <Icon name="close" style={{ fontSize: 'var(--sz-icon)' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
