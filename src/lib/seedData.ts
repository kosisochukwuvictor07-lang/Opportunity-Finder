export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  category: string;
  location: string;
  workType: 'Remote' | 'On-site' | 'Hybrid';
  description: string;
  eligibility: string;
  requiredQualifications: string[];
  requiredSkills: string[];
  benefits: string;
  deadline: string;
  officialUrl: string;
  sourceName: string;
  verificationStatus: 'verified' | 'unverified' | 'suspicious' | 'expired';
  isExpired: boolean;
  lastChecked: string;
  publishedAt: string;
  featured?: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  duration: string;
  cost: string;
  certificate: string;
  officialUrl: string;
  lastChecked: string;
}

export interface SourceItem {
  id: string;
  name: string;
  website: string;
  category: string;
  status: 'active' | 'inactive';
  lastChecked: string;
  frequency: string;
}

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-tef-2026',
    title: 'Tony Elumelu Foundation (TEF) Entrepreneurship Programme',
    organization: 'Tony Elumelu Foundation',
    category: 'Business Grants',
    location: 'Pan-African (All 54 African Countries)',
    workType: 'Remote',
    description: 'The flagship entrepreneurship empowerment programme across Africa providing $5,000 non-refundable seed funding, world-class business management training, bespoke mentorship, and access to Africa’s largest entrepreneurial ecosystem.',
    eligibility: 'Citizens and legal residents of any African country with a scalable business idea or existing startup operating for less than 5 years.',
    requiredQualifications: ['Must be at least 18 years old', 'Open to any sector or industry', 'Scalable commercial business idea'],
    requiredSkills: ['Business planning', 'Financial literacy basics', 'Entrepreneurial drive', 'Leadership'],
    benefits: '$5,000 equity-free seed capital, 12 weeks of digital business training, 1-on-1 mentorship, access to TEFConnect global alumni network.',
    deadline: '2026-03-31T23:59:59Z',
    officialUrl: 'https://www.tonyelumelufoundation.org/',
    sourceName: 'Tony Elumelu Foundation Official Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T12:00:00Z',
    publishedAt: '2026-01-01T00:00:00Z',
    featured: true,
  },
  {
    id: 'opp-chevening-2026',
    title: 'Chevening UK Government Fully Funded Master’s Scholarships',
    organization: 'UK Foreign, Commonwealth and Development Office (FCDO)',
    category: 'Scholarships',
    location: 'United Kingdom',
    workType: 'On-site',
    description: 'The UK government’s global scholarship programme offering future leaders the opportunity to pursue a one-year fully funded Master’s degree at any accredited UK university.',
    eligibility: 'Citizens of Chevening-eligible countries (including Nigeria, Kenya, Ghana, South Africa). Must hold an undergraduate degree that qualifies for a UK postgraduate programme and have at least 2 years (2,800 hours) of work experience.',
    requiredQualifications: ['Undergraduate Bachelor’s degree (equivalent to UK upper second-class 2:1)', 'Minimum 2 years of work or leadership experience'],
    requiredSkills: ['Leadership potential', 'Networking ability', 'Strategic clear vision for home country development', 'Academic writing'],
    benefits: 'Full tuition fees, monthly living allowance stipend, economy return airfare to the UK, arrival allowance, visa application costs.',
    deadline: '2026-11-05T12:00:00Z',
    officialUrl: 'https://www.chevening.org/scholarships/',
    sourceName: 'UK Government Foreign & Commonwealth Office',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T10:00:00Z',
    publishedAt: '2026-08-01T00:00:00Z',
    featured: true,
  },
  {
    id: 'opp-mastercard-scholars',
    title: 'Mastercard Foundation Scholars Program at ALU & Partner Universities',
    organization: 'Mastercard Foundation',
    category: 'Fully Funded Programmes',
    location: 'Rwanda, Mauritius, South Africa, Global',
    workType: 'On-site',
    description: 'Comprehensive scholarship initiative developing the next generation of transformative African leaders by funding undergraduate and graduate degrees at premier global and pan-African universities.',
    eligibility: 'Academically talented young Africans from economically disadvantaged backgrounds with demonstrated commitment to giving back to their communities.',
    requiredQualifications: ['Completed secondary school or bachelor degree with distinction', 'Under 29 years old for undergraduate or under 35 for graduate'],
    requiredSkills: ['Community leadership', 'Academic excellence', 'Resilience', 'Ethical problem solving'],
    benefits: 'Full tuition, accommodation, stipend, learning materials, comprehensive health insurance, leadership development, travel coverage.',
    deadline: '2026-04-15T23:59:59Z',
    officialUrl: 'https://mastercardfdn.org/all/scholars/',
    sourceName: 'Mastercard Foundation Global Education',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T09:30:00Z',
    publishedAt: '2026-01-15T00:00:00Z',
    featured: true,
  },
  {
    id: 'opp-alx-software-eng',
    title: 'ALX Software Engineering & Tech Leadership Career Accelerator',
    organization: 'ALX Africa',
    category: 'Professional Training Programmes',
    location: 'Pan-African & Remote',
    workType: 'Remote',
    description: 'World-class 12-month intensive engineering programme preparing young African professionals for high-growth global technology careers, backed by the Mastercard Foundation.',
    eligibility: 'Applicants aged 18–35 of African origin with access to a laptop and reliable internet connection. Commitment of 30–40 hours per week.',
    requiredQualifications: ['High school diploma or equivalent', 'Passing of ALX cognitive and English assessment'],
    requiredSkills: ['Problem solving', 'Logical reasoning', 'Dedication to collaborative learning', 'Computer literacy'],
    benefits: 'Tuition-free sponsorship for qualifying candidates, direct pathways to global remote jobs, The Room community membership.',
    deadline: '2026-06-30T23:59:59Z',
    officialUrl: 'https://www.alxafrica.com/',
    sourceName: 'ALX Africa Admissions Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T11:00:00Z',
    publishedAt: '2026-02-01T00:00:00Z',
    featured: true,
  },
  {
    id: 'opp-andela-remote-frontend',
    title: 'Senior Frontend Engineer (React & TypeScript) - Global Remote',
    organization: 'Andela Global Talent Network',
    category: 'Remote Jobs',
    location: 'Worldwide Remote (Africa Timezone Friendly)',
    workType: 'Remote',
    description: 'Join the Andela talent marketplace to be matched with top US and European tech enterprises. Build cutting-edge web applications with modern micro-frontends and scalable design systems.',
    eligibility: 'Proven experience building production-grade web applications in React and TypeScript. Excellent asynchronous communication.',
    requiredQualifications: ['3+ years professional software engineering experience', 'Strong portfolio of deployed web applications'],
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'State Management', 'REST/GraphQL APIs'],
    benefits: 'Competitive USD-denominated compensation ($55,000 - $85,000 / year), flexible hours, global remote equipment stipend.',
    deadline: '2026-12-31T23:59:59Z',
    officialUrl: 'https://andela.com/talent/',
    sourceName: 'Andela Careers Network',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T08:00:00Z',
    publishedAt: '2026-03-01T00:00:00Z',
    featured: false,
  },
  {
    id: 'opp-google-startups-africa',
    title: 'Google for Startups Accelerator: Africa (Cohort 9)',
    organization: 'Google for Startups',
    category: 'Business Grants',
    location: 'Lagos, Nairobi, Johannesburg & Virtual',
    workType: 'Hybrid',
    description: 'A 3-month equity-free accelerator programme for African tech startups from Seed to Series A, providing Google AI credits, technical mentorship, and investor exposure.',
    eligibility: 'Technology startups headquartered in Africa with a live product, demonstrated traction, and technical founding team.',
    requiredQualifications: ['Seed to Series A stage', 'Scalable product utilizing software or AI'],
    requiredSkills: ['Product management', 'Tech leadership', 'Growth marketing', 'Investor relations'],
    benefits: 'Up to $350,000 in Google Cloud and AI credits, 1-on-1 mentorship with Google experts, investor demo day, PR support.',
    deadline: '2026-05-18T23:59:59Z',
    officialUrl: 'https://startup.google.com/programs/accelerator/africa/',
    sourceName: 'Google for Startups Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T12:00:00Z',
    publishedAt: '2026-02-15T00:00:00Z',
    featured: false,
  },
  {
    id: 'opp-daad-epos',
    title: 'DAAD Development-Related Postgraduate Courses (EPOS)',
    organization: 'German Academic Exchange Service (DAAD)',
    category: 'Scholarships',
    location: 'Germany',
    workType: 'On-site',
    description: 'Fully funded scholarships for young professionals from developing and emerging countries to pursue specialized Master’s or PhD degree programmes at German universities.',
    eligibility: 'Graduates with at least 2 years of professional experience in development-related fields, public administration, engineering, or public health.',
    requiredQualifications: ['Bachelor’s degree (completed within the last 6 years)', 'Minimum 2 years of relevant work experience'],
    requiredSkills: ['English or German language proficiency (IELTS/TOEFL/TestDaF)', 'Public policy analysis', 'Scientific research'],
    benefits: 'Monthly allowance of €934 for Master’s or €1,300 for PhD, travel subsidies, health and accident insurance, rent subsidies.',
    deadline: '2026-08-31T23:59:59Z',
    officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    sourceName: 'DAAD Official Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T07:45:00Z',
    publishedAt: '2026-01-10T00:00:00Z',
    featured: false,
  },
  {
    id: 'opp-turing-remote-fullstack',
    title: 'Full Stack Engineer (Node.js & Python) - Fast-Track Placement',
    organization: 'Turing Enterprises',
    category: 'Remote Jobs',
    location: 'Remote (Worldwide)',
    workType: 'Remote',
    description: 'High-paying remote career opportunities with Silicon Valley companies. Pass Turing vetting tests once and get matched with elite tech teams.',
    eligibility: 'Engineers worldwide with strong problem-solving skills and expertise in web application development.',
    requiredQualifications: ['Bachelor’s degree in Computer Science or equivalent self-taught portfolio', '3+ years full-stack engineering'],
    requiredSkills: ['Node.js', 'Python', 'React', 'PostgreSQL', 'Cloud Infrastructure (AWS/GCP)'],
    benefits: '$60,000 - $110,000 / year USD, long-term full-time contracts, work from home anywhere.',
    deadline: '2026-12-31T23:59:59Z',
    officialUrl: 'https://www.turing.com/',
    sourceName: 'Turing Developer Network',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T10:15:00Z',
    publishedAt: '2026-03-01T00:00:00Z',
    featured: false,
  },
  {
    id: 'opp-msft-adc-internship',
    title: 'Microsoft Africa Development Centre (ADC) Software Engineering Internship',
    organization: 'Microsoft ADC',
    category: 'Internships',
    location: 'Lagos, Nigeria & Nairobi, Kenya',
    workType: 'Hybrid',
    description: 'Undergraduate software engineering internship at Microsoft ADC engineering hubs, building cloud-scale applications alongside senior Microsoft engineers.',
    eligibility: 'Currently enrolled undergraduate students in Computer Science, Electrical Engineering, or related STEM fields graduating in 2026 or 2027.',
    requiredQualifications: ['Current student status in accredited tertiary institution', 'Strong academic standing'],
    requiredSkills: ['Data structures & algorithms', 'C++, C#, Java, or Python', 'Teamwork', 'Curiosity'],
    benefits: 'Competitive monthly intern salary, equipment allowance, mentorship from Microsoft principal engineers, fast-track to full-time graduate role.',
    deadline: '2026-05-30T23:59:59Z',
    officialUrl: 'https://careers.microsoft.com/',
    sourceName: 'Microsoft Global Careers Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T11:30:00Z',
    publishedAt: '2026-02-20T00:00:00Z',
    featured: false,
  },
  {
    id: 'opp-mtn-science-scholarship',
    title: 'MTN Foundation Science & Technology Scholarship Scheme (STSS)',
    organization: 'MTN Foundation Nigeria',
    category: 'Scholarships',
    location: 'Nigeria',
    workType: 'On-site',
    description: 'Annual scholarship award for high-performing second and third-year undergraduate students studying Science and Technology courses in Nigerian public universities, polytechnics, and colleges of education.',
    eligibility: 'Full-time 200 or 300 level students in Nigerian public tertiary institutions with a minimum CGPA of 3.5 on a 5.0 scale (or equivalent).',
    requiredQualifications: ['Undergraduate student in accredited Nigerian public institution', 'Science and Technology course of study'],
    requiredSkills: ['STEM academic excellence', 'Commitment to national technological development'],
    benefits: '₦300,000 annual academic stipend until graduation (contingent on maintaining academic performance).',
    deadline: '2026-06-15T23:59:59Z',
    officialUrl: 'https://www.mtn.ng/scholarships/',
    sourceName: 'MTN Foundation Official Portal',
    verificationStatus: 'verified',
    isExpired: false,
    lastChecked: '2026-11-08T09:00:00Z',
    publishedAt: '2026-01-20T00:00:00Z',
    featured: false,
  },
];

