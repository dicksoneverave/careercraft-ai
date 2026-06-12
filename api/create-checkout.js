// Vercel serverless function: POST /api/create-checkout
// Body: { priceId, userId, email }
// Returns: { transactionId, checkoutUrl }

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { priceId, userId, email } = req.body
  if (!priceId || !userId) return res.status(400).json({ error: 'Missing priceId or userId.' })

  const apiKey    = process.env.PADDLE_API_KEY
  const isSandbox = (process.env.PADDLE_ENV || 'sandbox') === 'sandbox'
  const baseUrl   = isSandbox ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com'
  const returnUrl = 'https://pay.javetech.online/careercraft'

  if (!apiKey) return res.status(500).json({ error: 'Paddle API key not configured.' })

  const cleanKey = apiKey.trim()

  const payload = {
    items: [{ price_id: priceId, quantity: 1 }],
    checkout: { url: returnUrl },
    ...(email ? { customer: { email } } : {}),
    custom_data: { userId },
  }

  console.log('[checkout] env:', isSandbox ? 'sandbox' : 'live')
  console.log('[checkout] api:', baseUrl)
  console.log('[checkout] keyPrefix:', cleanKey.slice(0, 20) + '...')
  console.log('[checkout] payload:', JSON.stringify(payload))

  try {
    const paddleRes = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await paddleRes.json()
    console.log('[checkout] paddle full response:', JSON.stringify(data))

    if (!paddleRes.ok) {
      return res.status(500).json({ error: data?.error?.detail || 'Failed to create checkout.' })
    }

    const transactionId = data?.data?.id
    if (!transactionId) {
      return res.status(500).json({ error: 'No transaction ID returned from Paddle.' })
    }

    const checkoutUrl = `${returnUrl}?_ptxn=${transactionId}`
    return res.json({ transactionId, checkoutUrl })
  } catch (err) {
    console.error('Create-checkout error:', err.message)
    return res.status(500).json({ error: 'Server error creating checkout.' })
  }
}
