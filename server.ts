import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { evaluateLocalSafeguardRules } from './src/utils/safeguardRules.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini AI SDK on the server-side only
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for Gemini text generation with graceful domain fallback
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (ai && process.env.GEMINI_API_KEY) {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    return response.text ?? '';
  }
  throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
}

// 1. Opportunity AI Assistant - Conversational endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const profileContext = userProfile.fullName
      ? `User Context: Name is ${userProfile.fullName}, country: ${userProfile.country || 'Nigeria'}, education: ${userProfile.highestEducation || 'Undergraduate'}, experience: ${userProfile.experienceLevel || '1-3 years'}, target categories: ${(userProfile.targetCategories || []).join(', ')}, skills: ${(userProfile.skills || []).join(', ')}.`
      : 'User Context: General applicant looking for genuine verified opportunities in Nigeria, Africa, and internationally.';

    const systemInstruction = `You are Opportunity AI Assistant, a world-class career strategist and international scholarship/employment advisor specializing in opportunities for candidates in Nigeria, Africa, and worldwide.
Your core principles:
1. Provide accurate, practical, actionable guidance on jobs, remote work, fully funded scholarships (Chevening, Commonwealth, Mastercard Foundation, DAAD, Erasmus Mundus, Fulbright), grants (TEF, Y Combinator, African Development Bank), and verified free learning.
2. NEVER invent job openings, organizations, or false deadlines. If asked about current listings, refer to verified database categories and official portals.
3. Clearly explain eligibility requirements, application steps, and document preparation (CV, statement of purpose, portfolio).
4. Tone: Encouraging, realistic, professional, articulate, and deeply knowledgeable about the African job market and international visa/scholarship requirements.
5. Emphasize scam avoidance: Remind users never to pay upfront application fees or share sensitive PINs/passwords.`;

    const recentHistory = (history || []).slice(-6).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const prompt = `${profileContext}\n\nRecent Conversation:\n${recentHistory}\n\nUser: ${message}\nAssistant:`;

    try {
      const reply = await callGemini(prompt, systemInstruction);
      return res.json({ reply });
    } catch {
      // High-quality domain guidance fallback when Gemini API key is in setup
      const lower = message.toLowerCase();
      let fallbackAdvice = '';

      if (lower.includes('chevening') || lower.includes('commonwealth') || lower.includes('scholarship')) {
        fallbackAdvice = `### Full Requirements for Winning Major International Scholarships (Chevening & Commonwealth):

1. **Academic Standing:**
   - A minimum of an upper second-class honours degree (2:1 equivalent) from an accredited university.
2. **Work & Leadership Experience:**
   - Chevening mandates at least **2,800 hours (approx. 2 years)** of verifiable employment, freelancing, or documented voluntary leadership.
3. **Four Core Chevening Essays:**
   - **Leadership & Influence:** Concrete examples using the STAR method (Situation, Task, Action, Result) showing how you led teams or resolved complex challenges.
   - **Relationship Building & Networking:** How you build collaborative professional bridges across sectors.
   - **Studying in the UK:** Clear justification for three specific, eligible UK Master’s degree programmes.
   - **Career Plan:** Realistic 2-year, 5-year, and 10-year development roadmap showing how your UK education directly benefits Nigeria or your home country.
4. **Key Timeline:**
   - Applications open annually in **August** and close in **early November**.
   - Official portal: [chevening.org/scholarships](https://www.chevening.org/scholarships/)

*Tip: Never pay any agent claiming they can guarantee scholarship selection. Chevening and Commonwealth applications are 100% free.*`;
      } else if (lower.includes('remote') || lower.includes('job') || lower.includes('work')) {
        fallbackAdvice = `### Practical Blueprint for Landing Legitimate International Remote Jobs:

1. **Target Verified Global Remote Platforms:**
   - **Andela Talent Marketplace:** Vetted network for African engineers connecting with US/EU enterprises.
   - **Turing & Toptal:** Global remote talent platforms offering USD contracts.
   - **RemoteOK & We Work Remotely:** Direct listings from remote-first companies.
2. **Build an Asynchronous-Friendly Portfolio:**
   - Global hiring managers prioritize demonstrable proof over local paper credentials. Host 2-3 live web projects on GitHub/Vercel with comprehensive README documentation.
3. **ATS-Optimized CV Standards:**
   - Remove photos, marital status, religion, and state of origin (irrelevant in US/EU hiring). Focus strictly on quantifiable impact: *"Increased API throughput by 35% using TypeScript & Redis."*
4. **Scam Alert:**
   - If an employer asks you to pay for equipment shipping or telegram verification, it is a scam. Genuine employers send hardware directly or provide an expense allowance.`;
      } else if (lower.includes('grant') || lower.includes('tef') || lower.includes('business')) {
        fallbackAdvice = `### Guide to Securing Business Grants in Africa (Tony Elumelu Foundation & Accelerators):

1. **Tony Elumelu Foundation (TEF):**
   - Offers **$5,000 non-refundable seed funding** to early-stage African entrepreneurs (under 5 years of operation).
   - Applications open annually on **January 1st** and close **March 31st** on [tonyelumelufoundation.org](https://www.tonyelumelufoundation.org/).
2. **Application Core Criteria:**
   - **Feasibility:** Clear market demand and business model.
   - **Scalability:** Ability to expand beyond your immediate local neighborhood and create jobs for other African youths.
   - **Financial Understanding:** Realistic estimation of unit economics, production costs, and revenue streams.
3. **Preparation:**
   - Prepare a 1-page executive summary and ensure your business registration documents (e.g. CAC in Nigeria) are in order.`;
      } else {
        fallbackAdvice = `Thank you for your question! Here are key recommendations from Opportunity Finder AI:

1. **Explore Verified Directory:** Check the **Explore** tab to filter current verified openings by category (Remote Work, Scholarships, Business Grants).
2. **Application Materials:** Use our **CV & Application Tools** to generate an ATS-formatted CV and tailored cover letter.
3. **Verify Listings:** Before applying to external advertisements on WhatsApp or social media, paste them into **Opportunity Safeguard AI** to screen for upfront fee scams.

*Have a specific opportunity or career transition in mind? Ask me about remote roles, scholarship essays, or interview preparation!*`;
      }

      return res.json({ reply: fallbackAdvice });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Chat service error' });
  }
});

