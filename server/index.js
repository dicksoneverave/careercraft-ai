// ============================================================
// CareerCraft AI — Backend Server
// POST /api/generate  — Claude API proxy (key stays server-side)
// POST /api/webhook   — Paddle subscription webhook handler
// POST /api/admin/reset-usage — monthly quota reset (cron)
//
// Run: node server/index.js
// Deploy to Railway, Render, or any Node host
// ============================================================

const express = require('express')
const cors    = require('cors')
const crypto  = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const app  = express()
const PORT = process.env.PORT || 3002

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Raw body needed for webhook sig verification
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(cors({ origin: process.env.VITE_APP_URL || '*' }))
app.use(express.json())

// ── Health ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'careercraft', ts: new Date().toISOString() }))

// ── POST /api/create-checkout ───────────────────────────────
// Creates a Paddle transaction server-side and returns the transaction ID.
// The frontend then redirects to pay.javetech.online/careercraft?_ptxn=TXN_ID
app.post('/api/create-checkout', async (req, res) => {
  const { userId, plan } = req.body
  if (!userId || !plan) return res.status(400).json({ error: 'Missing userId or plan' })

  const priceMap = {
    pro:     process.env.VITE_PADDLE_PRO_PRICE_ID,
    premium: process.env.VITE_PADDLE_PREMIUM_PRICE_ID,
  }
  const priceId = priceMap[plan]
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' })

  const paddleEnv = process.env.PADDLE_ENV === 'production' ? 'production' : 'sandbox'
  const paddleBase = paddleEnv === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com'

  try {
    const paddleRes = await fetch(`${paddleBase}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: { userId },
      }),
    })

    const paddleData = await paddleRes.json()
    if (!paddleRes.ok) {
      console.error('Paddle create-transaction error:', paddleData)
      return res.status(502).json({ error: 'Could not create checkout session. Try again.' })
    }

    const transactionId = paddleData.data?.id
    if (!transactionId) return res.status(502).json({ error: 'No transaction ID returned by Paddle.' })

    return res.json({ transactionId })
  } catch (err) {
    console.error('create-checkout error:', err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// ── POST /api/generate ──────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { prompt, userId } = req.body
  if (!prompt || !userId) return res.status(400).json({ error: 'Missing prompt or userId' })

  // Verify user + quota
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('docs_used, docs_limit, plan')
    .eq('id', userId)
    .single()

  if (pErr || !profile) return res.status(401).json({ error: 'User not found' })
  if (profile.docs_used >= profile.docs_limit) {
    return res.status(403).json({ error: 'Monthly limit reached. Upgrade your plan to continue.' })
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: 'You are an expert career coach and professional writer. Write detailed, specific, tailored career documents. Never use generic filler. Always use the exact details provided by the user. Format clearly with headings and sections.',
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json()
      console.error('Anthropic error:', errData)
      return res.status(500).json({ error: 'AI generation failed. Please try again.' })
    }

    const aiData  = await anthropicRes.json()
    const content = aiData.content?.[0]?.text || ''

    if (!content) return res.status(500).json({ error: 'Empty response. Please try again.' })

    // Increment usage count
    await supabase
      .from('profiles')
      .update({ docs_used: profile.docs_used + 1, updated_at: new Date().toISOString() })
      .eq('id', userId)

    return res.json({ content })
  } catch (err) {
    console.error('Generate error:', err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// ── POST /api/webhook ───────────────────────────────────────
// Set URL in Paddle Dashboard > Developer Tools > Notifications:
//   https://javetech.online/careercraft/api/webhook
//
// Subscribe to events:
//   subscription.activated, subscription.updated,
//   subscription.canceled, subscription.past_due
//
app.post('/api/webhook', async (req, res) => {
  const sig    = req.headers['paddle-signature']
  const secret = process.env.PADDLE_WEBHOOK_SECRET

  if (!sig || !secret) {
    console.warn('Webhook: missing sig or secret')
    return res.status(400).send('Bad request')
  }

  // Verify Paddle HMAC signature
  try {
    const body    = req.body.toString('utf8')
    const [tsPart, h1Part] = sig.split(';')
    const ts = tsPart.replace('ts=', '')
    const h1 = h1Part.replace('h1=', '')
    const expected = crypto.createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')

    if (!crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected))) {
      console.warn('Webhook: signature mismatch')
      return res.status(403).send('Forbidden')
    }
  } catch (err) {
    console.error('Sig verification error:', err)
    return res.status(400).send('Bad request')
  }

  const event = JSON.parse(req.body.toString('utf8'))
  const { event_type, data } = event

  console.log(`Paddle webhook: ${event_type}`)

  try {
    const userId           = data?.custom_data?.userId
    const paddleCustomerId = data?.customer_id
    const paddleSubId      = data?.id
    const status           = data?.status
    const endDate          = data?.current_billing_period?.ends_at
    const priceId          = data?.items?.[0]?.price?.id || ''

    let plan = 'free'
    if (priceId === process.env.VITE_PADDLE_PRO_PRICE_ID)     plan = 'pro'
    if (priceId === process.env.VITE_PADDLE_PREMIUM_PRICE_ID) plan = 'premium'

    if (!userId) {
      console.warn('Webhook: no userId in customData')
      return res.status(200).send('OK')
    }

    switch (event_type) {
      case 'subscription.activated':
      case 'subscription.updated':
        await supabase.rpc('update_subscription', {
          p_user_id:            userId,
          p_plan:               plan,
          p_paddle_customer_id: paddleCustomerId,
          p_paddle_sub_id:      paddleSubId,
          p_status:             status === 'active' ? 'active' : status,
          p_end_date:           endDate,
        })
        // Reset usage counter on new subscription
        await supabase.from('profiles').update({ docs_used: 0 }).eq('id', userId)
        console.log(`Plan updated to ${plan} for user ${userId}`)
        break

      case 'subscription.canceled':
        await supabase.rpc('update_subscription', {
          p_user_id:            userId,
          p_plan:               'free',
          p_paddle_customer_id: paddleCustomerId,
          p_paddle_sub_id:      paddleSubId,
          p_status:             'cancelled',
          p_end_date:           endDate,
        })
        await supabase.from('profiles').update({ docs_limit: 2 }).eq('id', userId)
        break

      case 'subscription.past_due':
        await supabase.from('profiles').update({ subscription_status: 'past_due' }).eq('id', userId)
        break

      default:
        console.log(`Unhandled: ${event_type}`)
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Still return 200 so Paddle doesn't retry
  }

  return res.status(200).send('OK')
})

// ── Monthly usage reset ──────────────────────────────────────
// Call this on 1st of each month via cron / GitHub Action / Supabase Edge Function
// curl -X POST https://your-server/api/admin/reset-usage -H "Authorization: Bearer YOUR_ADMIN_SECRET"
app.post('/api/admin/reset-usage', async (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(403).send('Forbidden')
  }
  const { error } = await supabase
    .from('profiles')
    .update({ docs_used: 0 })
    .eq('plan', 'free')

  if (error) return res.status(500).json({ error })
  console.log('Monthly usage reset complete:', new Date().toISOString())
  res.json({ ok: true, reset: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`CareerCraft API running on port ${PORT}`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
})
