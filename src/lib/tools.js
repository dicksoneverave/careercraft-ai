// ============================================================
// CareerCraft AI — Tool Definitions
// 4 tools: Resume, Cover Letter, LinkedIn Summary, Interview Prep
// Each defines: id, label, icon, color, fields[], systemPrompt()
// ============================================================

export const TOOLS = [
  // ── 1. RESUME BUILDER ─────────────────────────────────────
  {
    id: 'resume',
    label: 'Resume Builder',
    shortLabel: 'Resume',
    icon: '📄',
    color: '#1A3D2B',
    colorLight: '#EBF3EE',
    tagline: 'ATS-optimised. Recruiter-ready.',
    description: 'Paste your experience and target role. Get a clean, ATS-friendly resume that beats the bots and impresses humans.',
    fields: [
      { id: 'full_name',     label: 'Your full name',            type: 'text',     placeholder: 'Jane Smith' },
      { id: 'email',         label: 'Email & phone',             type: 'text',     placeholder: 'jane@email.com · +1 555 000 0000' },
      { id: 'location',      label: 'Location',                  type: 'text',     placeholder: 'New York, NY (open to remote)' },
      { id: 'target_role',   label: 'Job title you\'re targeting', type: 'text',   placeholder: 'Senior Product Manager' },
      { id: 'summary',       label: 'Career summary (rough notes)', type: 'textarea', placeholder: 'Who you are, what you\'re good at, what you want next...' },
      { id: 'experience',    label: 'Work experience',           type: 'textarea', placeholder: 'Company, title, dates, key achievements for each role. Bullet points fine.' },
      { id: 'education',     label: 'Education',                 type: 'textarea', placeholder: 'Degree, institution, graduation year...' },
      { id: 'skills',        label: 'Skills & tools',            type: 'text',     placeholder: 'Python, SQL, Figma, Jira, Agile, Tableau...' },
      { id: 'job_desc',      label: 'Job description (optional)', type: 'textarea', placeholder: 'Paste the JD to tailor keywords for ATS...' },
    ],
    systemPrompt: (f) => `You are an expert resume writer and ATS specialist. Write a professional, ATS-optimised resume.

Output the resume in clean plain text using these sections:
${f.full_name}
${f.email} | ${f.location}

PROFESSIONAL SUMMARY
[2-3 tight sentences tailored to the target role]

WORK EXPERIENCE
[For each role: Company | Title | Dates, then 4-6 bullet points starting with strong action verbs and quantified achievements]

EDUCATION
[Degree | Institution | Year]

SKILLS
[Comma-separated, ATS-keyword-rich]

Candidate details:
- Name: ${f.full_name}
- Contact: ${f.email}
- Location: ${f.location}
- Target role: ${f.target_role}
- Career summary notes: ${f.summary}
- Experience: ${f.experience}
- Education: ${f.education}
- Skills: ${f.skills}
${f.job_desc ? `- Job description to tailor for: ${f.job_desc}` : ''}

Rules:
- Every bullet must start with a past-tense action verb (Led, Built, Increased, Reduced...)
- Quantify achievements wherever possible (%, $, time saved, team size)
- Incorporate keywords from the job description naturally
- Keep it to one page worth of content unless experience warrants two
- Use standard section headings that ATS systems recognise
- No tables, columns, or graphics — ATS-safe plain structure`
  },

  // ── 2. COVER LETTER ───────────────────────────────────────
  {
    id: 'cover_letter',
    label: 'Cover Letter',
    shortLabel: 'Cover Letter',
    icon: '✉️',
    color: '#2D5016',
    colorLight: '#EEF4E8',
    tagline: 'Not a summary of your resume. A reason to hire you.',
    description: 'Tell the story your resume can\'t. A compelling cover letter that addresses exactly what this employer needs.',
    fields: [
      { id: 'your_name',     label: 'Your name',                 type: 'text',     placeholder: 'Jane Smith' },
      { id: 'company',       label: 'Company name',              type: 'text',     placeholder: 'Acme Corp' },
      { id: 'hiring_manager',label: 'Hiring manager\'s name',    type: 'text',     placeholder: 'Sarah Johnson (or "Hiring Manager" if unknown)' },
      { id: 'role',          label: 'Role you\'re applying for', type: 'text',     placeholder: 'Senior Product Manager' },
      { id: 'why_role',      label: 'Why this role & company?',  type: 'textarea', placeholder: 'What genuinely excites you about this specific company and role...' },
      { id: 'top_strength',  label: 'Your top 1-2 relevant strengths', type: 'textarea', placeholder: 'The 1-2 things that make you the strongest fit for this role...' },
      { id: 'proof_story',   label: 'A specific achievement that proves your fit', type: 'textarea', placeholder: 'One concrete example with result (the more specific, the better)...' },
      { id: 'job_desc',      label: 'Job description (paste it)', type: 'textarea', placeholder: 'Paste the full JD — the letter will address it directly...' },
      { id: 'tone',          label: 'Tone',                      type: 'select',   options: ['Professional & confident', 'Warm & conversational', 'Direct & bold', 'Enthusiastic & energetic'] },
    ],
    systemPrompt: (f) => `You are a career coach who writes exceptional cover letters. Write a compelling, specific cover letter — not a generic one.

Output a complete cover letter ready to send, with:
- Today's date
- Recipient: ${f.hiring_manager}, ${f.company}
- Opening: A strong hook that isn't "I am applying for..."
- Body: 2-3 tight paragraphs showing fit with specific proof
- Closing: Clear, confident call to action
- Sign-off: Sincerely, ${f.your_name}

Details:
- Applicant: ${f.your_name}
- Role: ${f.role} at ${f.company}
- Why this role/company: ${f.why_role}
- Key strengths: ${f.top_strength}
- Proof story: ${f.proof_story}
- Job description: ${f.job_desc}
- Tone: ${f.tone}

Rules:
- Never start with "I am writing to apply..."
- Reference the company by name at least twice — make it feel researched
- The proof story must include a specific, quantified result
- Keep it to one page (350-450 words)
- Match the tone: ${f.tone}
- End with a clear, direct ask for an interview`
  },

  // ── 3. LINKEDIN SUMMARY ───────────────────────────────────
  {
    id: 'linkedin',
    label: 'LinkedIn Summary',
    shortLabel: 'LinkedIn',
    icon: '💼',
    color: '#0A4D68',
    colorLight: '#E8F4F8',
    tagline: 'Your 2,600-character pitch to the world.',
    description: 'Write an About section that attracts recruiters, speaks to your audience, and makes people want to connect.',
    fields: [
      { id: 'name',          label: 'Your name',                 type: 'text',     placeholder: 'Jane Smith' },
      { id: 'current_role',  label: 'Current or target job title', type: 'text',   placeholder: 'Product Manager | SaaS | B2B' },
      { id: 'years_exp',     label: 'Years of experience',       type: 'text',     placeholder: '8 years' },
      { id: 'what_you_do',   label: 'What you actually do',      type: 'textarea', placeholder: 'The core of your work — what problems you solve, for whom, how...' },
      { id: 'top_wins',      label: 'Top 2-3 career wins',       type: 'textarea', placeholder: 'Specific achievements with numbers (grew revenue 40%, led team of 12...)' },
      { id: 'skills',        label: 'Core skills & expertise',   type: 'text',     placeholder: 'Product strategy, roadmapping, data analysis, stakeholder management...' },
      { id: 'personality',   label: 'A bit about you (optional)', type: 'textarea', placeholder: 'What makes you you? Anything personal that humanises your profile...' },
      { id: 'cta',           label: 'What you want people to do', type: 'text',    placeholder: 'Connect with me | Open to PM roles | Reach me at jane@email.com' },
      { id: 'style',         label: 'Writing style',             type: 'select',   options: ['First-person, conversational', 'Third-person, professional', 'Story-driven, personal', 'Data-first, results-led'] },
    ],
    systemPrompt: (f) => `You are a LinkedIn personal branding expert. Write a compelling LinkedIn About section.

Requirements:
- Under 2,600 characters (LinkedIn's limit)
- ${f.style} style
- Opens with a hook — not "I am a [job title]"
- Naturally incorporates keywords recruiters search for
- Includes specific achievements with numbers
- Ends with a clear call to action

Details:
- Name: ${f.name}
- Role/headline: ${f.current_role}
- Experience: ${f.years_exp}
- What they do: ${f.what_you_do}
- Top wins: ${f.top_wins}
- Skills: ${f.skills}
- Personal touch: ${f.personality || 'N/A'}
- CTA: ${f.cta}

After the About section, add a "--- HEADLINE SUGGESTIONS ---" section with 5 alternative LinkedIn headline options (120 chars max each) they can use.`
  },

  // ── 4. INTERVIEW PREP ─────────────────────────────────────
  {
    id: 'interview',
    label: 'Interview Prep',
    shortLabel: 'Interview',
    icon: '🎯',
    color: '#7C2D12',
    colorLight: '#FEF3EE',
    tagline: 'Walk in confident. Walk out with the offer.',
    description: 'Get likely interview questions for your specific role, with model answers using the STAR method — tailored to you.',
    fields: [
      { id: 'role',          label: 'Role you\'re interviewing for', type: 'text', placeholder: 'Senior Product Manager' },
      { id: 'company',       label: 'Company',                    type: 'text',     placeholder: 'Acme Corp (or the industry)' },
      { id: 'your_bg',       label: 'Your background (brief)',    type: 'textarea', placeholder: 'Your relevant experience, key wins, things you want to highlight...' },
      { id: 'job_desc',      label: 'Job description',            type: 'textarea', placeholder: 'Paste the JD — questions will be tailored to it...' },
      { id: 'interview_type',label: 'Interview type',             type: 'select',   options: ['First round / HR screen', 'Technical / skills interview', 'Behavioural / competency', 'Panel interview', 'Final round / executive'] },
      { id: 'weak_areas',    label: 'Your weak spots (honest)',   type: 'textarea', placeholder: 'Gaps, career breaks, skills you\'re still developing — so we prep for tough questions...' },
      { id: 'questions',     label: 'Specific questions to prep', type: 'textarea', placeholder: 'Any questions you\'re especially nervous about? (optional)' },
    ],
    systemPrompt: (f) => `You are an expert interview coach. Generate a complete interview preparation guide.

Output format:
# Interview Prep: ${f.role} at ${f.company}

## About this interview
[2 sentences on what to expect from a ${f.interview_type} at this type of company]

## Top 10 likely questions + model answers

For each question:
**Q: [Question]**
*Why they ask this:* [one sentence]
*Model answer:* [STAR format — Situation, Task, Action, Result — tailored to their background]

## 3 tough questions to prepare for
[Include questions about their weak areas: ${f.weak_areas}]

## Questions YOU should ask them
[5 smart, specific questions that show preparation and strategic thinking]

## Key themes to weave throughout
[3-4 messages they should reinforce across all answers]

Details:
- Role: ${f.role}
- Company/industry: ${f.company}
- Candidate background: ${f.your_bg}
- Job description: ${f.job_desc}
- Interview type: ${f.interview_type}
- Weak areas to address: ${f.weak_areas || 'None specified'}
- Specific questions to prep: ${f.questions || 'None specified'}

Make answers specific to their background — not generic advice.`
  },
]

