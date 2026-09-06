import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/index.tsx'
import type { Verdict } from '../tokens/theme.ts'
import { Icon } from './Icon.tsx'
import { Sheet } from './Sheet.tsx'

const WORD_KEY: Record<Verdict, string> = {
  sell: 'verdict.sell',
  hold: 'verdict.hold',
  warn: 'verdict.warn',
}

type Props = {
  verdict: Verdict
  /**
   * Up to three plain-Marathi reasons drawn from the forecast inputs.
   * CLAUDE.md rule 11: a verdict is never bare. Passing none is a bug, so the
   * badge says so in dev rather than opening an empty sheet.
   */
  reasons: ReactNode[]
  /** Optional lead line inside the sheet, e.g. the 8-days-to-target sentence. */
  detail?: ReactNode
  className?: string
}

/**
 * The one-word verdict. Tiro Devanagari Marathi, locked colour mapping
 * (Sell=Paan, Hold=Haldi, Warning=Mirchi), and always tappable.
 */
export function VerdictBadge({ verdict, reasons, detail, className }: Props) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const id = useId()
  const shown = reasons.slice(0, 3)

  if (import.meta.env.DEV && shown.length === 0) {
    console.warn(`[verdict] "${verdict}" rendered with no reasons — rule 11`)
  }

  return (
    <>
      <button
        type="button"
        id={id}
        className={['verdict', `verdict--${verdict}`, className ?? ''].filter(Boolean).join(' ')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="verdict__word">{t(WORD_KEY[verdict])}</span>
        <span className="verdict__hint">{t('verdict.reasonsHint')}</span>
        <Icon name="chevronRight" className="verdict__chevron" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={t('verdict.reasonsTitle')}>
        <div className={`verdict--${verdict}`} style={{ background: 'transparent', border: 0 }}>
          <p className="verdict__word" style={{ margin: 0 }}>
            {t(WORD_KEY[verdict])}
          </p>
          {detail ? <p className="text-label">{detail}</p> : null}
          <ul className="reasons" style={{ marginTop: 'var(--sp-m)' }}>
            {shown.map((reason, i) => (
              <li className="reasons__item" key={i}>
                <span className="reasons__marker" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </Sheet>
    </>
  )
}
