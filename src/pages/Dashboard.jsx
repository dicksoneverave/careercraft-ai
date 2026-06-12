import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar'
import { TOOLS, PREMIUM_TOOLS } from '../lib/tools'

const CORE_TOOLS = TOOLS.filter(t => !t.premium)

export default function Dashboard() {
  const { profile, isPro, isPremium, canGenerate } = useAuth()
  const navigate = useNavigate()
  const name  = profile?.full_name?.split(' ')[0] || 'there'
  const used  = profile?.docs_used  ?? 0
  const limit = profile?.docs_limit ?? 2
  const plan  = profile?.plan ?? 'free'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const planLabel = isPremium ? '⭐ Premium' : isPro ? '⚡ Pro' : 'Free'

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">{greeting}, {name} 👋</span>
          <div className="cc-topbar-right">
            <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>
              {isPro ? `${planLabel} plan — unlimited docs` : `${used} / ${limit} free docs used this month`}
            </span>
          </div>
        </div>

        <div className="cc-page">
          {/* Upgrade banner for free users near/at limit */}
          {!isPro && (
            <div className="cc-upgrade-banner">
              <div className="cc-upgrade-text">
                <div className="cc-upgrade-title">
                  {canGenerate
                    ? `${limit - used} free document${limit - used !== 1 ? 's' : ''} remaining this month`
                    : 'You\'ve used all free documents this month'}
                </div>
                <div className="cc-upgrade-sub">
                  Upgrade to Pro for unlimited resumes, cover letters, LinkedIn summaries, and interview prep — $15/mo.
                </div>
              </div>
              <button className="btn btn-amber" onClick={() => navigate('/app/pricing')}>
                Upgrade to Pro →
              </button>
            </div>
          )}

          {/* Pro upgrade nudge for Premium features */}
          {isPro && !isPremium && (
            <div className="cc-upgrade-banner" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.12) 0%, rgba(245,158,11,.08) 100%)', border: '1px solid rgba(245,158,11,.25)' }}>
              <div className="cc-upgrade-text">
                <div className="cc-upgrade-title" style={{ color: 'var(--gold-light)' }}>⭐ Unlock Premium tools</div>
                <div className="cc-upgrade-sub">
                  LinkedIn DM templates, salary negotiation guides, and interview follow-up emails — $29/mo.
                </div>
              </div>
              <button className="btn btn-amber" onClick={() => navigate('/app/pricing')}>
                Upgrade to Premium →
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="cc-stats">
            {[
              { val: used,                                                  label: 'Documents created' },
              { val: isPremium ? TOOLS.length : CORE_TOOLS.length,         label: 'Career tools' },
              { val: plan.toUpperCase(),                                    label: 'Current plan' },
              { val: isPro ? '∞' : limit - used > 0 ? limit - used : 0,   label: isPro ? 'Docs available' : 'Docs remaining' },
            ].map(s => (
              <div key={s.label} className="cc-stat">
                <div className="cc-stat-val">{s.val}</div>
                <div className="cc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Core tool cards */}
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', marginBottom: '1rem' }}>
            Career tools
          </h2>

          <div className="cc-tool-grid">
            {CORE_TOOLS.map(tool => (
              <button
                key={tool.id}
                className="cc-tool-card"
                style={{ '--tool-color': tool.color }}
                onClick={() => navigate(`/app/tool/${tool.id}`)}
                disabled={!canGenerate && !isPro}
              >
                <div className="cc-tool-icon">{tool.icon}</div>
                <div className="cc-tool-tagline">{tool.tagline}</div>
                <div className="cc-tool-name">{tool.label}</div>
                <div className="cc-tool-desc">{tool.description}</div>
                <div className="cc-tool-arrow">→</div>
              </button>
            ))}
          </div>

          {!canGenerate && !isPro && (
            <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1.5rem', background: '#FEF7E8', borderRadius: 'var(--radius-lg)', border: '1px solid var(--amber-light)' }}>
              <p style={{ fontSize: 14, color: '#9A6800', marginBottom: '.75rem', fontWeight: 600 }}>
                Monthly limit reached. Upgrade to keep going.
              </p>
              <button className="btn btn-amber" onClick={() => navigate('/app/pricing')}>
                Upgrade to Pro — $15/mo
              </button>
            </div>
          )}

          {/* Premium tools section */}
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold-light)', margin: 0 }}>
                ⭐ Premium tools
              </h2>
              {!isPremium && (
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)', color: 'var(--gold-light)', padding: '2px 8px', borderRadius: 20 }}>
                  PREMIUM ONLY
                </span>
              )}
            </div>

            <div className="cc-tool-grid">
              {PREMIUM_TOOLS.map(tool => (
                isPremium ? (
                  <button
                    key={tool.id}
                    className="cc-tool-card"
                    style={{ '--tool-color': tool.color, border: '1px solid rgba(245,158,11,.2)' }}
                    onClick={() => navigate(`/app/tool/${tool.id}`)}
                  >
                    <div className="cc-tool-icon">{tool.icon}</div>
                    <div className="cc-tool-tagline" style={{ color: 'var(--gold-light)' }}>{tool.tagline}</div>
                    <div className="cc-tool-name">{tool.label}</div>
                    <div className="cc-tool-desc">{tool.description}</div>
                    <div className="cc-tool-arrow" style={{ color: 'var(--gold-light)' }}>→</div>
                  </button>
                ) : (
                  <div
                    key={tool.id}
                    className="cc-tool-card"
                    style={{ '--tool-color': tool.color, opacity: 0.55, cursor: 'default', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', top: '.75rem', right: '.75rem', fontSize: 16 }}>🔒</div>
                    <div className="cc-tool-icon">{tool.icon}</div>
                    <div className="cc-tool-tagline">{tool.tagline}</div>
                    <div className="cc-tool-name">{tool.label}</div>
                    <div className="cc-tool-desc">{tool.description}</div>
                  </div>
                )
              ))}
            </div>

            {!isPremium && (
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button className="btn btn-amber" onClick={() => navigate('/app/pricing')}>
                  Upgrade to Premium to unlock these tools →
                </button>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/history')}>
              View all my documents →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
