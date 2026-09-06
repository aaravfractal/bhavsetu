import { useI18n } from '../i18n/index.tsx'
import { Icon } from './Icon.tsx'

/** 72px Kanda circle, floats above the nav, centre. Voice is a first-class control. */
export function MicFAB({ onClick }: { onClick?: () => void }) {
  const { t } = useI18n()
  return (
    <button type="button" className="micfab" onClick={onClick}>
      <Icon name="mic" style={{ fontSize: 'var(--sz-icon)' }} />
      <span className="micfab__word">{t('voice.mic')}</span>
    </button>
  )
}
