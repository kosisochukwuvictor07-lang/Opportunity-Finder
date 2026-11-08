import React from 'react';
import { OpportunityItem } from '../lib/seedData.ts';
import { Bookmark, BookmarkCheck, Calendar, MapPin, Building2, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { calculateMatchScore } from '../utils/matching.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  isSaved?: boolean;
  onToggleSave?: (opp: OpportunityItem) => void;
  onViewDetails: (opp: OpportunityItem) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSaved = false,
  onToggleSave,
  onViewDetails,
}) => {
  const { userProfile } = useAuth();

  // Compute real documented match score if user profile exists
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

  // Format date helper
  const formatDeadline = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Card Header: Quiet Unboxed Metadata with Typographic Separators */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-purple-700 dark:text-purple-400">
              {opportunity.category}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="truncate">{opportunity.workType}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="truncate">{opportunity.location}</span>
          </div>

          {/* Bookmark save toggle */}
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(opportunity);
              }}
              aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
              className="p-1 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shrink-0 ml-2"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-purple-600 fill-purple-600 dark:text-purple-400 dark:fill-purple-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors cursor-pointer line-clamp-2 mb-1.5"
        >
          {opportunity.title}
        </h3>

        {/* Organization */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{opportunity.organization}</span>
        </div>

        {/* Eligibility Brief */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {opportunity.eligibility}
        </p>

        {/* Key Required Skills (Clean Unboxed items) */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="text-[11px] text-slate-500 mb-4 truncate">
            <span className="font-medium text-slate-700 dark:text-slate-300">Required Skills: </span>
            {opportunity.requiredSkills.slice(0, 3).join(', ')}
          </div>
        )}
      </div>

      {/* Footer Info: Match Score + Verification Status + Deadline + View Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-3">
          {/* Match Score */}
          {matchResult ? (
            <div className="flex items-center gap-1 font-mono text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
              <span className="tabular-nums">{matchResult.score}%</span>
              <span>Match</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Official Source</span>
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono tabular-nums">
            <Calendar className="w-3 h-3" />
            <span>Closes {formatDeadline(opportunity.deadline)}</span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(opportunity)}
            className="flex-1 py-2 px-3 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl transition-colors text-center"
          >
            View Details
          </button>
          <a
            href={opportunity.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="py-2 px-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
