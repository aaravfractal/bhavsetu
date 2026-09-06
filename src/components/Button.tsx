import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'quiet'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  block?: boolean
  children: ReactNode
}

/** Primary is Kanda and 64px tall in the farmer app; everything is >=56px. */
export function Button({ variant = 'primary', block, className, children, ...rest }: Props) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : '', className ?? '']
  return (
    <button type="button" className={classes.filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  )
}