export const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'course-google-it',
    title: 'Google IT Support Professional Certificate',
    provider: 'Google (Coursera)',
    category: 'Cybersecurity & IT',
    description: 'Learn the fundamentals of IT support, networking, operating systems, system administration, and security with hands-on labs.',
    duration: '3–6 months (5 hours/week)',
    cost: 'Free Financial Aid Available / Free 7-Day Audit',
    certificate: 'Recognized Industry Certificate (ACE Credited)',
    officialUrl: 'https://www.coursera.org/professional-certificates/google-it-support',
    lastChecked: '2026-11-08T10:00:00Z',
  },
  {
    id: 'course-harvard-cs50',
    title: 'CS50: Introduction to Computer Science',
    provider: 'Harvard University (edX)',
    category: 'Software Development',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming using C, Python, SQL, HTML, CSS, and JavaScript.',
    duration: '12 weeks (6–18 hours/week)',
    cost: '100% Free Access to All Course Materials & Problem Sets',
    certificate: 'Free CS50 Certificate of Completion (Paid verified edX certificate optional)',
    officialUrl: 'https://cs50.harvard.edu/x/',
    lastChecked: '2026-11-08T11:00:00Z',
  },
  {
    id: 'course-alx-foundations',
    title: 'ALX AI Career Essentials (AiCE)',
    provider: 'ALX Africa',
    category: 'Artificial Intelligence',
    description: 'Master prompt engineering, workflow automation, and generative AI productivity tools for modern workplaces.',
    duration: '6 weeks (Self-paced + interactive cohort)',
    cost: 'Tuition-Free Sponsored by Mastercard Foundation',
    certificate: 'Official ALX Certificate of Completion',
    officialUrl: 'https://www.alxafrica.com/ai-career-essentials/',
    lastChecked: '2026-11-08T09:30:00Z',
  },
  {
    id: 'course-fcc-data-analysis',
    title: 'Data Analysis with Python Certification',
    provider: 'freeCodeCamp',
    category: 'Data Analysis',
    description: 'Process data using Numpy, Pandas, Matplotlib, and Seaborn. Complete 5 real-world analytical projects.',
    duration: '300 hours self-paced',
    cost: '100% Completely Free (No fees, no paywalls)',
    certificate: 'Free Verified Digital Certification',
    officialUrl: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    lastChecked: '2026-11-08T08:00:00Z',
  },
  {
    id: 'course-michigan-python',
    title: 'Python for Everybody Specialization',
    provider: 'University of Michigan (Coursera)',
    category: 'Software Development',
    description: 'Learn to program and analyze data with Python from scratch. Covers variables, data structures, networked application interfaces, and databases.',
    duration: '4 months (3 hours/week)',
    cost: 'Free to Audit all video lessons & assignments / Free Financial Aid',
    certificate: 'Specialization Certificate (with approved financial aid or paid tier)',
    officialUrl: 'https://www.coursera.org/specializations/python',
    lastChecked: '2026-11-08T11:15:00Z',
  },
  {
    id: 'course-helsinki-ai',
    title: 'Elements of AI: Introduction to Artificial Intelligence',
    provider: 'University of Helsinki & MinnaLearn',
    category: 'Artificial Intelligence',
    description: 'A free online course designed for non-technical learners to understand what AI is, what can (and cannot) be done with AI, and how it impacts society.',
    duration: '6 weeks (5 hours/week)',
    cost: '100% Free',
    certificate: 'Free University Certificate (2 ECTS credits for eligible students)',
    officialUrl: 'https://www.elementsofai.com/',
    lastChecked: '2026-11-08T10:45:00Z',
  },
  {
    id: 'course-cisco-cyber',
    title: 'Introduction to Cybersecurity & Threat Defense',
    provider: 'Cisco Networking Academy',
    category: 'Cybersecurity & IT',
    description: 'Explore the exciting field of cybersecurity, understand common threats and vulnerabilities, and learn how companies protect their digital assets.',
    duration: '15 hours self-paced',
    cost: '100% Free',
    certificate: 'Free Cisco Digital Badge & Certificate',
    officialUrl: 'https://www.skillsforall.com/course/introduction-to-cybersecurity',
    lastChecked: '2026-11-08T09:00:00Z',
  },
];

export const INITIAL_SOURCES: SourceItem[] = [
  { id: 'src-tef', name: 'Tony Elumelu Foundation Portal', website: 'https://www.tonyelumelufoundation.org/', category: 'Business Grants', status: 'active', frequency: 'Daily', lastChecked: '2026-11-08T12:00:00Z' },
  { id: 'src-chevening', name: 'UK FCDO Chevening Portal', website: 'https://www.chevening.org/', category: 'Scholarships', status: 'active', frequency: 'Daily', lastChecked: '2026-11-08T12:00:00Z' },
  { id: 'src-mcf', name: 'Mastercard Foundation Scholars', website: 'https://mastercardfdn.org/', category: 'Scholarships & Education', status: 'active', frequency: 'Daily', lastChecked: '2026-11-08T12:00:00Z' },
  { id: 'src-alx', name: 'ALX Africa Admissions', website: 'https://www.alxafrica.com/', category: 'Professional Training', status: 'active', frequency: 'Daily', lastChecked: '2026-11-08T12:00:00Z' },
  { id: 'src-andela', name: 'Andela Remote Talent Network', website: 'https://andela.com/', category: 'Remote Jobs', status: 'active', frequency: 'Daily', lastChecked: '2026-11-08T12:00:00Z' },
];
