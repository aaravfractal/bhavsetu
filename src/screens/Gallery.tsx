import { useState } from 'react'
import type { ReactNode } from 'react'
import { BottomNav, NAV_TABS } from '../components/BottomNav.tsx'
import type { NavTab } from '../components/BottomNav.tsx'
import { Button } from '../components/Button.tsx'
import { Card } from '../components/Card.tsx'
import { Chip } from '../components/Chip.tsx'
import { LocaleSwitcher } from '../components/LocaleSwitcher.tsx'
import { MicFAB } from '../components/MicFAB.tsx'
import { OfflinePill } from '../components/OfflinePill.tsx'
import { SpeakerButton } from '../components/SpeakerButton.tsx'
import { StatusPill, LOT_STATUS } from '../components/StatusPill.tsx'
import { Stepper } from '../components/Stepper.tsx'
import { TrustBar } from '../components/TrustBar.tsx'
import { VerdictBadge } from '../components/VerdictBadge.tsx'
import { LOCALES, allKeys, isTodo, rawString, translate, useI18n } from '../i18n/index.tsx'
import { formatDelta, formatINR, formatNumber } from '../lib/format.ts'
import { color, type, verdictColor } from '../tokens/theme.ts'
import type { Verdict } from '../tokens/theme.ts'
import './Gallery.css'

/* Demo figures are the locked ones from docs/master-prompt.md — Lasalgaon
   onion, Sep 2026. Never a different number. */
const TODAY_PRICE = 1850
const DELTA = 120
const TARGET = 2100
const DAYS_TO_TARGET = 8
const BEST_NET = 1835
const BID = { price: 2050, transport: 85, cess: 30, inHand: 1935 }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="gal__section">
      <h2 className="text-heading">{title}</h2>
      {children}
    </section>
  )
}

function Specimen({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="gal__specimen">
      <h3>{name}</h3>
      {children}
    </div>
  )
}

