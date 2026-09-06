import { useI18n } from '../i18n/index.tsx'

/** Fixed vocabulary from spec 6.5. Nothing else may appear in a status pill. */
export const LOT_STATUS = [
  'findingBuyers',
  'bidReceived',
  'dealAgreed',
  'paymentHeld',
  'paid',
] as const

export type LotStatus = (typeof LOT_STATUS)[number]

const TONE: Record<LotStatus, string> = {
  findingBuyers: '',
  bidReceived: 'pill--primary',
  dealAgreed: 'pill--primary',
  paymentHeld: 'pill--price',
  paid: 'pill--gain',
}

export function StatusPill({ status }: { status: LotStatus }) {
  const { t } = useI18n()
  return (
    <span className={['pill', TONE[status]].filter(Boolean).join(' ')}>
      {t(`status.${status}`)}
    </span>
  )
}
