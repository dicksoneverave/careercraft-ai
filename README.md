# CareerCraft AI — Complete Deployment Guide

> Four AI career tools. One subscription. Deploy at `javetech.online/careercraft`.

---

## What's included

| Tool             | What it does |
|------------------|-------------|
| 📄 Resume Builder    | ATS-optimised resume with keyword tailoring + live ATS score ring |
| ✉️ Cover Letter      | Tailored, compelling cover letter — not a resume summary |
| 💼 LinkedIn Summary  | About section + 5 headline variations |
| 🎯 Interview Prep    | 10 likely questions + STAR model answers + questions to ask |

**Stack:** React + Vite · Supabase (auth + DB) · Claude API (claude-sonnet-4) · Paddle (payments) · Node/Express (backend) · Vercel (hosting)

---

## Pricing tiers

| Plan    | Price    | Docs/month | DOCX | ATS Score |
|---------|----------|-----------|------|-----------|
| Free    | $0       | 2          | ✗    | ✗         |
| Pro     | $15/mo   | Unlimited  | ✓    | ✓         |
| Premium | $29/mo   | Unlimited  | ✓    | ✓ + LinkedIn DMs, salary guides |

---

## Step 1 — Supabase setup (15 min)

1. Go to https://supabase.com → New project → name it `careercraft-ai`
2. Settings → API → copy **Project URL** and **anon key** and **service_role key**
3. SQL Editor → New Query → paste `supabase-schema.sql` → Run
4. Authentication → Settings:
   - Site URL: `https://javetech.online/careercraft`
   - Add redirect: `https://javetech.online/careercraft/app`

---

## Step 2 — Anthropic API (5 min)

1. https://console.anthropic.com → API Keys → Create key
2. Save as `ANTHROPIC_API_KEY` — server only, never expose to frontend

---

## Step 3 — Paddle setup (20 min)

1. Sign up / log in at https://paddle.com
2. **Catalog → Products → New product → "CareerCraft Pro"**
   - Price: $15.00 USD, Monthly recurring
   - Copy Price ID → `VITE_PADDLE_PRO_PRICE_ID`
3. **New product → "CareerCraft Premium"**
   - Price: $29.00 USD, Monthly recurring
   - Copy Price ID → `VITE_PADDLE_PREMIUM_PRICE_ID`
4. **Developer Tools → Authentication**
   - Copy Client-side token → `VITE_PADDLE_CLIENT_TOKEN`
   - Copy API key → `PADDLE_API_KEY`
5. **Developer Tools → Notifications → New notification**
   - URL: `https://YOUR_SERVER/api/webhook`
   - Events: `subscription.activated`, `subscription.updated`, `subscription.canceled`, `subscription.past_due`
   - Copy webhook secret → `PADDLE_WEBHOOK_SECRET`

> Use https://sandbox-vendors.paddle.com for testing first. Uncomment the sandbox line in `PricingPage.jsx`.

---

## Step 4 — Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # server only

ANTHROPIC_API_KEY=sk-ant-...         # server only

VITE_PADDLE_CLIENT_TOKEN=...
PADDLE_API_KEY=...
PADDLE_WEBHOOK_SECRET=...
VITE_PADDLE_PRO_PRICE_ID=pri_...
VITE_PADDLE_PREMIUM_PRICE_ID=pri_...

