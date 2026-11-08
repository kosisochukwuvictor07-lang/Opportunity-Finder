import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                OF
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                Opportunity Finder AI
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover Opportunities. Unlock Your Future. Connecting ambitious talent in Nigeria, Africa, and worldwide with verified jobs, scholarships, grants, and learning pathways.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Scam Verification Protocol</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Explore Pathways
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Remote Tech Jobs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  International Scholarships
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Entrepreneurship Grants
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learning')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Free Accredited Courses
                </button>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              AI Tools & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('safeguard')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Opportunity Safeguard AI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Career & Scholarship Coach
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  CV Builder & Cover Letter
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Plans & Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('legal')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Opportunity Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal')} className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Help Centre & Fraud Reporting
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] leading-relaxed text-slate-500">
          <p>
            <strong>Official Transparency Notice:</strong> Opportunity Finder AI aggregates and evaluates opportunities from verified institutional portals, universities, and approved organizations. Opportunity Finder AI is an independent advisory and discovery platform and is not affiliated with the UK Government, Mastercard Foundation, Google, or Tony Elumelu Foundation. We do not guarantee selection, employment offers, or scholarship grants. Legitimate organizations never charge application fees.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Opportunity Finder AI. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Engineered with care for African and global talent.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
