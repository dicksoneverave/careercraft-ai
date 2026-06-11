import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'

export default function AccountPage() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const plan = profile?.plan || 'free'

  async function sendReset() {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email)
    toast(error ? 'Failed to send reset email' : 'Password reset email sent!', error ? 'error' : 'success')
    setLoading(false)
  }

  const initial = (profile?.full_name || user?.email || 'U')[0].toUpperCase()

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">Account</span>
        </div>

        <div className="cc-page" style={{ maxWidth: 560 }}>
          {/* Profile */}
          <div className="cc-card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem', color: 'var(--green)' }}>Profile</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>
                {initial}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{profile?.full_name || '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>{user?.email}</div>
              </div>
            </div>
            <div className="cc-divider" />
            <button className={`btn btn-outline btn-sm ${loading ? 'btn-spin' : ''}`} onClick={sendReset} disabled={loading}>
              {!loading && '🔑 Send password reset'}
            </button>
          </div>

          {/* Subscription */}
          <div className="cc-card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem', color: 'var(--green)' }}>Subscription</h2>
            {[
              { label: 'Current plan', val: <span className={`cc-badge ${plan !== 'free' ? 'cc-badge-green' : 'cc-badge-amber'}`}>{plan.toUpperCase()}</span> },
              { label: 'Documents used', val: `${profile?.docs_used || 0} / ${profile?.docs_limit === 999 ? '∞' : profile?.docs_limit || 2}` },
              ...(profile?.subscription_end_date ? [{ label: 'Next billing date', val: new Date(profile.subscription_end_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--ink-mid)' }}>{row.label}</span>
                <span style={{ fontSize: 13 }}>{row.val}</span>
              </div>
            ))}
            {plan !== 'free' && (
              <>
                <div className="cc-divider" />
                <p style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
                  To cancel, visit <a href="https://paddle.com" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>Paddle billing portal</a> or email support@javetech.online
                </p>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="cc-card">
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: '1rem', color: 'var(--green)' }}>Usage</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
              {[
                { val: profile?.docs_used || 0, label: 'Total docs' },
                { val: plan.toUpperCase(), label: 'Plan' },
                { val: profile?.docs_limit === 999 ? '∞' : profile?.docs_limit || 2, label: 'Monthly limit' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '.75rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
