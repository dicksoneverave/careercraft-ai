import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/Toast'

export default function AuthPage({ mode = 'login' }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()
  const toast    = useToast()
  const isLogin  = mode === 'login'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/app')
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } }
        })
        if (error) throw error
        toast('Account created! Check your email to confirm.', 'success')
        navigate('/app')
      }
    } catch (err) {
      toast(err.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cc-auth-page">
      <div className="cc-auth-card">
        <div className="cc-auth-mark">
          <div className="cc-auth-mark-icon">C</div>
          <div style={{ fontSize: 13, color: '#718096', marginTop: 2 }}>CareerCraft AI</div>
        </div>

        <div className="cc-auth-title">{isLogin ? 'Welcome back' : 'Start your career upgrade'}</div>
        <div className="cc-auth-sub">
          {isLogin ? 'Sign in to your CareerCraft account' : '2 free career documents every month. No card required.'}
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="cc-form-group">
              <label className="cc-label cc-label-req">Full name</label>
              <input className="cc-input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="cc-form-group">
            <label className="cc-label cc-label-req">Email</label>
            <input className="cc-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="cc-form-group">
            <label className="cc-label cc-label-req">Password</label>
            <input className="cc-input" type="password" placeholder={isLogin ? '••••••••' : 'At least 8 characters'} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
          </div>
          <button type="submit" className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-spin' : ''}`} disabled={loading}>
            {!loading && (isLogin ? 'Sign in' : 'Create free account')}
          </button>
        </form>

        <div className="cc-auth-foot">
          {isLogin
            ? <><span>New here? </span><Link to="/signup">Create free account</Link></>
            : <><span>Already have an account? </span><Link to="/login">Sign in</Link></>
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '.75rem' }}>
          <Link to="/" style={{ fontSize: 12, color: '#A0AEC0', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