VITE_APP_URL=https://javetech.online/careercraft
ADMIN_SECRET=random-long-string
PORT=3002
```

---

## Step 5 — Run locally

**Terminal 1 — Frontend:**
```bash
cd careercraft
npm install
npm run dev
# Opens at http://localhost:5173/careercraft
```

**Terminal 2 — Backend:**
```bash
cd careercraft/server
npm install
node index.js
# Runs at http://localhost:3002
```

Test flow:
1. Sign up, verify email
2. Pick Resume Builder, fill all fields, click Generate
3. Check the ATS score ring animates
4. Download PDF — should have watermark (free plan)
5. Test Paddle sandbox checkout (card: 4242 4242 4242 4242)
6. After payment, plan should update to Pro in Supabase profiles table
7. Verify DOCX download works and watermark is gone

---

## Step 6 — Deploy frontend to Vercel

```bash
npm i -g vercel
cd careercraft
vercel
# Project name: careercraft-ai
# Framework: Vite
```

Set environment variables in Vercel dashboard:
- Only `VITE_*` variables (not the server-only ones)

Add domain in Vercel → Settings → Domains:
- `javetech.online` with path prefix `/careercraft`
- Or subdomain: `careercraft.javetech.online`

---

## Step 7 — Deploy backend to Railway

```bash
npm i -g @railway/cli
railway login
cd careercraft/server
railway init
railway up
# Set all non-VITE env vars in Railway dashboard
railway domain  # copy your server URL
```

Then update Paddle webhook URL to your Railway server URL.

---

## Step 8 — Monthly usage reset

Free users get 2 docs/month. Reset on the 1st of each month.

**Option: GitHub Actions (free)**

Create `.github/workflows/reset.yml`:
```yaml
on:
  schedule:
    - cron: '0 0 1 * *'
jobs:
  reset:
    runs-on: ubuntu-latest
    steps:
      - run: curl -X POST ${{ secrets.SERVER_URL }}/api/admin/reset-usage -H "Authorization: Bearer ${{ secrets.ADMIN_SECRET }}"
```

---

## Launch checklist

- [ ] Supabase schema deployed + auth URLs set
- [ ] All 4 tools generate correct output
- [ ] ATS ring animates on resume result
- [ ] PDF download works with/without watermark
- [ ] DOCX downloads on Pro, blocked/prompted on free
- [ ] Paddle sandbox checkout completes
- [ ] Webhook updates plan in Supabase (check profiles table)
- [ ] Switch Paddle to production
- [ ] Remove `Paddle.Environment.set('sandbox')` comment in PricingPage.jsx
- [ ] Submit to Product Hunt + r/resumes + r/careerguidance + Show HN

---

## Project structure

```
careercraft/
├── src/
│   ├── components/
│   │   ├── ATSRing.jsx       — Animated ATS score ring (signature element)
│   │   ├── Sidebar.jsx       — App navigation with tool colour dots
│   │   └── Toast.jsx         — Notification system
│   ├── hooks/
│   │   └── useAuth.jsx       — Auth context + profile
│   ├── lib/
│   │   ├── supabase.js       — Supabase client
│   │   ├── tools.js          — All 4 tools: fields + Claude prompts
│   │   └── export.js         — PDF + DOCX with CareerCraft branding
│   ├── pages/
│   │   ├── LandingPage.jsx   — Public homepage with animated hero
│   │   ├── AuthPage.jsx      — Login / signup
│   │   ├── Dashboard.jsx     — App home with tool cards
│   │   ├── ToolPage.jsx      — Generates docs for any of the 4 tools
│   │   ├── HistoryPage.jsx   — All past documents with filter tabs
│   │   ├── PricingPage.jsx   — 3-tier pricing + Paddle checkout
│   │   └── AccountPage.jsx   — Account + subscription management
│   ├── styles/global.css     — Full design system (forest green + amber)
│   ├── App.jsx               — Router
│   └── main.jsx
├── server/index.js           — Express: Claude proxy + Paddle webhooks
├── supabase-schema.sql
├── .env.example
├── vercel.json
└── README.md
```

---

## Adding a 5th tool

Edit `src/lib/tools.js`:
1. Add a new object to the `TOOLS` array
2. Define `fields[]` and `systemPrompt()`
3. It automatically appears in the sidebar, dashboard, and history

---

## Income targets

| Subscribers | MRR |
|-------------|-----|
| 20 Pro      | $300 |
| 50 Pro      | $750 |
| 67 Pro      | ~$1,000 ← first milestone |
| 20 Pro + 15 Premium | $735 |

---

support@javetech.online
