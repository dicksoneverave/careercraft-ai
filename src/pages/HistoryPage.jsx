import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Sidebar'
import ATSRing from '../components/ATSRing'
import { supabase } from '../lib/supabase'
import { TOOL_MAP } from '../lib/tools'

export default function HistoryPage() {
  const { profile } = useAuth()
  const navigate    = useNavigate()
  const [docs,    setDocs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')

  useEffect(() => {
    if (!profile) return
    supabase
      .from('career_docs')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => { setDocs(data || []); setLoading(false) })
  }, [profile])

  const filtered = filter === 'all' ? docs : docs.filter(d => d.tool === filter)

  const toolCounts = docs.reduce((acc, d) => {
    acc[d.tool] = (acc[d.tool] || 0) + 1
    return acc
  }, {})

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <span className="cc-topbar-title">My documents</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/app')}>+ New document</button>
        </div>

        <div className="cc-page">
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[{ id: 'all', label: `All (${docs.length})` }, ...Object.entries(TOOL_MAP).map(([id, t]) => ({ id, label: `${t.icon} ${t.shortLabel} (${toolCounts[id] || 0})` }))].map(f => (
              <button
                key={f.id}
                className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="cc-spin-wrap">
              <div className="cc-spinner" />
              <p style={{ marginTop: '1rem', color: 'var(--ink-light)', fontSize: 13 }}>Loading your documents…</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="cc-empty">
              <div className="cc-empty-icon">📂</div>
              <h3>{filter === 'all' ? 'No documents yet' : `No ${TOOL_MAP[filter]?.label || filter} docs yet`}</h3>
              <p>{filter === 'all' ? 'Generate your first career document to see it here.' : `Use the ${TOOL_MAP[filter]?.label} tool to create your first one.`}</p>
              <button className="btn btn-primary" onClick={() => navigate(filter === 'all' ? '/app' : `/app/tool/${filter}`)}>
                {filter === 'all' ? 'Choose a tool' : `Open ${TOOL_MAP[filter]?.label}`}
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="cc-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Tool</th>
                    <th>For role / company</th>
                    <th>ATS</th>
                    <th>Plan</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(doc => {
                    const tool = TOOL_MAP[doc.tool]
                    return (
                      <tr key={doc.id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {tool?.icon} {doc.title}
                          </div>
                          {doc.word_count && (
                            <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                              {doc.word_count} words
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="cc-badge cc-badge-green">{tool?.label || doc.tool}</span>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--ink-mid)' }}>
                          {[doc.job_title, doc.company].filter(Boolean).join(' · ') || '—'}
                        </td>
                        <td>
                          {doc.ats_score != null
                            ? <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                                <ATSRing score={doc.ats_score} size={36} animate={false} />
                                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>{doc.ats_score}</span>
                              </div>
                            : <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>—</span>
                          }
                        </td>
                        <td>
                          {doc.is_watermarked
                            ? <span className="cc-badge cc-badge-amber">Free</span>
                            : <span className="cc-badge cc-badge-green">Pro</span>
                          }
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--ink-light)' }}>
                          {new Date(doc.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
