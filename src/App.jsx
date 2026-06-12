import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './components/Toast'
import LandingPage  from './pages/LandingPage'
import AuthPage     from './pages/AuthPage'
import Dashboard    from './pages/Dashboard'
import ToolPage     from './pages/ToolPage'
import HistoryPage  from './pages/HistoryPage'
import PricingPage  from './pages/PricingPage'
import AccountPage  from './pages/AccountPage'
import './styles/global.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off-white)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'cc-spin .7s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-light)' }}>Loading…</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/app" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/"       element={<LandingPage />} />
            <Route path="/login"  element={<PublicRoute><AuthPage mode="login"  /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><AuthPage mode="signup" /></PublicRoute>} />

            <Route path="/app"              element={<PrivateRoute><Dashboard   /></PrivateRoute>} />
            <Route path="/app/tool/:toolId" element={<PrivateRoute><ToolPage    /></PrivateRoute>} />
            <Route path="/app/history"      element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            <Route path="/app/pricing"      element={<PrivateRoute><PricingPage /></PrivateRoute>} />
            <Route path="/app/account"      element={<PrivateRoute><AccountPage /></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
