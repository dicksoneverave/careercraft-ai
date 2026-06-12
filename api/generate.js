const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, userId } = req.body
  if (!prompt || !userId) return res.status(400).json({ error: 'Missing prompt or userId' })

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
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const errData = await anthropicRes.json()
      console.error('Anthropic error:', errData)
      return res.status(500).json({ error: 'AI generation failed. Please try again.' })
    }

    const aiData  = await anthropicRes.json()
    const content = aiData.content?.[0]?.text || ''
    if (!content) return res.status(500).json({ error: 'Empty response. Please try again.' })

    await supabase
      .from('profiles')
      .update({ docs_used: profile.docs_used + 1, updated_at: new Date().toISOString() })
      .eq('id', userId)

    return res.json({ content })
  } catch (err) {
    console.error('Generate error:', err)
    return res.status(500).json({ error: 'Server error. Please try again.' })
  }
}
