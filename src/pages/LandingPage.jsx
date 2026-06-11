import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ATSRing from '../components/ATSRing'
import { TOOLS } from '../lib/tools'

// Animated hero visual — cycles through the 4 tools
function HeroVisual() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [score, setScore]         = useState(0)

  useEffect(() => {
    // Animate ATS score up on first render
    const t = setTimeout(() => setScore(87), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(i => (i + 1) % TOOLS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="cc-hero-visual">
      <div className="cc-hero-visual-title">
        <span>✨</span> CareerCraft AI is writing…
      </div>

      {/* ATS ring for resume tool */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '.75rem', background: 'var(--green-faint)', borderRadius: 'var(--radius-lg)' }}>
        <ATSRing score={score} size={72} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>ATS Readiness Score</div>
          <div style={{ fontSize: 11, color: 'var(--ink-light)', lineHeight: 1.5 }}>
            This resume should pass most<br />ATS filters. Strong keyword match.
          </div>
        </div>
      </div>

      {TOOLS.map((tool, i) => (
        <div key={tool.id} className={`cc-hero-tool-row ${i === activeIdx ? 'active' : ''}`}>
          <div className={`cc-hero-tool-check ${i <= activeIdx ? 'done' : 'pending'}`}>
            {i <= activeIdx ? '✓' : ''}
          </div>
          <span style={{ fontSize: 16 }}>{tool.icon}</span>
          <div>
            <div className="cc-hero-tool-name">{tool.label}</div>
            <div className="cc-hero-tool-desc">{tool.tagline}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="cc-landing">
      {/* Nav */}
      <nav className="cc-land-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
          <div style={{ width: 34, height: 34, background: 'var(--amber)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>CareerCraft AI</span>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/pricing')}>Pricing</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn btn-amber btn-sm" onClick={() => navigate('/signup')}>Try free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="cc-land-hero">
        <div>
          <div className="cc-land-eyebrow">🎯 AI-powered career documents</div>
          <h1 className="cc-land-h1">
            Land the job.<br />
            <em>Not just apply</em><br />
            for it.
          </h1>
          <p className="cc-land-sub">
            AI writes your resume, cover letter, LinkedIn summary, and interview prep — tailored to the exact job you want. In under 20 seconds.
          </p>
          <div className="cc-land-ctas">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
              Start free — 2 docs/month
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/app/pricing')}>
              See pricing
            </button>
          </div>
          <div className="cc-land-proof">
            {[
              { val: '4',     label: 'Career tools' },
              { val: '$15',   label: 'Pro plan / month' },
              { val: '~15s',  label: 'Generation time' },
              { val: '40+',   label: 'Countries' },
            ].map(s => (
              <div key={s.label} className="cc-land-proof-item">
                <span className="cc-land-proof-val">{s.val}</span>
                <span className="cc-land-proof-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Animated hero visual */}
        <HeroVisual />
      </section>

      {/* Tools */}
      <section className="cc-land-tools">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="cc-land-section-title">Four tools, one subscription</h2>
          <p className="cc-land-section-sub">Everything you need from first application to offer letter.</p>
        </div>
        <div className="cc-land-tools-grid">
          {TOOLS.map(tool => (
            <div key={tool.id} className="cc-land-tool-card" onClick={() => navigate('/signup')}>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tool.color, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.15rem' }}>{tool.tagline}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.3rem' }}>{tool.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{tool.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 3rem', background: 'white', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="cc-land-section-title">How it works</h2>
          <p className="cc-land-section-sub">Three steps from blank page to polished document.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
          {[
            { step: 1, icon: '📝', title: 'Fill in your details', desc: 'Paste your experience, target role, and any relevant context. No formatting needed — just raw notes.' },
            { step: 2, icon: '✨', title: 'AI generates your document', desc: 'Claude AI writes a tailored, professional document in 10–20 seconds. Specific to you, not a generic template.' },
            { step: 3, icon: '📥', title: 'Download and send', desc: 'Download as PDF (free) or DOCX (Pro). Ready to send — no extra editing needed.' },
          ].map(s => (
            <div key={s.step} className="cc-card" style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'var(--green)', margin: '0 auto .75rem' }}>{s.step}</div>
              <div style={{ fontSize: 22, marginBottom: '.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: '.3rem' }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="cc-land-pricing">
        <h2 className="cc-land-section-title">Simple pricing</h2>
        <p className="cc-land-section-sub">Start free. One month of Pro costs less than a coffee a week.</p>
        <div className="cc-pricing-grid" style={{ maxWidth: 720, margin: '0 auto 2rem' }}>
          {[
            { name: 'Free',    price: '$0',  desc: '2 docs/month',   features: ['All 4 tools', 'PDF download', 'Watermarked'],          cta: 'Start free',     featured: false },
            { name: 'Pro',     price: '$15', desc: '/month',         features: ['Unlimited docs', 'No watermarks', 'PDF + DOCX', 'ATS score'], cta: 'Get Pro', featured: true },
            { name: 'Premium', price: '$29', desc: '/month',         features: ['Everything in Pro', 'LinkedIn DMs', 'Salary guides'],  cta: 'Get Premium',    featured: false },
          ].map(p => (
            <div key={p.name} className={`cc-pricing-card ${p.featured ? 'featured' : ''}`}>
              {p.featured && <div className="cc-pricing-badge">Best value</div>}
              <div className="cc-price-name">{p.name}</div>
              <div style={{ marginBottom: '.6rem' }}>
                <span className="cc-price-amt">{p.price}</span>
                <span className="cc-price-per">{p.desc}</span>
              </div>
              <ul className="cc-feat-list">
                {p.features.map(f => <li key={f} className="yes">{f}</li>)}
              </ul>
              <button className={`btn btn-full ${p.featured ? 'btn-amber' : 'btn-outline'}`} onClick={() => navigate('/signup')}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 3rem', background: 'var(--green)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'white', marginBottom: '.75rem', fontWeight: 700 }}>
          Your next career move starts now.
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.65)', marginBottom: '1.75rem', maxWidth: 460, margin: '0 auto 1.75rem' }}>
          2 free documents per month. No credit card. 20 seconds to your first resume.
        </p>
        <button className="btn btn-amber btn-lg" onClick={() => navigate('/signup')}>
          Create your free account →
        </button>
      </section>

      <footer className="cc-land-footer">
        <p>© {new Date().getFullYear()} CareerCraft AI — JAVE IT Solutions · javetech.online/careercraft</p>
        <p style={{ marginTop: '.3rem' }}>Payments by Paddle · support@javetech.online</p>
      </footer>
    </div>
  )
}
