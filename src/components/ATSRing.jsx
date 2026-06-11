import { useEffect, useState } from 'react'

// Animated ATS score ring — the signature UI element of CareerCraft
export default function ATSRing({ score = 0, size = 110, animate = true }) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score)
  const r = (size / 2) - 10
  const circ = 2 * Math.PI * r
  const offset = circ - (displayed / 100) * circ

  const color = displayed >= 80 ? '#1A3D2B' : displayed >= 60 ? '#E8A020' : '#7C2D12'

  useEffect(() => {
    if (!animate) { setDisplayed(score); return }
    const timer = setTimeout(() => setDisplayed(score), 200)
    return () => clearTimeout(timer)
  }, [score, animate])

  return (
    <div className="ats-ring-wrap" style={{ width: size, height: size }}>
      <svg className="ats-ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ats-ring-track"
          cx={size / 2} cy={size / 2} r={r}
        />
        <circle
          className="ats-ring-fill"
          cx={size / 2} cy={size / 2} r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          stroke={color}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke .3s' }}
        />
      </svg>
      <div className="ats-ring-label">
        <span className="ats-ring-num" style={{ color }}>{displayed}</span>
        <span className="ats-ring-sub">ATS score</span>
      </div>
    </div>
  )
}
