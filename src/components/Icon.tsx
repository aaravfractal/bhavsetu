import type { SVGProps } from 'react'

/**
 * The icon set. Lucide geometry (MIT), inlined rather than pulled in as a
 * dependency — the app needs eleven glyphs, not a package.
 *
 * Stroke 2, currentColor. Farmer app renders these at --sz-icon (28px);
 * everywhere else at --sz-icon-small (20px). Rule 7: an icon in the farmer app
 * never stands alone — the callers below always pair it with a Marathi word.
 */

const PATHS = {
  store: ['M3 21V8h18v13', 'M2 8l2-5h16l2 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z'],
  package: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm7.5 4.27 9 5.15',
    'm3.3 7 8.7 5 8.7-5',
    'M12 22V12',
  ],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  wallet: [
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2',
    'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
  ],
  mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  speaker: ['M11 5 6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 0 1 0 7.07', 'M19.07 4.93a10 10 0 0 1 0 14.14'],
  wifiOff: [
    'M12 20h.01',
    'M8.5 16.43a5 5 0 0 1 7 0',
    'M5 12.86a10 10 0 0 1 5.17-2.69',
    'M19 12.86a10 10 0 0 0-2.01-1.52',
    'M2 8.82a15 15 0 0 1 4.18-2.64',
    'M22 8.82a15 15 0 0 0-11.29-3.76',
    'm2 2 20 20',
  ],
  chevronRight: ['m9 18 6-6-6-6'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  plus: ['M5 12h14', 'M12 5v14'],
  minus: ['M5 12h14'],
  lock: ['M7 11V7a5 5 0 0 1 10 0v4'],
} as const

export type IconName = keyof typeof PATHS

type Props = SVGProps<SVGSVGElement> & { name: IconName }

export function Icon({ name, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      {...rest}
    >
      {name === 'users' ? <circle cx="9" cy="7" r="4" /> : null}
      {name === 'lock' ? <rect x="3" y="11" width="18" height="11" rx="2" /> : null}
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
