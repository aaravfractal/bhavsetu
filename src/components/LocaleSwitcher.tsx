import { LOCALES, useI18n } from '../i18n/index.tsx'

/** मराठी / हिंदी / English. Marathi is always first and always the default. */
export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-s)', flexWrap: 'wrap' }}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className="chip"
          lang={code}
          aria-pressed={locale === code}
          onClick={() => setLocale(code)}
        >
          {t(`locale.${code}`)}
        </button>
      ))}
    </div>
  )
}
