const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, plan } = req.body
  if (!userId || !plan) return res.status(400).json({ error: 'Missing userId or plan' })

  const priceMap = {
    pro:     process.env.VITE_PADDLE_PRO_PRICE_ID,
    premium: process.env.VITE_PADDLE_PREMIUM_PRICE_ID,
  }
  const priceId = priceMap[plan]
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' })

  // Verify user exists
  const { data: profile, error: pErr } = await supabase
    .from('profiles').select('id').eq('id', userId).single()
  if (pErr || !profile) return res.status(401).json({ error: 'User not found' })

  const isProduction = process.env.PADDLE_ENV === 'production'
  const paddleBase   = isProduction ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com'

  try {
    const paddleRes = await fetch(`${paddleBase}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        items:       [{ price_id: priceId, quantity: 1 }],
        custom_data: { userId },
      }),
    })

    const paddleData = await paddleRes.json()
    if (!paddleRes.ok) {
      console.error('Paddle error:', paddleData)
      return res.status(502).json({ error: 'Could not create checkout session. Try again.' })
    }

    const transactionId = paddleData.data?.id
    if (!transactionId) return res.status(502).json({ error: 'No transaction ID from Paddle.' })

    return res.json({ transactionId })
  } catch (err) {
    console.error('create-checkout error:', err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}
