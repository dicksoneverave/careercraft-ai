import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar'
import { TOOLS } from '../lib/tools'

export default function Dashboard() {
  const { profile, isPro, canGenerate } = useAuth()
  const navigate = useNavigate()
  const name  = profile?.full_name?.split(' ')[0] || 'there'
  const used  = profile?.docs_used  ?? 0
  const limit = profile?.docs_limit ?? 2
  const plan  = profile?.plan ?? 'free'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">{greeting}, {name} 👋</span>
          <div className="cc-topbar-right">
            <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>
              {isPro ? '⚡ Pro plan — unlimited docs' : `${used} / ${limit} free docs used this month`}
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

          {/* Stats */}
          <div className="cc-stats">
            {[
              { val: used,         label: 'Documents created' },
              { val: TOOLS.length, label: 'Career tools' },
              { val: plan.toUpperCase(), label: 'Current plan' },
              { val: isPro ? '∞' : limit - used > 0 ? limit - used : 0, label: isPro ? 'Docs available' : 'Docs remaining' },
            ].map(s => (
              <div key={s.label} className="cc-stat">
                <div className="cc-stat-val">{s.val}</div>
                <div className="cc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tool cards */}
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', marginBottom: '1rem' }}>
            Choose a career tool
          </h2>

          <div className="cc-tool-grid">
            {TOOLS.map(tool => (
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
