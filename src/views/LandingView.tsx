import React from 'react';
import { OpportunityItem } from '../lib/seedData.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Globe2,
  Laptop,
  CheckCircle2,
  Layers,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingViewProps {
  opportunities: OpportunityItem[];
  savedIds: string[];
  onToggleSave: (opp: OpportunityItem) => void;
  onViewDetails: (opp: OpportunityItem) => void;
  onNavigate: (view: string, filterCategory?: string) => void;
}

const CATEGORIES = [
  { name: 'Jobs', icon: Briefcase, count: '1,200+ Verified', desc: 'Direct corporate roles' },
  { name: 'Remote Work', icon: Laptop, count: '850+ Global', desc: 'Work worldwide from anywhere' },
  { name: 'Scholarships', icon: GraduationCap, count: '450+ Active', desc: 'Undergrad, Master’s & PhD' },
  { name: 'Business Grants', icon: Award, count: '120+ Seed funds', desc: 'Non-dilutive capital' },
  { name: 'Internships', icon: Layers, count: '300+ Roles', desc: 'Global & regional tech programs' },
  { name: 'Free Courses', icon: Globe2, count: '500+ Programs', desc: 'Google, Harvard, ALX' },
];

export const LandingView: React.FC<LandingViewProps> = ({
  opportunities,
  savedIds,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const featuredOpportunities = opportunities.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
                <span>Zero-Scam Intelligent Opportunity Discovery</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500">Nigeria, Africa & Global</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] text-balance">
                Your Next Opportunity Is Closer Than You Think.
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Discover verified jobs, scholarships, grants, remote work and learning opportunities. Let AI help you find opportunities that match your dreams and qualifications.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Find Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!currentUser && (
                  <button
                    onClick={() => openAuthModal('register')}
                    className="px-6 py-3 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Create Free Account
                  </button>
                )}
              </div>

              {/* Verified Trust Markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Free for Applicants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Fraud & Scam Shield Protection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  <span>Official Application Portals Only</span>
                </div>
              </div>
            </div>

            {/* Right Media Banner (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950">
                <img
                  src="/src/assets/images/hero_opportunity_discovery_1794173410471.jpg"
                  alt="Ambitious global professionals connecting to opportunities"
                  className="w-full h-[360px] sm:h-[420px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-white text-xs">
                  <p className="font-semibold text-purple-300">
                    Verified International Pathways
                  </p>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Chevening, Mastercard Foundation, Tony Elumelu Grants, and Global Remote Tech Roles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Opportunity Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Explore by Opportunity Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated and verified pathways for education, employment, and funding.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate('explore', cat.name)}
              className="p-5 text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/60 dark:hover:border-purple-500/60 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">{cat.desc}</p>
              </div>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold mt-3">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Verified Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified & Currently Open</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Trending Opportunities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All 12+ Available</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={savedIds.includes(opp.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </section>

      {/* 4. How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-white relative overflow-hidden">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              How Opportunity Finder AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Three simple steps to connect your talent with verified global employers and scholarship committees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="font-mono text-2xl font-extrabold text-purple-400">01.</span>
              <h3 className="text-base font-bold">Create your free account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register in seconds with Google or email. We never sell your personal data or charge candidate fees.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-2xl font-extrabold text-indigo-400">02.</span>
              <h3 className="text-base font-bold">Tell us your skills & dreams</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete our fast onboarding: your education, skills, remote preference, and target fields of study or work.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-2xl font-extrabold text-blue-400">03.</span>
              <h3 className="text-base font-bold">Discover matching opportunities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive calculated match percentages, tailored CV prep, and apply directly through official host portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits & Scam Protection Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Opportunity Safeguard AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Stop Job & Scholarship Scammers Before They Waste Your Hard-Earned Money.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every year, thousands of jobseekers in Nigeria and across Africa lose money to fake recruitment agents demanding upfront registration or interview fees. Opportunity Safeguard AI analyzes job ads and recruitment messages, instantly flagging high-risk warning signs.
            </p>
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Instant detection of upfront payment traps and fake processing fees.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Verification checks against official corporate and university domains.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Automated advice on protecting your BVN, NIN, and bank credentials.</span>
              </div>
            </div>
            <div>
              <button
                onClick={() => onNavigate('safeguard')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
              >
                Scan an Opportunity for Scams
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Why Ambitious Candidates Trust Opportunity Finder AI
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                  AI Profile Matching Engine
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  We calculate exact eligibility match percentages based on your degree, years of experience, and verifiable skills.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  AI Application Preparation Centre
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Generate tailored ATS-friendly CVs, tailored cover letters, and practice 5 realistic STAR-method interview questions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Curated Free Learning Centre
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Direct access to accredited programs from Google, Harvard, edX, and ALX that qualify you for higher-paying international roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Honest Illustrative Testimonials Section (§4.F: labeled illustrative placeholders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400 font-semibold">
            Community Impact Goals
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Built for Real Career Breakthroughs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            *Illustrative User Scenarios based on our target African candidate personas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Finding legitimate remote jobs from Lagos used to mean sifting through hundreds of telegram scams. Opportunity Finder AI gave me verified portals with clear salary expectations."
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Emeka O.</p>
              <p className="text-[11px] text-slate-500">Frontend Developer · Lagos, Nigeria</p>
              <span className="text-[10px] text-slate-400 italic mt-0.5 block">Illustrative Persona</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "The Chevening scholarship application felt overwhelming. The AI Application Assistant helped me structure my leadership essays using the STAR framework."
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Amina K.</p>
              <p className="text-[11px] text-slate-500">Public Policy Scholar · Abuja, Nigeria</p>
              <span className="text-[10px] text-slate-400 italic mt-0.5 block">Illustrative Persona</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Opportunity Safeguard AI warned me about a WhatsApp fake recruiter claiming to offer an oil & gas badge for ₦35,000. It saved my savings."
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Chidi N.</p>
              <p className="text-[11px] text-slate-500">Graduate Trainee · Port Harcourt, Nigeria</p>
              <span className="text-[10px] text-slate-400 italic mt-0.5 block">Illustrative Persona</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 border border-purple-800/50 text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Start Your Opportunity Search Today
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
            Create your account in under 60 seconds. Discover jobs, scholarships, and grants that fit your genuine qualifications.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => (currentUser ? onNavigate('explore') : openAuthModal('register'))}
              className="px-8 py-3 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              {currentUser ? 'Explore Opportunities' : 'Create Free Account'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
