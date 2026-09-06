import { Gallery } from './screens/Gallery.tsx'
import { useI18n } from './i18n/index.tsx'
import { LocaleSwitcher } from './components/LocaleSwitcher.tsx'
import { linkProps, useRoute } from './lib/router.ts'

/**
 * Session 2 ships the design system and /gallery. The farmer screens land in
 * Sessions 3-10 (docs/roadmap.md); until then every other route falls through
 * to this placeholder rather than pretending to be Home.
 */
function Placeholder() {
  const { t } = useI18n()
  return (
    <main
      style={{
        maxWidth: 'var(--sz-frame-w)',
        margin: '0 auto',
        padding: 'var(--sp-screen)',
        display: 'grid',
        gap: 'var(--sp-l)',
      }}
    >
      <div className="pair">
        <h1 className="text-heading">{t('app.name')}</h1>
        <p className="text-en">{t('app.tagline')}</p>
      </div>
      <LocaleSwitcher />
      <a className="btn btn--primary btn--block" {...linkProps('/gallery')}>
        {t('gallery.title')}
      </a>
      <p className="text-en">
        Screens land in Sessions 3-10. See docs/roadmap.md.
      </p>
    </main>
  )
}

export default function App() {
  const route = useRoute()
  return route === '/gallery' ? <Gallery /> : <Placeholder />
}
