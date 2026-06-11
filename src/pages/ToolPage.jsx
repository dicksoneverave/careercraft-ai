import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'
import Sidebar from '../components/Sidebar'
import ATSRing from '../components/ATSRing'
import { TOOL_MAP } from '../lib/tools'
import { downloadPDF, downloadDOCX } from '../lib/export'
import { supabase } from '../lib/supabase'

const STEPS = ['fill', 'result']

export default function ToolPage() {
  const { toolId }  = useParams()
  const navigate    = useNavigate()
  const { profile, isPro, canGenerate, refreshProfile } = useAuth()
  const toast       = useToast()
  const tool        = TOOL_MAP[toolId]

  const [step,       setStep]       = useState('fill')
  const [fields,     setFields]     = useState({})
  const [generating, setGenerating] = useState(false)
  const [result,     setResult]     = useState('')
  const [atsScore,   setAtsScore]   = useState(0)
  const [docTitle,   setDocTitle]   = useState('')
  const [dlLoading,  setDlLoading]  = useState(false)

  // Redirect to 404 if bad tool id
  useEffect(() => {
    if (!tool) navigate('/app')
  }, [tool, navigate])

  if (!tool) return null

  function setField(id, val) {
    setFields(prev => ({ ...prev, [id]: val }))
  }

  function isComplete() {
    return tool.fields
      .filter(f => f.type !== 'select')
      .every(f => (fields[f.id] || '').trim().length > 2)
  }

  // Compute a quick ATS score for resume tool
  function computeATS(content, jobDesc = '') {
    if (tool.id !== 'resume') return 0
    let score = 40
    const lower = content.toLowerCase()
    const actionVerbs = ['led','built','increased','reduced','managed','delivered','launched','designed','grew','improved','created','developed','implemented','achieved','exceeded']
    const hasVerbs = actionVerbs.filter(v => lower.includes(v)).length
    score += Math.min(hasVerbs * 3, 20) // up to 20
    if (/\d+%/.test(content)) score += 10
    if (/\$[\d,]+/.test(content)) score += 5
    if (content.toLowerCase().includes('skills')) score += 5
    if (content.toLowerCase().includes('experience')) score += 5
    if (jobDesc && jobDesc.length > 50) {
      const jdWords = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 4)
      const matches = jdWords.filter(w => lower.includes(w)).length
      score += Math.min(Math.round(matches / jdWords.length * 15), 15)
    }
    return Math.min(score, 98)
  }

  async function generate() {
    if (!canGenerate) {
      toast('Document limit reached. Please upgrade.', 'error')
      navigate('/app/pricing')
      return
    }

    setGenerating(true)
    try {
      const prompt = tool.systemPrompt(fields)
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId: profile.id })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const data = await res.json()
      const content = data.content

      setResult(content)
      const score = computeATS(content, fields.job_desc || '')
      setAtsScore(score)

      const dateStr = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
      const contextTitle = fields.target_role || fields.role || fields.company || fields.name || ''
      setDocTitle(`${tool.label}${contextTitle ? ' — ' + contextTitle : ''} · ${dateStr}`)
      setStep('result')

      // Save to Supabase
      await supabase.from('career_docs').insert({
        user_id:       profile.id,
        tool:          tool.id,
        title:         `${tool.label}${contextTitle ? ' — ' + contextTitle : ''}`,
        job_title:     fields.target_role || fields.role || null,
        company:       fields.company || null,
        word_count:    content.split(/\s+/).length,
        ats_score:     tool.id === 'resume' ? score : null,
        is_watermarked: !isPro,
      })

      await refreshProfile()
      toast(`${tool.label} generated!`, 'success')
    } catch (err) {
      toast(err.message || 'Something went wrong', 'error')
    } finally {
      setGenerating(false)
    }
  }

  async function handleDownload(format) {
    setDlLoading(true)
    try {
      const safe = docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 60)
      if (format === 'pdf') {
        await downloadPDF(result, safe, tool.label, !isPro)
      } else {
        await downloadDOCX(result, safe, tool.label, !isPro)
      }
      toast(`${format.toUpperCase()} downloaded!`, 'success')
    } catch {
      toast('Download failed. Try again.', 'error')
    } finally {
      setDlLoading(false)
    }
  }

  return (
    <div className="cc-shell">
      <Sidebar />
      <div className="cc-main">
        <div className="cc-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            {step === 'result' && (
              <button className="btn btn-ghost btn-sm" onClick={() => { setStep('fill'); setResult('') }}>
                ← Edit
              </button>
            )}
            <span className="cc-topbar-title">
              {tool.icon} {tool.label}
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-faint)', fontStyle: 'italic' }}>{tool.tagline}</span>
          </div>

          {/* Step indicator */}
          <div className="cc-steps" style={{ gap: 0 }}>
            {['Fill in details', 'Your document'].map((label, i) => {
              const stepKeys = ['fill', 'result']
              const curIdx   = stepKeys.indexOf(step)
              const isDone   = curIdx > i
              const isActive = curIdx === i
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <div className={`cc-step-line ${isDone ? 'done' : ''}`} />}
                  <div className={`cc-step-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                    {isDone ? '✓' : i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="cc-page">

          {/* ── Fill form ── */}
          {step === 'fill' && !generating && (
            <div className="cc-fadein" style={{ maxWidth: 640 }}>
              {/* Tool info banner */}
              <div style={{ background: tool.colorLight, border: `1px solid ${tool.color}30`, borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tool.color }}>{tool.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-mid)', marginTop: 2, lineHeight: 1.5 }}>{tool.description}</div>
                </div>
              </div>

              {tool.fields.map(f => (
                <div className="cc-form-group" key={f.id}>
                  <label className="cc-label cc-label-req">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="cc-textarea"
                      placeholder={f.placeholder}
                      value={fields[f.id] || ''}
                      onChange={e => setField(f.id, e.target.value)}
                      rows={f.id === 'job_desc' ? 5 : 4}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      className="cc-select"
                      value={fields[f.id] || f.options[0]}
                      onChange={e => setField(f.id, e.target.value)}
                    >
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      className="cc-input"
                      type="text"
                      placeholder={f.placeholder}
                      value={fields[f.id] || ''}
                      onChange={e => setField(f.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              {!isPro && (
                <div style={{ fontSize: 12, color: 'var(--ink-light)', background: 'var(--amber-faint)', borderLeft: `3px solid var(--amber)`, borderRadius: 'var(--radius-sm)', padding: '.6rem .9rem', marginBottom: '1.25rem' }}>
                  Free plan: document will include a CareerCraft watermark.{' '}
                  <button style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: 12 }} onClick={() => navigate('/app/pricing')}>
                    Upgrade to remove it →
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                <button
                  className={`btn btn-primary btn-lg`}
                  onClick={generate}
                  disabled={!isComplete()}
                >
                  ✨ Generate {tool.shortLabel}
                </button>
                <button className="btn btn-ghost" onClick={() => navigate('/app')}>Cancel</button>
              </div>
            </div>
          )}

          {/* ── Generating ── */}
          {generating && (
            <div className="cc-generating">
              <div style={{ fontSize: 32 }}>{tool.icon}</div>
              <div className="cc-gen-dots">
                <div className="cc-gen-dot" />
                <div className="cc-gen-dot" />
                <div className="cc-gen-dot" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>
                Writing your {tool.label.toLowerCase()}…
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-light)' }}>
                Claude AI is crafting a tailored, professional document. 10–20 seconds.
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {step === 'result' && result && !generating && (
            <div className="cc-fadein">
              {/* Score + meta row */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {tool.id === 'resume' && (
                  <div className="cc-card cc-card-sm" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <ATSRing score={atsScore} size={90} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: '.2rem' }}>ATS Readiness</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-light)', lineHeight: 1.5, maxWidth: 160 }}>
                        {atsScore >= 80
                          ? 'Strong keyword match. This resume should pass ATS filters well.'
                          : atsScore >= 60
                          ? 'Decent. Consider adding more specific keywords from the job description.'
                          : 'Needs improvement. Add quantified achievements and job-specific keywords.'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="cc-card cc-card-sm" style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: '.3rem' }}>Document title</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{docTitle}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)', marginTop: '.3rem' }}>
                    {result.split(/\s+/).length} words · {isPro ? 'Pro — no watermark' : 'Free — watermarked'}
                  </div>
                </div>
              </div>

              {/* Document preview */}
              <div className="cc-doc-preview" style={{ marginBottom: '1rem' }}>
                <div className="cc-doc-header">
                  <div className="cc-doc-title">
                    <span>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </div>
                  <span className="cc-doc-meta">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="cc-doc-body">
                  {result}
                  {!isPro && (
                    <div className="cc-doc-fade">
                      <div className="cc-doc-fade-text">
                        🔒 Watermarked on free plan ·{' '}
                        <button style={{ background: 'none', border: 'none', color: 'var(--green)', fontWeight: 700, cursor: 'pointer', fontSize: 12 }} onClick={() => navigate('/app/pricing')}>
                          Upgrade to Pro
                        </button>{' '}
                        for clean downloads
                      </div>
                    </div>
                  )}
                </div>

                <div className="cc-download-bar">
                  <span style={{ fontSize: 13, color: 'var(--ink-light)', flexShrink: 0 }}>Download as:</span>

                  <button
                    className={`btn btn-outline btn-sm ${dlLoading ? 'btn-spin' : ''}`}
                    onClick={() => handleDownload('pdf')}
                    disabled={dlLoading}
                  >
                    {!dlLoading && '📄 PDF'}
                  </button>

                  <button
                    className={`btn btn-sm ${isPro ? 'btn-outline' : 'btn-ghost'} ${dlLoading ? 'btn-spin' : ''}`}
                    onClick={() => isPro ? handleDownload('docx') : navigate('/app/pricing')}
                    disabled={dlLoading}
                    title={!isPro ? 'DOCX available on Pro plan' : 'Download as DOCX'}
                  >
                    {!dlLoading && (
                      <>📝 DOCX {!isPro && <span style={{ fontSize: 10, background: 'var(--green-faint)', color: 'var(--green)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>Pro</span>}</>
                    )}
                  </button>

                  <div style={{ flex: 1 }} />

                  <button className="btn btn-ghost btn-sm" onClick={() => { setStep('fill'); setResult(''); setAtsScore(0) }}>
                    ← Edit inputs
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app')}>
                    New document
                  </button>
                </div>
              </div>

              {/* Upsell for free users */}
              {!isPro && (
                <div style={{ background: 'linear-gradient(135deg, var(--green) 0%, #2D5016 100%)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '.3rem' }}>
                      ⚡ Upgrade to Pro — $15/month
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
                      Unlimited documents · No watermarks · PDF + DOCX · All 4 tools
                    </div>
                  </div>
                  <button className="btn btn-amber" onClick={() => navigate('/app/pricing')}>
                    Upgrade now →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
