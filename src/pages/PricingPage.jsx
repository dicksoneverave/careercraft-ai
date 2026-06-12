import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'
import Sidebar from '../components/Sidebar'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    desc: 'Try it — no card needed',
    features: [
      { text: '2 documents per month',   yes: true  },
      { text: 'All 4 career tools',      yes: true  },
      { text: 'PDF download',            yes: true  },
      { text: 'No watermarks',           yes: false },
      { text: 'DOCX download',           yes: false },
      { text: 'Unlimited documents',     yes: false },
      { text: 'ATS score analysis',      yes: false },
    ],
    cta: 'Current plan',
    priceId: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 15,
    desc: 'For active job seekers',
    featured: true,
    features: [
      { text: 'Unlimited documents',     yes: true },
      { text: 'All 4 career tools',      yes: true },
      { text: 'PDF + DOCX download',     yes: true },
      { text: 'No watermarks',           yes: true },
      { text: 'ATS score analysis',      yes: true },
      { text: 'Priority generation',     yes: true },
      { text: 'Email support',           yes: true },
    ],
    cta: 'Upgrade to Pro',
    priceId: () => import.meta.env.VITE_PADDLE_PRO_PRICE_ID,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    desc: 'For serious career movers',
    features: [
      { text: 'Everything in Pro',       yes: true },
      { text: 'LinkedIn DM templates',   yes: true },
      { text: 'Salary negotiation guide',yes: true },
      { text: 'Interview follow-up emails',yes: true },
      { text: 'Priority support',        yes: true },
    ],
    cta: 'Upgrade to Premium',
    priceId: () => import.meta.env.VITE_PADDLE_PREMIUM_PRICE_ID,
  },
]

const FAQ = [
  ['Can I cancel anytime?', 'Yes — cancel in your account settings any time. You keep access until the end of your billing period.'],
  ['What payment methods are accepted?', 'All major credit/debit cards (Visa, Mastercard, Amex) and PayPal — processed securely by Paddle worldwide.'],
  ['Is there a refund policy?', 'Yes — 7-day full refund if you\'re not satisfied. Email support@javetech.online.'],
  ['Do you store my resume content?', 'No. Your input and generated text are not stored. Only metadata (tool used, date, word count) is saved.'],
  ['Can I use this from any country?', 'Absolutely. CareerCraft AI works globally. Paddle handles tax compliance in 180+ countries.'],
  ['What\'s the ATS score?', 'An estimate of how likely your resume is to pass Applicant Tracking Systems (ATS) based on keyword density, structure, and action verbs.'],
]

export default function PricingPage() {
  const { profile, isPro, isPremium, refreshProfile } = useAuth()
  const toast   = useToast()
  const [loading, setLoading] = useState(null)
  const currentPlan = profile?.plan || 'free'

  async function handleUpgrade(plan) {
    if (!plan.priceId) return
    const priceId = plan.priceId()
    if (!priceId) { toast('Price ID not configured.', 'error'); return }

    setLoading(plan.id)
    try {
      const txRes = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: profile?.id, email: profile?.email }),
      })

      if (!txRes.ok) {
        const err = await txRes.json()
        throw new Error(err.error || 'Could not create checkout.')
      }

      const { checkoutUrl } = await txRes.json()
      if (!checkoutUrl) throw new Error('No checkout URL returned. Please try again.')

      window.location.href = checkoutUrl
    } catch (err) {
      toast(err.message || 'Could not open checkout. Contact support.', 'error')
      setLoading(null)
    }
  }

  // Detect return from Paddle checkout (successUrl redirect)
  const refreshed = useRef(false)
  useEffect(() => {
    if (refreshed.current) return
    if (window.location.search.includes('success=1')) {
      refreshed.current = true
      setTimeout(() => {
        refreshProfile()
        toast('Payment complete! Your plan is being activated.', 'success')
      }, 3000)
    }
  }, [])

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">Upgrade your plan</span>
        </div>

        <div className="cc-page" style={{ maxWidth: 860 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'var(--purple-faint)', border: '1px solid var(--purple-border)', color: 'var(--purple-light)', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, marginBottom: '1rem' }}>
              ⚡ Monthly Subscriptions
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: '.4rem', letterSpacing: '-.02em' }}>
              Invest in your career
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-mid)' }}>
              One month of Pro pays for itself with a single interview. Cancel anytime.
            </p>
          </div>

          {/* Pricing cards — Pro + Premium prominent, Free minimal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {PLANS.filter(p => p.id !== 'free').map(plan => {
              const isCurrent  = currentPlan === plan.id
              const isPremium  = plan.id === 'premium'
              const cardClass  = isPremium ? 'cc-pricing-card premium-card' : 'cc-pricing-card featured'
              const btnClass   = isPremium ? 'btn btn-full btn-amber' : 'btn btn-full btn-primary'

              return (
                <div key={plan.id} className={cardClass}>
                  {isPremium
                    ? <div className="cc-pricing-badge gold">⭐ PREMIUM VIP</div>
                    : <div className="cc-pricing-badge">Most popular</div>
                  }
                  <div className="cc-price-name" style={{ marginTop: '.25rem' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '.3rem', margin: '.5rem 0 .25rem' }}>
                    <span className="cc-price-amt" style={{ color: isPremium ? 'var(--gold-light)' : 'white' }}>${plan.price}</span>
                    <span className="cc-price-per">/mo</span>
                  </div>
                  <div className="cc-price-desc">{plan.desc}</div>
                  <ul className="cc-feat-list">
                    {plan.features.map(f => (
                      <li key={f.text} className={f.yes ? `yes${isPremium ? ' gold-check' : ''}` : 'no'}>{f.text}</li>
                    ))}
                  </ul>
                  <button
                    className={`${btnClass} ${loading === plan.id ? 'btn-spin' : ''}`}
                    onClick={() => !isCurrent && handleUpgrade(plan)}
                    disabled={isCurrent || !!loading}
                  >
                    {!loading && (isCurrent ? '✓ Current plan' : plan.cta)}
                  </button>
                  {isCurrent && (
                    <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', marginTop: '.5rem' }}>
                      Renews {profile?.subscription_end_date ? new Date(profile.subscription_end_date).toLocaleDateString() : 'monthly'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Free tier — compact */}
          {currentPlan === 'free' && (
            <div className="cc-pricing-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div className="cc-price-name">Free plan — current</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>2 docs/month · All 4 tools · PDF only · Watermarked</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-faint)' }}>$0</div>
            </div>
          )}

          {/* Social proof */}
          <div style={{ background: 'var(--purple-faint)', border: '1px solid var(--purple-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: '.4rem' }}>🌍</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Used by job seekers in 40+ countries</div>
            <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: '.25rem' }}>Payments via Paddle — secure, global, tax-compliant in 180+ countries</div>
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: '1rem', color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '.06em' }}>FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '2rem' }}>
            {FAQ.map(([q, a]) => (
              <div key={q} className="cc-card cc-card-sm">
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: '.3rem', color: 'white' }}>{q}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
