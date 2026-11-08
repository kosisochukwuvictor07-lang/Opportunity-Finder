import React, { useState, useMemo, useEffect } from 'react';
import { OpportunityItem } from '../lib/seedData.ts';
import { OpportunityCard } from '../components/OpportunityCard.tsx';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Sparkles,
  History,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { calculateMatchScore } from '../utils/matching.ts';
import {
  RecentSearchItem,
  fetchRecentSearches,
  saveRecentSearch,
  deleteRecentSearch,
} from '../services/recentSearches.ts';

interface ExploreViewProps {
  opportunities: OpportunityItem[];
  savedIds: string[];
  initialCategory?: string;
  onToggleSave: (opp: OpportunityItem) => void;
  onViewDetails: (opp: OpportunityItem) => void;
}

const CATEGORIES = [
  'All Categories',
  'Jobs',
  'Remote Work',
  'Scholarships',
  'Fully Funded Programmes',
  'Internships',
  'Business Grants',
  'Free Courses',
  'Professional Training Programmes',
];

const WORK_TYPES = ['All Formats', 'Remote', 'On-site', 'Hybrid'];

const COUNTRIES = [
  'All Locations',
  'Pan-African',
  'Nigeria',
  'United Kingdom',
  'Germany',
  'Rwanda',
  'Worldwide Remote',
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  opportunities,
  savedIds,
  initialCategory,
  onToggleSave,
  onViewDetails,
}) => {
  const { currentUser, userProfile } = useAuth();

  const [search, setSearch] = useState(
    initialCategory && !CATEGORIES.includes(initialCategory) ? initialCategory : ''
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : 'All Categories'
  );
  const [selectedWorkType, setSelectedWorkType] = useState('All Formats');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'newest'>('match');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  // Synchronize when initialCategory changes from parent navigation
  useEffect(() => {
    if (initialCategory) {
      if (CATEGORIES.includes(initialCategory)) {
        setSelectedCategory(initialCategory);
        setSearch('');
      } else {
        setSearch(initialCategory);
        setSelectedCategory('All Categories');
      }
    }
  }, [initialCategory]);

  const loadRecent = async () => {
    try {
      const items = await fetchRecentSearches(currentUser?.uid, 6);
      setRecentSearches(items);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadRecent();
  }, [currentUser]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedWorkType('All Formats');
    setSelectedLocation('All Locations');
    setSortBy('match');
    setOnlyVerified(false);
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Keyword Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchOrg = opp.organization.toLowerCase().includes(q);
          const matchDesc = opp.description.toLowerCase().includes(q);
          const matchSkills = (opp.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchOrg && !matchDesc && !matchSkills) return false;
        }

        // Category
        if (selectedCategory !== 'All Categories') {
          if (!opp.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }

        // Work Type
        if (selectedWorkType !== 'All Formats') {
          if (opp.workType !== selectedWorkType) return false;
        }

        // Location
        if (selectedLocation !== 'All Locations') {
          if (!opp.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        // Verified only
        if (onlyVerified && opp.verificationStatus !== 'verified') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
        // Match calculation sort
        if (userProfile) {
          const scoreA = calculateMatchScore(userProfile, a).score;
          const scoreB = calculateMatchScore(userProfile, b).score;
          return scoreB - scoreA;
        }
        return 0;
      });
  }, [
    opportunities,
    search,
    selectedCategory,
    selectedWorkType,
    selectedLocation,
    sortBy,
    onlyVerified,
    userProfile,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Verified Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search jobs, scholarships, grants, and internships with verified official application websites.
        </p>
      </div>

      {/* Control Bar: Search Input + Quick Filters */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        {/* Search Input Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const clean = search.trim();
            if (clean) {
              await saveRecentSearch(
                currentUser?.uid,
                clean,
                selectedCategory,
                filteredOpportunities.length
              );
              loadRecent();
            }
          }}
          className="relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, role titles, universities, countries or required skills..."
            className="w-full pl-10 pr-24 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3.5 py-1 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Search
          </button>
        </form>

        {/* Recent Searches Pills in Explore View */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mr-1">
              <History className="w-3 h-3 text-purple-500" />
              Recent:
            </span>
            {recentSearches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={async () => {
                  setSearch(item.query);
                  await saveRecentSearch(currentUser?.uid, item.query);
                  loadRecent();
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  search.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300'
                }`}
                title={`Filter by "${item.query}"`}
              >
                <span>{item.query}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filter Dropdowns & Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Work Arrangement
            </label>
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {WORK_TYPES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Location / Region
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {COUNTRIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="match">Best AI Profile Match</option>
              <option value="deadline">Closing Soonest</option>
              <option value="newest">Recently Published</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredOpportunities.length}</span> verified opportunities
        </p>
        {userProfile && (
          <p className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile-tuned recommendations active</span>
          </p>
        )}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={savedIds.includes(opp.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            No opportunities matched your specific filters.
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing location constraints, or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
