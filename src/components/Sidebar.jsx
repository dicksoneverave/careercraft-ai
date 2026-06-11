import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { TOOLS } from '../lib/tools'

export default function Sidebar() {
  const { profile, isPro } = useAuth()
  const location = useLocation()
  const plan  = profile?.plan ?? 'free'
  const used  = profile?.docs_used  ?? 0
  const limit = profile?.docs_limit ?? 2
  const pct   = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100))

  const nav = [
    { to: '/app',          icon: '🏠', label: 'Dashboard' },
    { to: '/app/history',  icon: '🗂',  label: 'My documents' },
    { to: '/app/pricing',  icon: '💎', label: 'Upgrade' },
    { to: '/app/account',  icon: '⚙️', label: 'Account' },
  ]

  return (
    <aside className="cc-sidebar">
      {/* Logo */}
      <div className="cc-logo">
        <div className="cc-logo-lockup">
          <div className="cc-logo-mark">C</div>
          <div>
            <div className="cc-logo-name">CareerCraft AI</div>
            <div className="cc-logo-tagline">javetech.online/careercraft</div>
          </div>
        </div>
      </div>

      <nav className="cc-nav">
        {/* Tools */}
        <div className="cc-nav-label">Career tools</div>
        {TOOLS.map(t => (
          <Link
            key={t.id}
            to={`/app/tool/${t.id}`}
            className={`cc-nav-item ${location.pathname === `/app/tool/${t.id}` ? 'active' : ''}`}
          >
            <span className="cc-nav-icon">{t.icon}</span>
            {t.shortLabel}
            <span className="cc-tool-dot" style={{ background: t.color }} />
          </Link>
        ))}

        {/* Nav */}
        <div className="cc-nav-label" style={{ marginTop: '.5rem' }}>App</div>
        {nav.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`cc-nav-item ${location.pathname === item.to ? 'active' : ''}`}
          >
            <span className="cc-nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="cc-sidebar-bottom">
        <div className={`cc-plan-chip ${plan}`}>
          {plan === 'premium' ? '⭐ Premium' : plan === 'pro' ? '⚡ Pro' : '🆓 Free'}
        </div>

        {!isPro ? (
          <>
            <div className="cc-usage-bar">
              <div className="cc-usage-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="cc-usage-label">{used} / {limit} documents used</div>
          </>
        ) : (
          <div className="cc-usage-label">Unlimited documents</div>
        )}

        <button
          className="cc-nav-item"
          style={{ marginTop: '.75rem', padding: '.4rem 0', color: 'rgba(255,255,255,.4)' }}
          onClick={() => supabase.auth.signOut()}
        >
          <span className="cc-nav-icon">🚪</span> Sign out
        </button>
      </div>
    </aside>
  )
}
