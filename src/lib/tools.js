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

export const TOOL_MAP = Object.fromEntries(TOOLS.map(t => [t.id, t]))
