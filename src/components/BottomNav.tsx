import { useI18n } from '../i18n/index.tsx'
import { Icon } from './Icon.tsx'
import type { IconName } from './Icon.tsx'

export const NAV_TABS = [
  { id: 'market', path: '/', icon: 'store' },
  { id: 'lots', path: '/lots', icon: 'package' },
  { id: 'buyers', path: '/buyers', icon: 'users' },
  { id: 'money', path: '/money', icon: 'wallet' },
] as const satisfies readonly { id: string; path: string; icon: IconName }[]

export type NavTab = (typeof NAV_TABS)[number]['id']

type Props = {
  active: NavTab
  onSelect: (tab: NavTab, path: string) => void
}

/** Four items, icon plus Marathi word. Only on home, lots, buyers, money. */
export function BottomNav({ active, onSelect }: Props) {
  const { t } = useI18n()
  return (
    <nav className="bottomnav" aria-label={t('nav.market')}>
      {NAV_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="bottomnav__item"
          aria-current={active === tab.id ? 'page' : undefined}
          onClick={() => onSelect(tab.id, tab.path)}
        >
          <Icon name={tab.icon} className="bottomnav__icon" />
          <span className="bottomnav__word">{t(`nav.${tab.id}`)}</span>
        </button>
      ))}
    </nav>
  )
}
