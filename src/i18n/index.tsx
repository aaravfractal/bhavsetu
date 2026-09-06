import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import en from './en.json'
import hi from './hi.json'
import mr from './mr.json'

export const LOCALES = ['mr', 'hi', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** mr is the default locale. Always. */
export const DEFAULT_LOCALE: Locale = 'mr'

const TABLES: Record<Locale, Record<string, string>> = { mr, hi, en }

export type StringKey = keyof typeof en

/**
 * A value still awaiting native review is stored as "TODO-mr: English meaning".
 * The marker is kept in the JSON so it is greppable and the gallery can list
 * what a native speaker still has to write; t() strips it before render so the
 * marker never reaches a farmer's screen.
 */
const TODO_MARKER = /^TODO-(mr|hi|en):\s*/

export function isTodo(locale: Locale, key: string): boolean {
  return TODO_MARKER.test(TABLES[locale][key] ?? '')
}

export function rawString(locale: Locale, key: string): string {
  return TABLES[locale][key] ?? key
}

export type Params = Record<string, string | number>

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}

export function translate(locale: Locale, key: string, params?: Params): string {
  const raw = TABLES[locale][key]
  if (raw === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key "${key}" in ${locale}`)
    return key
  }
  return interpolate(raw.replace(TODO_MARKER, ''), params)
}

/** All keys still holding a placeholder, for the gallery's review list. */
export function todoKeys(locale: Locale): string[] {
  return Object.keys(TABLES[locale]).filter((k) => k !== '_readme' && isTodo(locale, k))
}

export function allKeys(): string[] {
  return Object.keys(en).filter((k) => k !== '_readme')
}

type I18n = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: (key: StringKey | string, params?: Params) => string
  /** True while the active locale still needs a native string for this key. */
  todo: (key: StringKey | string) => boolean
}

const I18nContext = createContext<I18n | null>(null)

const STORAGE_KEY = 'bhavsetu.locale'

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (LOCALES as readonly string[]).includes(stored)) return stored as Locale
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return DEFAULT_LOCALE
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Not being able to remember the choice is not worth an error.
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const t = useCallback(
    (key: string, params?: Params) => translate(locale, key, params),
    [locale],
  )
  const todo = useCallback((key: string) => isTodo(locale, key), [locale])

  const value = useMemo<I18n>(() => ({ locale, setLocale, t, todo }), [locale, setLocale, t, todo])

  return <I18nContext value={value}>{children}</I18nContext>
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