export function Gallery() {
  const { t, locale } = useI18n()
  const [stale, setStale] = useState(false)
  const [quintals, setQuintals] = useState(20)
  const [crop, setCrop] = useState('onion')
  const [tab, setTab] = useState<NavTab>('market')
  const [filling, setFilling] = useState(false)

  const reasons = [
    t('verdict.reason.arrivalsFalling'),
    t('verdict.reason.noRain'),
    t('verdict.reason.festivalDemand'),
  ]
  const holdDetail = t('verdict.hold.detail', {
    days: formatNumber(DAYS_TO_TARGET, locale),
    price: formatINR(TARGET, locale),
  })

  return (
    <main className={`gal${stale ? ' is-stale' : ''}`}>
      <header className="gal__head">
        <div className="pair">
          <h1 className="text-heading">{t('gallery.title')}</h1>
          <p className="text-en">{t('gallery.subtitle')}</p>
        </div>
        <LocaleSwitcher />
        <div className="gal__row">
          <Chip
            label={t('gallery.simulateOffline')}
            selected={stale}
            onToggle={() => setStale((v) => !v)}
          />
          {stale ? <OfflinePill variant="badge" fetchedAt="11:00" /> : null}
        </div>
      </header>

      <Section title={t('gallery.section.colour')}>
        <div className="gal__grid">
          {Object.entries(color).map(([name, hex]) => (
            <div className="gal__swatch" key={name}>
              <b style={{ background: hex }} />
              <span>
                {name}
                <br />
                <code>{hex}</code>
              </span>
            </div>
          ))}
        </div>
        <p className="text-en">
          Verdict mapping is fixed and never swaps: sell {verdictColor.sell} · hold{' '}
          {verdictColor.hold} · warn {verdictColor.warn}.
        </p>
      </Section>

      <Section title={t('gallery.section.type')}>
        <div className="gal__specimen">
          {Object.entries(type).map(([name, spec]) => (
            <p
              key={name}
              style={{
                fontFamily: spec.family,
                fontSize: spec.size,
                lineHeight: spec.line,
                fontWeight: spec.weight,
                margin: 0,
              }}
            >
              {name === 'verdict' ? t('verdict.hold') : formatINR(TODAY_PRICE, locale)}{' '}
              <span className="text-en">
                {name} · {spec.size}/{spec.line} · {spec.weight}
              </span>
            </p>
          ))}
        </div>
      </Section>

      <Section title={t('gallery.section.components')}>
        <Specimen name="Bhav card + VerdictBadge (tap the verdict for reasons)">
          <Card variant="bhav">
            <div className="gal__row" style={{ justifyContent: 'space-between' }}>
              <p className="text-label">
                {t('bhav.header', { mandi: t('mandi.lasalgaon'), crop: t('crop.onion') })}
              </p>
              <SpeakerButton />
            </div>
            <p className="gal__price">{formatINR(TODAY_PRICE, locale)}</p>
            <p className="text-label">{t('bhav.perQuintalToday')}</p>
            <p style={{ color: color.gain, fontWeight: 700 }}>
              {t('bhav.deltaVsYesterday', { delta: formatDelta(DELTA, locale) })}
            </p>
            <div style={{ margin: 'var(--sp-m) 0' }}>
              <VerdictBadge verdict="hold" reasons={reasons} detail={holdDetail} />
            </div>
            <p className="text-label">{holdDetail}</p>
            <Button block>{t('bhav.listen')}</Button>
          </Card>
        </Specimen>

        <Specimen name="VerdictBadge — all three, each opens its reasons sheet">
          <div className="gal__row">
            {(['sell', 'hold', 'warn'] as Verdict[]).map((v) => (
              <VerdictBadge key={v} verdict={v} reasons={reasons} detail={holdDetail} />
            ))}
          </div>
        </Specimen>

        <Specimen name="Money math — nothing is ever silently deducted">
          <Card>
            <div className="gal__math text-num">
              <div>
                <span>{t('deduction.bid')}</span>
                <span>{formatINR(BID.price, locale)}</span>
              </div>
              <div>
                <span>− {t('deduction.transport')}</span>
                <span>{formatINR(BID.transport, locale)}</span>
              </div>
              <div>
                <span>− {t('deduction.cess')}</span>
                <span>{formatINR(BID.cess, locale)}</span>
              </div>
              <div>
                <span>{t('deduction.inHand')}</span>
                <span>{formatINR(BID.inHand, locale)}</span>
              </div>
            </div>
          </Card>
        </Specimen>

        <Specimen name="Mandi row — best net price takes the Paan border">
          <div className="gal__mandirow" style={{ borderLeft: `4px solid ${color.gain}` }}>
            <span>{t('mandi.pimpalgaon')}</span>
            <span className="text-label">
              {formatNumber(18, locale)} {t('units.km')}
            </span>
            <b className="text-num">{t('home.netToYou', { amount: formatINR(BEST_NET, locale) })}</b>
          </div>
        </Specimen>

        <Specimen name="TrustBar">
          <TrustBar score={5} reason={t('trust.reasonGood', { deals: formatNumber(31, locale) })} />
          <TrustBar score={4} reason={t('trust.reasonGood', { deals: formatNumber(23, locale) })} />
          <TrustBar score={2} reason={t('trust.reasonWarn', { count: formatNumber(2, locale) })} />
        </Specimen>

        <Specimen name="StatusPill — fixed vocabulary">
          <div className="gal__row">
            {LOT_STATUS.map((s) => (
              <StatusPill key={s} status={s} />
            ))}
          </div>
        </Specimen>

        <Specimen name="Chip — crops">
          <div className="gal__row">
            {['onion', 'cotton', 'soybean', 'grapes', 'pomegranate', 'other'].map((c) => (
              <Chip
                key={c}
                label={t(`crop.${c}`)}
                selected={crop === c}
                onToggle={() => setCrop(c)}
              />
            ))}
          </div>
        </Specimen>

        <Specimen name="Stepper">
          <Stepper value={quintals} onChange={setQuintals} label={t('units.quintal')} max={200} />
        </Specimen>

        <Specimen name="Buttons">
          <div className="gal__row">
            <Button>{t('bhav.listen')}</Button>
            <Button variant="secondary">{t('voice.askAgain')}</Button>
            <Button variant="quiet">{t('voice.openMarket')}</Button>
            <Button disabled>{t('offline.willSend')}</Button>
          </div>
        </Specimen>

        <Specimen name="BottomNav + MicFAB">
          <div className="gal__nav">
            <BottomNav active={tab} onSelect={(next) => setTab(next)} />
            <MicFAB />
          </div>
          <p className="text-en">
            Routes: {NAV_TABS.map((x) => x.path).join(' · ')}. Wired to the router from Session 3.
          </p>
        </Specimen>
      </Section>

      <Section title={t('gallery.section.states')}>
        <div className="gal__row" style={{ alignItems: 'flex-start' }}>
          <div className="gal__frame">
            <p className="text-label">{t('gallery.state.loaded')}</p>
            <p className="gal__price">{formatINR(TODAY_PRICE, locale)}</p>
            <p className="text-label">{t('bhav.perQuintalToday')}</p>
          </div>

          <div className="gal__frame is-stale">
            <p className="text-label">{t('gallery.state.offline')}</p>
            <OfflinePill />
            <p className="gal__price">{formatINR(TODAY_PRICE, locale)}</p>
            <p className="text-label">{t('bhav.perQuintalToday')}</p>
            <Button disabled block>
              {t('offline.willSend')}
            </Button>
          </div>

          <div className="gal__frame">
            <p className="text-label">{t('gallery.state.empty')}</p>
            <p>{t('empty.noLots')}</p>
            <Button block>{t('lots.add')}</Button>
            <Card accent="loss">
              <p>{t('error.priceFailed')}</p>
              <Button variant="secondary">{t('error.retry')}</Button>
            </Card>
          </div>
        </div>
      </Section>

      <Section title={t('gallery.section.motion')}>
        <Specimen name="400ms Paan fill — deal accept and payment release only">
          <div className={`gal__mandirow fill${filling ? ' fill--on' : ''}`}>
            <span>{t('status.paid')}</span>
            <span />
            <b className="text-num">
              {t('money.received', { amount: formatINR(158100, locale) })}
            </b>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setFilling(false)
              requestAnimationFrame(() => setFilling(true))
            }}
          >
            {t('gallery.playFill')}
          </Button>
        </Specimen>
      </Section>

      <Section title={t('gallery.section.strings')}>
        <p className="text-en">{t('gallery.stringsHint')}</p>
        <div className="gal__scroll">
          <table className="gal__table">
            <thead>
              <tr>
                <th>{t('gallery.key')}</th>
                {LOCALES.map((code) => (
                  <th key={code}>{translate(code, `locale.${code}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allKeys().map((key) => (
                <tr key={key}>
                  <td>
                    <code>{key}</code>
                  </td>
                  {LOCALES.map((code) => (
                    <td key={code} lang={code}>
                      {translate(code, key)}
                      {isTodo(code, key) ? (
                        <span
                          className="gal__todo"
                          title={rawString(code, key)}
                        >{`TODO-${code}`}</span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </main>
  )
}
