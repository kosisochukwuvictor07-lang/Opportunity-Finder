import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const EDUCATION_OPTIONS = [
  'No formal qualification',
  'Primary education',
  'Secondary education',
  'Diploma',
  'Undergraduate',
  'Graduate',
  'Postgraduate',
  'Other',
];

const EXPERIENCE_OPTIONS = [
  'Beginner',
  'No experience',
  'Less than one year',
  '1–3 years',
  '3–5 years',
  'More than five years',
];

const WORK_PREFERENCES = [
  { id: 'remote', label: '100% Remote', desc: 'Work from home anywhere in Nigeria or internationally' },
  { id: 'physical', label: 'On-site / Physical', desc: 'Relocation or in-person work in chosen region' },
  { id: 'hybrid', label: 'Hybrid Flexibility', desc: 'Combination of in-office and remote collaboration' },
  { id: 'any', label: 'Open to Any Format', desc: 'Prioritize best opportunities regardless of format' },
];

const CATEGORY_OPTIONS = [
  'Jobs',
  'Remote Work',
  'Scholarships',
  'Fully Funded Programmes',
  'Internships',
  'Business Grants',
  'Freelancing',
  'Free Courses',
  'Professional Training Programmes',
];

const SKILL_OPTIONS = [
  'JavaScript / TypeScript',
  'React / Frontend',
  'Python',
  'Data Analysis & SQL',
  'Graphic Design & UI/UX',
  'Digital Marketing',
  'Cybersecurity',
  'Product Management',
  'Communication & Writing',
  'Customer Support',
  'Financial Modeling',
  'Research & Proposal Writing',
];

const INDUSTRY_OPTIONS = [
  'Technology & Software',
  'FinTech & Banking',
  'Education & EdTech',
  'Healthcare & Life Sciences',
  'Agriculture & AgriTech',
  'Creative Arts & Media',
  'Non-Profit & Development',
  'Renewable Energy',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { userProfile, updateProfileData } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState(userProfile?.country || 'Nigeria');
  const [highestEducation, setHighestEducation] = useState(userProfile?.highestEducation || 'Undergraduate');
  const [experienceLevel, setExperienceLevel] = useState(userProfile?.experienceLevel || '1–3 years');
  const [workPreference, setWorkPreference] = useState(userProfile?.workPreference || 'remote');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(userProfile?.targetCategories || ['Jobs', 'Remote Work', 'Scholarships']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userProfile?.skills || ['Communication & Writing']);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(userProfile?.industries || ['Technology & Software']);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateProfileData({
        country,
        highestEducation,
        experienceLevel,
        workPreference,
        targetCategories: selectedCategories,
        skills: selectedSkills,
        industries: selectedIndustries,
        isOnboarded: true,
      });
      onComplete();
    } catch (err) {
      console.error('Error saving onboarding preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
              {step}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Personalizing Your Opportunity Radar (Step {step} of 3)
            </span>
          </div>
          <button
            onClick={handleFinish}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Education, Country & Experience */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tell us about your background
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                We use your education and location to filter strict institutional eligibility requirements.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Country of Residence
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Nigeria, Ghana, Kenya"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Highest Educational Qualification
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EDUCATION_OPTIONS.map((edu) => (
                  <button
                    key={edu}
                    type="button"
                    onClick={() => setHighestEducation(edu)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      highestEducation === edu
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {edu}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperienceLevel(exp)}
                    className={`p-2 text-xs text-center rounded-xl border transition-all ${
                      experienceLevel === exp
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all"
              >
                <span>Next: Target Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Categories & Work Format */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What opportunities are you seeking?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select all pathways that match your current career and educational ambitions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Opportunity Categories (Multiple selections allowed)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`p-2 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Working Arrangement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WORK_PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setWorkPreference(pref.id)}
                    className={`p-2.5 text-xs text-left rounded-xl border transition-all ${
                      workPreference === pref.id
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <p className="font-semibold">{pref.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pref.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all"
              >
                <span>Next: Skills & Industries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Skills & Industries */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skills & Target Industries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Our AI matching engine pairs these against job descriptions, scholarship requirements, and grants.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Your Core Skills (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_OPTIONS.map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        isChecked
                          ? 'border-purple-600 bg-purple-600 text-white font-medium shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Target Industries
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRY_OPTIONS.map((ind) => {
                  const isChecked = selectedIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleIndustry(ind)}
                      className={`p-2 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="truncate">{ind}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-600/30 transition-all disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving Preferences...' : 'Launch Opportunity Radar'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
