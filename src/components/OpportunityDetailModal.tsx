import React, { useState } from 'react';
import { OpportunityItem } from '../lib/seedData.ts';
import {
  X,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  FileText,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { calculateMatchScore } from '../utils/matching.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface OpportunityDetailModalProps {
  opportunity: OpportunityItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (opp: OpportunityItem) => void;
  onNavigateToTools?: (tool: 'cv' | 'cover' | 'email' | 'interview', opp: OpportunityItem) => void;
  onTrackApplication?: (opp: OpportunityItem) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  onNavigateToTools,
  onTrackApplication,
}) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'match'>('details');

  if (!isOpen || !opportunity) return null;

  const matchResult = userProfile
    ? calculateMatchScore(
        {
          country: userProfile.country,
          highestEducation: userProfile.highestEducation,
          experienceLevel: userProfile.experienceLevel,
          workPreference: userProfile.workPreference,
          skills: userProfile.skills,
          targetCategories: userProfile.targetCategories,
        },
        {
          title: opportunity.title,
          category: opportunity.category,
          location: opportunity.location,
          workType: opportunity.workType,
          requiredQualifications: opportunity.requiredQualifications,
          requiredSkills: opportunity.requiredSkills,
        }
      )
    : null;

  const formatDeadline = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              {opportunity.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">{opportunity.workType}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Listing</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(opportunity)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                title={isSaved ? 'Saved in your library' : 'Save opportunity'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-purple-600 fill-purple-600 dark:text-purple-400 dark:fill-purple-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header Content */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {opportunity.title}
          </h2>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-200">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{opportunity.organization}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{opportunity.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-purple-700 dark:text-purple-300">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Deadline: {formatDeadline(opportunity.deadline)}</span>
            </div>
          </div>

          {/* Segmented Tabs: Details vs AI Match Breakdown */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview & Requirements
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'match'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>AI Match Analysis {matchResult ? `(${matchResult.score}%)` : ''}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          {activeTab === 'details' ? (
            <>
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Opportunity Description
                </h3>
                <p className="leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                  {opportunity.description}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Eligibility Criteria
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {opportunity.eligibility}
                </div>
              </div>

              {/* Required Qualifications & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Key Qualifications
                  </h3>
                  <ul className="space-y-1.5">
                    {opportunity.requiredQualifications?.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Required Skills & Knowledge
                  </h3>
                  <ul className="space-y-1.5">
                    {opportunity.requiredSkills?.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benefits & Remuneration */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Benefits & Coverage
                </h3>
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-purple-950 dark:text-purple-200 leading-relaxed">
                  {opportunity.benefits}
                </div>
              </div>

              {/* Verified Source Citation */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <p>
                  <strong>Verified Data Source:</strong> {opportunity.sourceName} · Last checked:{' '}
                  {new Date(opportunity.lastChecked).toLocaleString()}
                </p>
                <p className="mt-1 text-slate-400">
                  Opportunity Finder AI never fabricates opportunities. Always complete your submission directly on the official host website below.
                </p>
              </div>
            </>
          ) : (
            /* AI Matching Engine Tab */
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                    Calculated Profile Compatibility
                  </span>
                  <span className="font-mono text-base font-bold text-purple-700 dark:text-purple-300">
                    {matchResult ? `${matchResult.score}% Match` : 'Profile Not Set'}
                  </span>
                </div>
                <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                  {matchResult?.recommendationNote ||
                    'Complete your onboarding profile (skills, education, and target categories) to view a personalized match breakdown.'}
                </p>
              </div>

              {matchResult && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Qualifications & Preferences You Already Meet</span>
                    </h4>
                    <div className="space-y-1.5 pl-5">
                      {matchResult.metRequirements.length > 0 ? (
                        matchResult.metRequirements.map((r, i) => (
                          <p key={i} className="text-xs text-slate-700 dark:text-slate-300">
                            • {r}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500">No direct criteria overlap found yet.</p>
                      )}
                    </div>
                  </div>

                  {matchResult.missingRequirements.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Areas to Strengthen Before Applying</span>
                      </h4>
                      <div className="space-y-1.5 pl-5">
                        {matchResult.missingRequirements.map((r, i) => (
                          <p key={i} className="text-xs text-slate-700 dark:text-slate-300">
                            • {r}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                      Recommended Next Actions
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                      <li>Review the official portal requirements at least 2 weeks before the deadline.</li>
                      <li>Use our AI Application Assistant to generate a tailored CV and cover letter.</li>
                      <li>Add this opportunity to your Application Tracker to monitor submission progress.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onTrackApplication && (
              <button
                onClick={() => {
                  onTrackApplication(opportunity);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Track Application</span>
              </button>
            )}

            {onNavigateToTools && (
              <button
                onClick={() => {
                  onNavigateToTools('cover', opportunity);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Write Cover Letter</span>
              </button>
            )}
          </div>

          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <span>Apply on Official Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