// ── 5. LINKEDIN DM TEMPLATES (Premium) ────────────────────
const LINKEDIN_DM_TOOL = {
  id: 'linkedin_dm',
  label: 'LinkedIn DM Templates',
  shortLabel: 'LinkedIn DMs',
  icon: '💬',
  color: '#1e3a5f',
  colorLight: '#e8f0fe',
  tagline: 'Get replies. Not silence.',
  description: 'Personalised LinkedIn outreach messages that actually get opened and replied to — for networking, job enquiries, referral requests, and recruiter responses.',
  premium: true,
  fields: [
    { id: 'dm_purpose',      label: 'What\'s the goal of this message?',     type: 'select',   options: ['Job inquiry at a company', 'Networking / coffee chat', 'Responding to a recruiter', 'Asking for a referral', 'Reconnecting with an old contact'] },
    { id: 'your_name',       label: 'Your name',                             type: 'text',     placeholder: 'Jane Smith' },
    { id: 'your_background', label: 'Your background (1-2 lines)',           type: 'text',     placeholder: 'Senior PM with 6 years in SaaS, currently at Stripe' },
    { id: 'recipient_name',  label: 'Recipient\'s name',                     type: 'text',     placeholder: 'Sarah Chen' },
    { id: 'recipient_role',  label: 'Their role / company',                  type: 'text',     placeholder: 'Engineering Manager at Google' },
    { id: 'connection_angle',label: 'Why them? Your connection or hook',     type: 'textarea', placeholder: 'Saw their post on AI in product, we went to the same uni, I admire their work on X, mutual connection is Y...' },
    { id: 'what_you_want',   label: 'What you\'re hoping for',               type: 'textarea', placeholder: 'A 15-min coffee chat, their honest take on the team culture, to be kept in mind for openings...' },
    { id: 'tone',            label: 'Tone',                                  type: 'select',   options: ['Warm & professional', 'Direct & confident', 'Enthusiastic & friendly', 'Humble & appreciative'] },
  ],
  systemPrompt: (f) => `You are an expert at professional networking and LinkedIn outreach. Write a highly personalised LinkedIn DM that will actually get a reply.

Goal: ${f.dm_purpose}
Sender: ${f.your_name} — ${f.your_background}
Recipient: ${f.recipient_name}, ${f.recipient_role}
Connection angle: ${f.connection_angle}
Desired outcome: ${f.what_you_want}
Tone: ${f.tone}

Output format:

## Primary Message (ideal length: 100-150 words)
[The main DM — personal, specific, low-pressure, clear ask]

## Short Version (under 75 words)
[A punchy version if they want something more concise]

## Follow-Up Message (if no reply after 1 week)
[A light, non-pushy follow-up — adds value or a new angle]

Rules:
- Open with something specific to THEM (their post, their work, their company) — not about you
- Mention the connection angle naturally
- Make the ask small, specific, and easy to say yes to
- Never paste a resume or list your achievements in the DM
- No "I hope this message finds you well" openers
- Under 150 words for the main message — people don't read long DMs
- Match the tone: ${f.tone}`,
}

