import React, { useState, useEffect } from 'react';
import { OpportunityItem, CourseItem } from '../lib/seedData.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { calculateMatchScore } from '../utils/matching.ts';
import {
  RecentSearchItem,
  fetchRecentSearches,
  saveRecentSearch,
  deleteRecentSearch,
  clearAllRecentSearches,
} from '../services/recentSearches.ts';
import {
  Search,
  Sparkles,
  Clock,
  History,
  X,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  Bot,
  Sliders,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Calendar,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  opportunities: OpportunityItem[];
  courses: CourseItem[];
  savedIds: string[];
  applicationsCount: number;
  onToggleSave: (opp: OpportunityItem) => void;
  onViewDetails: (opp: OpportunityItem) => void;
  onNavigate: (view: string, filterCategory?: string) => void;
}

function formatRelativeTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  opportunities,
  courses,
  savedIds,
  applicationsCount,
  onToggleSave,
  onViewDetails,
  onNavigate,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(false);

  // Load recent searches from Firestore
  const loadSearches = async () => {
    setLoadingSearches(true);
    try {
      const items = await fetchRecentSearches(currentUser?.uid);
      setRecentSearches(items);
    } catch (err) {
      console.warn('Could not load recent searches:', err);
    } finally {
      setLoadingSearches(false);
    }
  };

  useEffect(() => {
    loadSearches();
  }, [currentUser]);

  // Calculate match scores for all opportunities and sort by highest fit
  const scoredOpportunities = opportunities.map((opp) => {
    const match = userProfile
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
            title: opp.title,
            category: opp.category,
            location: opp.location,
            workType: opp.workType,
            requiredQualifications: opp.requiredQualifications,
            requiredSkills: opp.requiredSkills,
          }
        )
      : { score: 50 };
    return { opp, score: match.score };
  });

  // Recommended: top 4 scored
  const recommended = [...scoredOpportunities]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.opp);

  // Closing soon: sorted by deadline
  const closingSoon = [...opportunities]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  // Recently added
  const recentlyAdded = [...opportunities]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  const savedOpportunities = opportunities.filter((o) => savedIds.includes(o.id));

  // Quick rerun of past search
  const handleRerunSearch = async (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) return;
    try {
      await saveRecentSearch(currentUser?.uid, clean);
      loadSearches();
    } catch (err) {
      console.warn('Error saving rerun:', err);
    }
    onNavigate('explore', clean);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (clean) {
      try {
        await saveRecentSearch(currentUser?.uid, clean);
        loadSearches();
      } catch (err) {
        console.warn('Error saving search:', err);
      }
      onNavigate('explore', clean);
    }
  };

  const handleDeleteSearch = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteRecentSearch(id, currentUser?.uid);
    } catch (err) {
      console.warn('Error deleting recent search:', err);
      loadSearches();
    }
  };

  const handleClearAllSearches = async () => {
    setRecentSearches([]);
    try {
      await clearAllRecentSearches(currentUser?.uid);
    } catch (err) {
      console.warn('Error clearing searches:', err);
      loadSearches();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header Welcome & Search Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/95 border border-purple-800/40 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Welcome back, {userProfile?.fullName || 'Candidate'}</span>
            <span aria-hidden="true" className="text-purple-400/50">·</span>
            <span>{userProfile?.country || 'Nigeria'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover Verified Opportunities Matching Your Profile
          </h1>

          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
            Targeting: {(userProfile?.targetCategories || ['Jobs', 'Scholarships']).join(', ')} ·{' '}
            {userProfile?.workPreference === 'remote' ? '100% Remote Focus' : 'Flexible Format'}
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, scholarship, country or skill (e.g. React, Chevening, Master's)..."
                className="w-full pl-10 pr-24 py-2.5 text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Recent Searches / Fast Rerun Pills */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-purple-200/90 font-medium max-w-xl">
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400" />
                <span>{recentSearches.length > 0 ? 'Recent Searches' : 'Suggested Searches'}</span>
                <span className="text-purple-400/50">·</span>
                <span className="text-[10px] text-purple-300/80">
                  {recentSearches.length > 0 ? 'Tap to rerun' : 'Quick starts'}
                </span>
              </div>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSearches}
                  className="text-[10px] text-purple-300 hover:text-white transition-colors underline"
                >
                  Clear history
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 items-center max-w-2xl">
              {recentSearches.length > 0 ? (
                recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleRerunSearch(item.query)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-900 border border-purple-700/50 hover:border-purple-400 text-white text-xs cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                    title={`Rerun search for "${item.query}"`}
                  >
                    <RotateCcw className="w-3 h-3 text-purple-400 group-hover:text-purple-300 group-hover:rotate-45 transition-transform" />
                    <span className="font-medium text-slate-100">{item.query}</span>
                    <span className="text-[10px] text-purple-300/70 font-normal">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSearch(e, item.id)}
                      className="ml-1 p-0.5 rounded text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                      title="Remove from history"
                      aria-label={`Remove search "${item.query}"`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                [
                  'Remote Software Engineer',
                  'Chevening Scholarship',
                  'Tony Elumelu Grant',
                  'Mastercard Foundation',
                  'Google for Startups',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleRerunSearch(suggestion)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/50 hover:bg-slate-900 border border-slate-700/60 hover:border-purple-400 text-purple-200 text-xs transition-colors"
                  >
                    <Search className="w-3 h-3 text-purple-400" />
                    <span>{suggestion}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Action Shortcuts (AI Assistant, Scam Safeguard, CV Builder, Tracker) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('assistant')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">AI Career Assistant</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Ask scholarship & interview questions</p>
        </button>

        <button
          onClick={() => onNavigate('safeguard')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">Opportunity Safeguard</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Verify suspicious ads for fraud</p>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Sliders className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white">CV & Cover Letter</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Generate tailored PDF application materials</p>
        </button>

        <button
          onClick={() => onNavigate('tracker')}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-900 dark:text-white">Application Tracker</p>
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {applicationsCount} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Track your ongoing submissions</p>
        </button>
      </div>

      {/* 3. Recommended for You (AI Profile Matching) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Personalized Recommendations
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              (Ranked by match calculation with your profile)
            </span>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((opp) => (
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

      {/* 4. Closing Soon Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Opportunities Closing Soon
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              (Prioritize upcoming deadlines)
            </span>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View Deadlines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {closingSoon.map((opp) => (
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

      {/* 5. Recently Added Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recently Verified Additions
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyAdded.map((opp) => (
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

      {/* 6. Saved Opportunities Drawer / Shortcut */}
      {savedOpportunities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Saved Bookmarks ({savedOpportunities.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Manage in Tracker
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedOpportunities.slice(0, 4).map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={true}
                onToggleSave={onToggleSave}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. Learning Centre Highlights */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Free Skill Upgrading</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Prerequisite Learning & Certifications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited courses to strengthen your CV for global remote jobs and international scholarships.
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors shrink-0"
          >
            Explore Learning Centre
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {courses.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  {c.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">
                  {c.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">{c.provider}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] flex items-center justify-between">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{c.cost}</span>
                <a
                  href={c.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View Course →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
