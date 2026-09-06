import { useI18n } from '../i18n/index.tsx'
import { Icon } from './Icon.tsx'

/** Top right on every farmer screen. Reads the screen aloud. */
export function SpeakerButton({ onClick }: { onClick?: () => void }) {
  const { t } = useI18n()
  return (
    <button type="button" className="speaker" onClick={onClick}>
      <Icon name="speaker" style={{ fontSize: 'var(--sz-icon)' }} />
      <span className="speaker__word">{t('voice.speaker')}</span>
    </button>
  )
}