// ── 6. SALARY NEGOTIATION GUIDE (Premium) ─────────────────
const SALARY_NEGOTIATION_TOOL = {
  id: 'salary_negotiation',
  label: 'Salary Negotiation Guide',
  shortLabel: 'Salary Guide',
  icon: '💰',
  color: '#3d1f00',
  colorLight: '#fef3e8',
  tagline: 'Know your worth. Ask for it.',
  description: 'A personalised salary negotiation script, talking points, and objection responses — so you walk into the conversation confident and walk out with more.',
  premium: true,
  fields: [
    { id: 'situation',      label: 'Your situation',                         type: 'select',   options: ['New job offer', 'Annual performance review', 'After a promotion', 'Counter-offer from another company', 'Mid-year raise request'] },
    { id: 'role',           label: 'Role & company',                         type: 'text',     placeholder: 'Senior Product Manager at Acme Corp' },
    { id: 'current_offer',  label: 'Current offer or salary',                type: 'text',     placeholder: '$105,000 base + 15% bonus + 20 days leave' },
    { id: 'target',         label: 'What you want to achieve',               type: 'text',     placeholder: '$125,000 base, or at least $115K + extra leave' },
    { id: 'your_strengths', label: 'Your strongest reasons to deserve more', type: 'textarea', placeholder: 'Led the platform rebuild that cut churn 18%, 7 years experience in this exact stack, competing offer from X...' },
    { id: 'market_data',    label: 'Market data / benchmarks (optional)',    type: 'textarea', placeholder: 'Glassdoor shows $115-130K for this role in Sydney, a recruiter quoted me $120K last month...' },
    { id: 'risk_level',     label: 'Your approach',                          type: 'select',   options: ['Conservative — small, safe ask', 'Moderate — reasonable stretch', 'Aggressive — push hard for top of range'] },
  ],
  systemPrompt: (f) => `You are an expert salary negotiation coach who has helped hundreds of professionals earn more. Generate a complete, personalised negotiation guide.

Situation: ${f.situation}
Role: ${f.role}
Current offer/salary: ${f.current_offer}
Target: ${f.target}
Key leverage points: ${f.your_strengths}
Market data: ${f.market_data || 'None provided'}
Approach: ${f.risk_level}

Output format:

# Salary Negotiation Guide: ${f.role}

## Your negotiating position
[Honest assessment of leverage — strong, moderate, or limited — and why]

## The ask: exact numbers
[What to ask for, stated precisely — primary ask and fallback positions]

## Opening script (word-for-word)
[Exactly what to say to open the negotiation — email version and phone/in-person version]

## Key talking points
[5-7 bullet points justifying the ask — specific to their situation and strengths]

## Objection responses
**"The budget is fixed / that's our standard offer"**
*Say:* [Response]

**"We can revisit in 6 months"**
*Say:* [Response]

**"That's above our range for this role"**
*Say:* [Response]

[Add 1-2 more objections relevant to their situation]

## Beyond base salary — what else to negotiate
[Non-salary items worth pushing for: bonus, equity, leave, remote days, title, review timeline]

## What NOT to say
[3-4 common mistakes to avoid in this specific situation]

## After the negotiation
[What to do if they say yes / no / need time to think]

Be direct and practical. Give word-for-word scripts they can use immediately.`,
}

