import React, { useState } from 'react';
import { CourseItem } from '../lib/seedData.ts';
import {
  GraduationCap,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';

interface LearningViewProps {
  courses: CourseItem[];
}

const CATEGORIES = [
  'All Fields',
  'Software Development',
  'Artificial Intelligence',
  'Cybersecurity & IT',
  'Data Analysis',
];

export const LearningView: React.FC<LearningViewProps> = ({ courses }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Fields');

  const filteredCourses = courses.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchProvider = c.provider.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchTitle && !matchProvider && !matchDesc) return false;
    }
    if (selectedCategory !== 'All Fields' && c.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <GraduationCap className="w-4 h-4" />
              <span>FREE LEARNING CENTRE</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Direct Accredited Pathways</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Upgrade Your Skills for Global Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Curated free and subsidized courses from Google, Harvard CS50, ALX, Cisco, and freeCodeCamp. Every link connects directly to the legitimate learning portal.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center">
            <img
              src="/src/assets/images/learning_tech_career_1794173411725.jpg"
              alt="Digital learning workspace"
              className="w-48 h-32 object-cover rounded-xl border border-indigo-900/60 shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Honest Certificate Disclosure Callout (§13) */}
      <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-xs text-purple-950 dark:text-purple-200 flex items-start gap-3">
        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent Certificate Policy:</p>
          <p className="leading-relaxed">
            We explicitly label which courses are 100% free with free certificates (e.g., freeCodeCamp, CS50, Cisco) versus courses offering free full learning audit access with optional paid certificates (e.g., Coursera). We never falsely claim paid certificates are free.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or providers..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Category & Provider Header */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {c.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{c.duration}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 line-clamp-2">
                {c.title}
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3">
                {c.provider}
              </p>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {c.description}
              </p>

              {/* Cost & Certificate details */}
              <div className="space-y-1.5 text-xs mb-4">
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Cost:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {c.cost}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Certificate:
                  </span>
                  <span>{c.certificate}</span>
                </div>
              </div>
            </div>

            {/* Direct Official Link Button */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Verified: {new Date(c.lastChecked).toLocaleDateString()}
              </span>
              <a
                href={c.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center gap-1.5"
              >
                <span>Access Course</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