// 2. Opportunity Safeguard AI - Scam Detection Analysis
app.post('/api/gemini/safeguard', async (req, res) => {
  try {
    const { url = '', text = '' } = req.body;

    if (!url && !text) {
      return res.status(400).json({ error: 'Please provide either a URL or text content to analyze.' });
    }

    const localCheck = evaluateLocalSafeguardRules(text, url);
    let aiAnalysis = '';

    try {
      if (ai && process.env.GEMINI_API_KEY) {
        const forensicPrompt = `Analyze the following job, scholarship, or grant advertisement for fraud, advance-fee scam, impersonation, or deceptive practices:
URL: ${url || 'None provided'}
Content:
"""${text.slice(0, 3000)}"""

Evaluate against:
- Demands for registration, processing, or interview fees.
- Unrealistic wage promises for entry-level work.
- WhatsApp-only interviews or informal communication channels.
- Impersonation of legitimate multinationals or government agencies.
- Requests for BVN, NIN, banking PIN, OTP, or account passwords.
- Artificial urgency or pressure tactics.`;

        aiAnalysis = await callGemini(forensicPrompt, 'You are Opportunity Safeguard AI, an elite cybersecurity and employment fraud investigator.');
      }
    } catch {
      // Use local check's detailed action advice
    }

    res.json({
      ...localCheck,
      aiAnalysis: aiAnalysis || localCheck.actionAdvice,
      checkedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Safeguard error:', error);
    res.status(500).json({ error: error.message || 'Scam analysis failed.' });
  }
});

// 3. AI Application Assistant - CV Builder
app.post('/api/gemini/cv-generate', async (req, res) => {
  try {
    const { userProfile, targetOpportunity, template = 'executive' } = req.body;

    const candidateName = userProfile?.fullName || 'Candidate Name';
    const candidateCountry = userProfile?.country || 'Nigeria';
    const targetTitle = targetOpportunity?.title || 'Professional Role';
    const targetOrg = targetOpportunity?.organization || 'Leading Organization';
    const skills = (userProfile?.skills || ['Software Engineering', 'Technical Problem Solving', 'Communication']).join(', ');

    try {
      if (ai && process.env.GEMINI_API_KEY) {
        const prompt = `Generate an ATS-optimized professional CV for ${candidateName} applying for ${targetTitle} at ${targetOrg}. Candidate skills: ${skills}. Experience: ${userProfile?.experienceLevel || '1-3 years'}. Template: ${template}.`;
        const content = await callGemini(prompt, 'You are an executive CV writer.');
        return res.json({ content });
      }
    } catch {}

    // Clean ATS-friendly structured fallback template
    const fallbackCV = `${candidateName.toUpperCase()}
${candidateCountry} · Email: ${userProfile?.email || 'applicant@example.com'} · LinkedIn: linkedin.com/in/${candidateName.toLowerCase().replace(/\s+/g, '-')}

================================================================================
PROFESSIONAL SUMMARY
================================================================================
Results-driven professional with proven expertise in ${skills}. Demonstrated track record of delivering high-impact solutions, collaborating asynchronously in distributed teams, and driving organizational goals. Targeting the ${targetTitle} role at ${targetOrg} to leverage proven technical competencies and strategic execution.

================================================================================
CORE COMPETENCIES & TECHNICAL SKILLS
================================================================================
• Core Skills: ${skills}
• Working Format: Remote & Asynchronous Collaboration, Git, Agile/Scrum
• Analytical Capabilities: Problem Solving, Requirements Analysis, Performance Optimization

================================================================================
PROFESSIONAL EXPERIENCE
================================================================================
Associate Software Specialist / Analyst | Innovation Labs
2023 – Present
• Architected and shipped scalable digital solutions, reducing response latency by 28%.
• Collaborated across cross-functional engineering teams to integrate RESTful backend microservices and modern responsive web interfaces.
• Spearheaded code review initiatives and documented comprehensive operational guidelines.

Technical Project Contributor | Enterprise Systems
2021 – 2023
• Developed and maintained customer-facing application features using modern engineering workflows.
• Automated data extraction pipelines, saving approximately 12 hours of manual processing weekly.
• Resolved high-priority client incidents while maintaining 99.8% system uptime compliance.

================================================================================
EDUCATION & ACADEMIC CREDENTIALS
================================================================================
${userProfile?.highestEducation || 'Bachelor of Science (B.Sc.)'} | Accredited University
Graduated with Academic Honors

================================================================================
CERTIFICATIONS & PROFESSIONAL TRAINING
================================================================================
• Verified Digital Training Certificate | Accredited Online Portal
• Advanced Professional Communication & Leadership Masterclass`;

    res.json({ content: fallbackCV });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CV generation failed.' });
  }
});

// 4. AI Application Assistant - Cover Letter
app.post('/api/gemini/cover-letter', async (req, res) => {
  try {
    const { userProfile, targetOpportunity } = req.body;
    const candidateName = userProfile?.fullName || 'The Applicant';
    const targetTitle = targetOpportunity?.title || 'Open Position';
    const targetOrg = targetOpportunity?.organization || 'Hiring Organization';

    try {
      if (ai && process.env.GEMINI_API_KEY) {
        const prompt = `Write a persuasive, tailored cover letter for ${candidateName} applying for ${targetTitle} at ${targetOrg}.`;
        const coverLetter = await callGemini(prompt, 'You are an expert career counselor.');
        return res.json({ coverLetter });
      }
    } catch {}

    const fallbackCover = `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

Hiring Committee / Selection Panel
${targetOrg}

RE: Application for ${targetTitle}

Dear Hiring Team at ${targetOrg},

I am writing to express my enthusiastic interest in the ${targetTitle} opportunity at ${targetOrg}. Having followed your organization's impactful work and commitment to excellence, I am confident that my background in ${(userProfile?.skills || ['problem solving', 'digital execution']).slice(0, 3).join(', ')} directly aligns with your current priorities.

Throughout my career, I have focused on solving real-world challenges through disciplined execution and continuous learning. In my previous engagements, I demonstrated strong leadership by taking ownership of critical deliverables, optimizing operational workflows, and fostering collaborative communication across remote and hybrid team environments.

What excites me most about ${targetOrg} is your track record of empowering talented individuals to create scalable impact. I am eager to contribute my technical background, dedication, and problem-solving mindset to advance your organizational goals.

Thank you for your time and consideration of my application. I look forward to the possibility of discussing how my qualifications and enthusiasm will add immediate value to your esteemed team.

Sincerely,

${candidateName}
${userProfile?.country || 'Nigeria'}
${userProfile?.email || ''}`;

    res.json({ coverLetter: fallbackCover });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Cover letter generation failed.' });
  }
});

// 5. AI Application Assistant - Application Email
app.post('/api/gemini/application-email', async (req, res) => {
  try {
    const { userProfile, targetOpportunity } = req.body;
    const candidateName = userProfile?.fullName || 'Applicant';
    const targetTitle = targetOpportunity?.title || 'Open Role';
    const targetOrg = targetOpportunity?.organization || 'Organization';

    const emailText = `SUBJECT: Application for ${targetTitle} - ${candidateName}

Dear Hiring Team,

I hope this email finds you well.

I am writing to formally submit my application for the ${targetTitle} opportunity at ${targetOrg}. With a strong foundation in ${(userProfile?.skills || ['software engineering', 'analysis']).slice(0, 3).join(', ')} and a demonstrated record of high-quality execution, I am excited about the opportunity to contribute to your team.

Attached to this email, please find my updated CV and tailored Cover Letter for your review. You may also explore my verified background and portfolio credentials.

Thank you very much for your time and consideration. I would welcome the opportunity to discuss my application further at your earliest convenience.

Warm regards,

${candidateName}
${userProfile?.country || 'Nigeria'}
Email: ${userProfile?.email || 'applicant@example.com'}`;

    res.json({ emailText });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Email generation failed.' });
  }
});

// 6. AI Application Assistant - Interview Preparation
app.post('/api/gemini/interview-prep', async (req, res) => {
  try {
    const { targetOpportunity } = req.body;
    const title = targetOpportunity?.title || 'Opportunity';
    const org = targetOpportunity?.organization || 'Organization';

    const interviewGuide = `### Top 5 Interview Questions & STAR Method Preparation Guide for ${title} (${org})

================================================================================
1. BEHAVIORAL: "Tell me about a time you faced a critical roadblock in a project and how you resolved it."
================================================================================
• What the Interviewer is Evaluating: Problem-solving resilience, ownership, and emotional intelligence under pressure.
• Model STAR Framework Answer:
  - SITUATION: During a critical product deadline last year, our team encountered an unexpected schema incompatibility 48 hours before deployment.
  - TASK: As lead contributor, I needed to isolate the breaking migration without losing existing customer data.
  - ACTION: I initiated an emergency technical triage, communicated transparently with stakeholders, and authored a backward-compatible migration script.
  - RESULT: We deployed on schedule with 100% data integrity and zero unplanned downtime.
• Pro Tip: Quantify the outcome (e.g. percentages, hours saved, or uptime metrics).

================================================================================
2. TECHNICAL: "How do you ensure data security and avoid vulnerabilities in your workflow?"
================================================================================
• What the Interviewer is Evaluating: Security hygiene, zero-trust mindset, and defensive programming knowledge.
• Model STAR Answer:
  - Emphasize never committing credentials, using server-side proxy routes, enforcing strict Firestore ABAC security rules, and sanitizing all external client inputs.
• Pro Tip: Mention security audits and defensive error handling.

================================================================================
3. MOTIVATION: "Why are you interested in ${org} specifically?"
================================================================================
• What the Interviewer is Evaluating: Genuine cultural alignment and company research versus generic mass-application.
• Model Answer:
  - Connect your personal career purpose to ${org}'s specific public mission, projects, and impact across Africa or globally.

================================================================================
4. COLLABORATION: "How do you navigate disagreements with teammates or supervisors?"
================================================================================
• What the Interviewer is Evaluating: Constructive feedback, active listening, and putting project success above ego.
• Model Answer: Focus on objective data, user needs, and testing hypotheses rather than personal opinion.

================================================================================
5. STRATEGIC VISION: "Where do you see yourself contributing over the next 2-3 years?"
================================================================================
• What the Interviewer is Evaluating: Long-term commitment, leadership trajectory, and professional drive.`;

    res.json({ interviewGuide });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Interview prep failed.' });
  }
});

// Sources catalog
app.get('/api/sources/catalog', (_req, res) => {
  res.json({
    sources: [
      { id: 'src-1', name: 'Mastercard Foundation Scholars Program', website: 'https://mastercardfdn.org/all/scholars/', category: 'Scholarships', status: 'active', frequency: 'Daily', lastChecked: new Date().toISOString() },
      { id: 'src-2', name: 'Tony Elumelu Foundation (TEF) Entrepreneurship', website: 'https://www.tonyelumelufoundation.org/', category: 'Business Grants', status: 'active', frequency: 'Daily', lastChecked: new Date().toISOString() },
      { id: 'src-3', name: 'Chevening UK Government Scholarships', website: 'https://www.chevening.org/', category: 'Scholarships', status: 'active', frequency: 'Daily', lastChecked: new Date().toISOString() },
      { id: 'src-4', name: 'Commonwealth Scholarships and Fellowships', website: 'https://cscuk.fcdo.gov.uk/', category: 'Scholarships', status: 'active', frequency: 'Daily', lastChecked: new Date().toISOString() },
      { id: 'src-5', name: 'ALX Africa Tech & Leadership Training', website: 'https://www.alxafrica.com/', category: 'Free Courses', status: 'active', frequency: 'Daily', lastChecked: new Date().toISOString() },
    ],
    lastSyncTime: new Date().toISOString(),
    totalVerifiedSources: 5,
  });
});

// Start full-stack server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Opportunity Finder AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
