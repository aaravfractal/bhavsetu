import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * 'bhav' is the signature card — the only element in the farmer app with
   * elevation, and only ever a hard bottom edge.
   */
  variant?: 'plain' | 'bhav'
  /** 4px left border. Paan marks the best net price, Mirchi marks an alert. */
  accent?: 'gain' | 'loss'
  children: ReactNode
}

export function Card({ variant = 'plain', accent, className, children, ...rest }: Props) {
  const classes = [
    'card',
    variant === 'bhav' ? 'card--bhav' : '',
    accent ? `card--accent-${accent}` : '',
    className ?? '',
  ]
  return (
    <div className={classes.filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  )
}
