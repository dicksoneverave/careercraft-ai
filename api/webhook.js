const crypto = require('crypto')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Disable body parsing — need raw body for HMAC verification
export const config = { api: { bodyParser: false } }

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end',  () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const rawBody = await getRawBody(req)
  const sig     = req.headers['paddle-signature']
  const secret  = process.env.PADDLE_WEBHOOK_SECRET

  if (!sig || !secret) return res.status(400).send('Bad request')

  try {
    const body               = rawBody.toString('utf8')
    const [tsPart, h1Part]   = sig.split(';')
    const ts                 = tsPart.replace('ts=', '')
    const h1                 = h1Part.replace('h1=', '')
    const expected           = crypto.createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected))) {
      return res.status(403).send('Forbidden')
    }
  } catch {
    return res.status(400).send('Bad request')
  }

  const { event_type, data } = JSON.parse(rawBody.toString('utf8'))
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

    if (!userId) return res.status(200).send('OK')

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
        await supabase.from('profiles').update({ docs_used: 0 }).eq('id', userId)
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
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
  }

  return res.status(200).send('OK')
}
