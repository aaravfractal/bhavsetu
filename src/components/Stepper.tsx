import { useI18n } from '../i18n/index.tsx'
import { formatNumber } from '../lib/format.ts'
import { Icon } from './Icon.tsx'

type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  step?: number
  /** Marathi unit word under the number, e.g. क्विंटल. */
  unitKey?: string
  label: string
}

/** Big stepper — 56px targets, no keyboard needed. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  unitKey = 'units.quintal',
  label,
}: Props) {
  const { t, locale } = useI18n()
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label={`${label} −${formatNumber(step, locale)}`}
      >
        <Icon name="minus" />
      </button>
      <div>
        <div className="stepper__value" aria-live="polite">
          {formatNumber(value, locale)}
        </div>
        <div className="stepper__unit">{t(unitKey)}</div>
      </div>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label={`${label} +${formatNumber(step, locale)}`}
      >
        <Icon name="plus" />
      </button>
    </div>
  )
}
