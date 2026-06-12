const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(403).send('Forbidden')
  }

  const { error } = await supabase
    .from('profiles')
    .update({ docs_used: 0 })
    .eq('plan', 'free')

  if (error) return res.status(500).json({ error })
  return res.json({ ok: true, reset: new Date().toISOString() })
}
