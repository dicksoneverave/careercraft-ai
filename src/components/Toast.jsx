import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((msg, type = 'info', ms = 3500) => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '.5rem',
            padding: '.75rem 1.1rem', borderRadius: 10, maxWidth: 340,
            fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,.18)',
            animation: 'cc-slidein .2s ease-out',
            background: t.type === 'success' ? '#1A3D2B' : t.type === 'error' ? '#7C2D12' : '#1e293b',
            color: 'white'
          }}>
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
