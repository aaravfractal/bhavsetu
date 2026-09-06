import { useI18n } from '../i18n/index.tsx'
import { Icon } from './Icon.tsx'

type Props = {
  /** When the cached data was fetched. Shown so stale data is never silent. */
  fetchedAt?: string
  /** Compact badge for the header, or the full banner under it. */
  variant?: 'badge' | 'banner'
}

/**
 * Dhool chrome. Pair it with `.is-stale` on the screen wrapper so the rest of
 * the chrome greys out too — a screen without its offline state is not done.
 */
export function OfflinePill({ fetchedAt, variant = 'banner' }: Props) {
  const { t } = useI18n()
  const text = variant === 'badge' ? t('offline.badge', { time: fetchedAt ?? '—' }) : t('offline.banner')

  return (
    <p className={variant === 'badge' ? 'pill pill--offline' : 'offline-banner'} role="status">
      <Icon name="wifiOff" style={{ fontSize: 'var(--sz-icon-small)', flex: 'none' }} />
      <span>{text}</span>
    </p>
  )
}
