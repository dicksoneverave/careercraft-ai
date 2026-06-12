import { useState, useEffect } from 'react'
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

  const SERVER = import.meta.env.VITE_SERVER_URL || ''

  async function handleUpgrade(plan) {
    if (!plan.id || plan.id === 'free') return
    setLoading(plan.id)
    try {
      const res = await fetch(`${SERVER}/api/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id, plan: plan.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.transactionId) {
        toast(data.error || 'Could not start checkout. Try again.', 'error')
        setLoading(null)
        return
      }
      window.location.href = `https://pay.javetech.online/careercraft?_ptxn=${data.transactionId}`
    } catch {
      toast('Could not connect to payment server. Try again.', 'error')
      setLoading(null)
    }
  }

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">Upgrade your plan</span>
        </div>

        <div className="cc-page" style={{ maxWidth: 840 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green)', marginBottom: '.4rem' }}>
              Invest in your career
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-light)' }}>
              One month of Pro pays for itself with a single interview. Cancel anytime.
            </p>
          </div>

          <div className="cc-pricing-grid" style={{ marginBottom: '2.5rem' }}>
            {PLANS.map(plan => {
              const isCurrent = currentPlan === plan.id
              const canUpgrade = !isCurrent && plan.price > 0

              return (
                <div key={plan.id} className={`cc-pricing-card ${plan.featured ? 'featured' : ''}`}>
                  {plan.featured && <div className="cc-pricing-badge">Most popular</div>}
                  <div className="cc-price-name">{plan.name}</div>
                  <div>
                    <span className="cc-price-amt">${plan.price}</span>
                    {plan.price > 0 && <span className="cc-price-per">/month</span>}
                  </div>
                  <div className="cc-price-desc">{plan.desc}</div>

                  <ul className="cc-feat-list">
                    {plan.features.map(f => (
                      <li key={f.text} className={f.yes ? 'yes' : 'no'}>{f.text}</li>
                    ))}
                  </ul>

                  <button
                    className={`btn btn-full ${plan.featured ? 'btn-amber' : 'btn-outline'} ${loading === plan.id ? 'btn-spin' : ''}`}
                    onClick={() => canUpgrade ? handleUpgrade(plan) : null}
                    disabled={isCurrent || !!loading}
                  >
                    {!loading && (isCurrent ? '✓ Current plan' : plan.cta)}
                  </button>

                  {isCurrent && currentPlan !== 'free' && (
                    <p style={{ fontSize: 11, color: 'var(--ink-faint)', textAlign: 'center', marginTop: '.5rem' }}>
                      Renews {profile?.subscription_end_date ? new Date(profile.subscription_end_date).toLocaleDateString() : 'monthly'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Social proof */}
          <div style={{ background: 'var(--green-faint)', border: '1px solid var(--green-light)30', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: 22, marginBottom: '.4rem' }}>🌍</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>Used by job seekers in 40+ countries</div>
            <div style={{ fontSize: 13, color: 'var(--ink-light)', marginTop: '.25rem' }}>Payments via Paddle — secure, global, no Stripe account needed</div>
          </div>

          {/* FAQ */}
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: 'var(--green)' }}>Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {FAQ.map(([q, a]) => (
              <div key={q} className="cc-card cc-card-sm">
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: '.3rem' }}>{q}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
