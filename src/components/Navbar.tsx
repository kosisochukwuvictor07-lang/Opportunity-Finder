import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Compass,
  ShieldCheck,
  Bot,
  BookmarkCheck,
  GraduationCap,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Sparkles,
  LogOut,
  Sliders,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, userProfile, isAdmin, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'safeguard', label: 'Safeguard AI', icon: ShieldCheck },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'tracker', label: 'Tracker', icon: BookmarkCheck },
    { id: 'learning', label: 'Learning', icon: GraduationCap },
  ];

  const handleLinkClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleLinkClick(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center shadow-sm shadow-purple-500/20 text-white font-bold text-lg">
            OF
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            Opportunity Finder <span className="text-purple-600 dark:text-purple-400">AI</span>
          </span>
        </button>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-purple-600 dark:text-purple-400 font-semibold border-b-2 border-purple-600 dark:border-purple-400'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                  {userProfile?.fullName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {userProfile?.fullName || currentUser.email?.split('@')[0]}
                </span>
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-slate-950/20 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {userProfile?.fullName || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="pt-1.5 space-y-0.5">
                    <button
                      onClick={() => handleLinkClick('dashboard')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleLinkClick('tools')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-500" />
                      CV & Application Tools
                    </button>
                    <button
                      onClick={() => handleLinkClick('profile')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      Profile & Settings
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleLinkClick('admin')}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('signin')}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm shadow-purple-600/30 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1">
          {currentUser && (
            <button
              onClick={() => handleLinkClick('dashboard')}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
            >
              Dashboard
            </button>
          )}
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center gap-2.5"
            >
              <item.icon className="w-4 h-4 text-purple-500" />
              {item.label}
            </button>
          ))}
          {currentUser && (
            <>
              <button
                onClick={() => handleLinkClick('tools')}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center gap-2.5"
              >
                <Sliders className="w-4 h-4 text-blue-500" />
                CV & Tools
              </button>
              <button
                onClick={() => handleLinkClick('profile')}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center gap-2.5"
              >
                <User className="w-4 h-4 text-indigo-500" />
                Profile & Settings
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleLinkClick('admin')}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg flex items-center gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
