import type { ReactNode } from 'react'
import { useI18n } from '../i18n/index.tsx'

type Props = {
  /** 0-5 filled segments. */
  score: number
  /** One plain-language line. Under 3 segments it renders in Haldi. */
  reason: ReactNode
}

const SEGMENTS = 5

/** A single filled bar, five segments, Paan. Never a star rating. */
export function TrustBar({ score, reason }: Props) {
  const { t } = useI18n()
  const filled = Math.max(0, Math.min(SEGMENTS, Math.round(score)))
  const warn = filled < 3

  return (
    <div className="trust">
      <div
        className="trust__track"
        role="img"
        aria-label={`${t('trust.label')} ${filled}/${SEGMENTS}`}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={`trust__seg${i < filled ? ' trust__seg--on' : ''}`} />
        ))}
      </div>
      <p className={`trust__reason${warn ? ' trust__reason--warn' : ''}`}>{reason}</p>
    </div>
  )
}
