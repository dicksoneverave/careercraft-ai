import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ATSRing from '../components/ATSRing'
import { TOOLS } from '../lib/tools'

function HeroVisual() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [score, setScore]         = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setScore(87), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveIdx(i => (i + 1) % TOOLS.length), 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="cc-hero-visual">
      <div className="cc-hero-visual-title">
        <span>✨</span> CareerCraft AI is writing…
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', padding: '.75rem', background: 'rgba(124,58,237,.1)', border: '1px solid rgba(124,58,237,.2)', borderRadius: 'var(--radius-lg)' }}>
        <ATSRing score={score} size={72} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple-light)' }}>ATS Readiness Score</div>
          <div style={{ fontSize: 11, color: 'var(--dark-text)', lineHeight: 1.5 }}>
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
        <div className="cc-land-nav-logo">
          <div className="cc-land-nav-logo-mark">C</div>
          CareerCraft AI
        </div>
        <div className="cc-land-nav-links">
          <button className="cc-land-nav-link" onClick={() => navigate('/app/pricing')}>Pricing</button>
          <button className="cc-land-nav-link" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-purple" onClick={() => navigate('/signup')}>Get started free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="cc-land-hero">
        <div>
          <div className="cc-land-eyebrow">✦ AI-powered career documents</div>
          <h1 className="cc-land-h1">
            Land the job.<br />
            <em>Not just apply</em><br />
            for it.
          </h1>
          <p className="cc-land-sub">
            AI writes your resume, cover letter, LinkedIn summary, and interview prep — tailored to the exact job you want. In under 20 seconds.
          </p>
          <div className="cc-land-ctas">
            <button className="btn-purple btn-purple-lg" onClick={() => navigate('/signup')}>
              Start free — 2 docs/month →
            </button>
            <button className="btn-dark-outline" onClick={() => navigate('/app/pricing')}>
              See pricing
            </button>
          </div>
          <div className="cc-land-proof">
            {[
              { val: '4',    label: 'Career tools' },
              { val: '$15',  label: 'Pro / month' },
              { val: '~15s', label: 'Generation time' },
              { val: '40+',  label: 'Countries' },
            ].map(s => (
              <div key={s.label} className="cc-land-proof-item">
                <span className="cc-land-proof-val">{s.val}</span>
                <span className="cc-land-proof-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <HeroVisual />
      </section>

      {/* Tools */}
      <section className="cc-land-tools">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: 760, margin: '0 auto 2.5rem' }}>
          <h2 className="cc-land-section-title">Four tools, <span>one subscription</span></h2>
          <p className="cc-land-section-sub">Everything you need from first application to offer letter.</p>
        </div>
        <div className="cc-land-tools-grid">
          {TOOLS.map(tool => (
            <div key={tool.id} className="cc-land-tool-card" onClick={() => navigate('/signup')}>
              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '.15rem' }}>{tool.tagline}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: '.3rem' }}>{tool.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--dark-text)', lineHeight: 1.6 }}>{tool.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 3rem', background: 'var(--dark-bg)', borderTop: '1px solid var(--dark-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="cc-land-section-title">How it <span>works</span></h2>
          <p className="cc-land-section-sub">Three steps from blank page to polished document.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', maxWidth: 760, margin: '0 auto' }}>
          {[
            { step: 1, icon: '📝', title: 'Fill in your details', desc: 'Paste your experience, target role, and any relevant context. No formatting needed — just raw notes.' },
            { step: 2, icon: '✨', title: 'AI generates your document', desc: 'Claude AI writes a tailored, professional document in 10–20 seconds. Specific to you, never generic.' },
            { step: 3, icon: '📥', title: 'Download and send', desc: 'Download as PDF (free) or DOCX (Pro). Ready to send — no extra editing needed.' },
          ].map(s => (
            <div key={s.step} className="cc-land-step-card">
              <div className="cc-land-step-num">{s.step}</div>
              <div style={{ fontSize: 24, marginBottom: '.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: '.35rem' }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--dark-text)', lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="cc-land-pricing">
        <h2 className="cc-land-section-title" style={{ marginBottom: '.5rem' }}>Simple <span>pricing</span></h2>
        <p className="cc-land-section-sub">Start free. One month of Pro costs less than a coffee a week.</p>
        <div className="cc-pricing-grid" style={{ maxWidth: 760, margin: '0 auto 2.5rem' }}>
          {[
            { name: 'Free',    price: '$0',  desc: '2 docs/month',   features: ['All 4 tools', 'PDF download', 'Watermarked'],               cta: 'Start free',  featured: false },
            { name: 'Pro',     price: '$15', desc: '/month',         features: ['Unlimited docs', 'No watermarks', 'PDF + DOCX', 'ATS score'], cta: 'Get Pro',     featured: true  },
            { name: 'Premium', price: '$29', desc: '/month',         features: ['Everything in Pro', 'LinkedIn DMs', 'Salary guides'],         cta: 'Get Premium', featured: false },
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
      <section style={{ padding: '5rem 3rem', background: 'linear-gradient(135deg, #1a0533 0%, var(--dark-bg) 100%)', borderTop: '1px solid var(--dark-border)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'var(--purple-faint)', border: '1px solid rgba(124,58,237,.3)', color: 'var(--purple-light)', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, marginBottom: '1.5rem' }}>
          ✦ Join job seekers in 40+ countries
        </div>
        <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', color: 'white', fontWeight: 800, letterSpacing: '-.02em', marginBottom: '.75rem', lineHeight: 1.1 }}>
          Your next career move<br />starts now.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--dark-text)', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
          2 free documents per month. No credit card. 20 seconds to your first resume.
        </p>
        <button className="btn-purple btn-purple-lg" onClick={() => navigate('/signup')}>
          Create your free account →
        </button>
      </section>

      <footer className="cc-land-footer">
        <p>© {new Date().getFullYear()} CareerCraft AI · JAVE IT Solutions · javetech.online</p>
        <p style={{ marginTop: '.3rem' }}>Payments by Paddle · support@javetech.online</p>
      </footer>
    </div>
  )
}