// ── 7. INTERVIEW FOLLOW-UP EMAILS (Premium) ───────────────
const INTERVIEW_FOLLOWUP_TOOL = {
  id: 'interview_followup',
  label: 'Interview Follow-Up Emails',
  shortLabel: 'Follow-Up Email',
  icon: '📧',
  color: '#0f2a1a',
  colorLight: '#e8f5ee',
  tagline: 'The email that seals the deal.',
  description: 'Write a thank-you / follow-up email after your interview that reinforces why you\'re the right hire, addresses any concerns raised, and keeps you top of mind.',
  premium: true,
  fields: [
    { id: 'your_name',        label: 'Your name',                                       type: 'text',     placeholder: 'Jane Smith' },
    { id: 'interviewer_name', label: 'Interviewer\'s name(s)',                          type: 'text',     placeholder: 'Sarah Johnson (or: Sarah, Tom, and the panel)' },
    { id: 'role',             label: 'Role you interviewed for',                        type: 'text',     placeholder: 'Senior Product Manager' },
    { id: 'company',          label: 'Company',                                         type: 'text',     placeholder: 'Acme Corp' },
    { id: 'interview_type',   label: 'Interview stage',                                 type: 'select',   options: ['First round / HR screen', 'Technical / skills interview', 'Hiring manager interview', 'Panel / final round', 'CEO / executive interview'] },
    { id: 'key_moment',       label: 'A specific thing discussed to reference',         type: 'textarea', placeholder: 'We talked about their Q3 platform launch, they mentioned wanting someone to own the API roadmap, I shared my experience rebuilding the auth layer at Stripe...' },
    { id: 'concern_raised',   label: 'Any concern raised you want to address (optional)', type: 'textarea', placeholder: 'They seemed unsure about my lack of fintech experience, or they asked about a gap in my CV...' },
    { id: 'tone',             label: 'Tone',                                            type: 'select',   options: ['Warm & genuine', 'Professional & concise', 'Enthusiastic & energetic', 'Thoughtful & reflective'] },
  ],
  systemPrompt: (f) => `You are an expert career coach. Write a highly personalised, effective post-interview follow-up email.

Candidate: ${f.your_name}
Interviewer(s): ${f.interviewer_name}
Role: ${f.role} at ${f.company}
Interview stage: ${f.interview_type}
Key moment to reference: ${f.key_moment}
Concern to address: ${f.concern_raised || 'None'}
Tone: ${f.tone}

Output format:

## Primary Follow-Up Email
Subject: [Compelling subject line — not just "Thank you for your time"]

[Full email body]

---

## Shorter Version (if they prefer brief)
Subject: [Subject]

[Concise 3-paragraph version]

---

## If No Response After 5 Business Days — Follow-Up Nudge
Subject: [Subject]

[Brief, non-pushy nudge that adds value or a new angle]

Rules for the main email:
- Reference the specific moment/topic discussed: "${f.key_moment}" — makes it clear you were engaged, not sending a template
- Express genuine enthusiasm for the role and company — specific, not generic
${f.concern_raised ? `- Briefly and confidently address the concern about: "${f.concern_raised}" — don't be defensive, just reassure with a concrete point` : ''}
- Reinforce your fit with one concrete point
- End with a clear, easy next step (available for any follow-up, look forward to hearing from them)
- Keep it under 200 words for the main email — hiring managers are busy
- Tone: ${f.tone}
- Do NOT open with "I wanted to reach out to thank you" or "I hope this email finds you well"`,
}

TOOLS.push(LINKEDIN_DM_TOOL, SALARY_NEGOTIATION_TOOL, INTERVIEW_FOLLOWUP_TOOL)

export const PREMIUM_TOOLS = [LINKEDIN_DM_TOOL, SALARY_NEGOTIATION_TOOL, INTERVIEW_FOLLOWUP_TOOL]
export const TOOL_MAP = Object.fromEntries(TOOLS.map(t => [t.id, t]))
