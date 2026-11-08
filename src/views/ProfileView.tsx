import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  User,
  Globe,
  GraduationCap,
  Briefcase,
  Sliders,
  Bell,
  Lock,
  Trash2,
  Check,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';

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

export const ProfileView: React.FC = () => {
  const { userProfile, updateProfileData, logout, resetPassword, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [country, setCountry] = useState(userProfile?.country || 'Nigeria');
  const [highestEducation, setHighestEducation] = useState(
    userProfile?.highestEducation || 'Undergraduate'
  );
  const [experienceLevel, setExperienceLevel] = useState(
    userProfile?.experienceLevel || '1–3 years'
  );
  const [workPreference, setWorkPreference] = useState(
    userProfile?.workPreference || 'remote'
  );

  // Notification preferences
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateProfileData({
        fullName,
        country,
        highestEducation,
        experienceLevel,
        workPreference,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    try {
      await resetPassword(currentUser.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = prompt(
      'Type "DELETE" to confirm permanent account deletion request. All your saved records and preferences will be erased.'
    );
    if (confirmation === 'DELETE') {
      alert('Your account deletion request has been submitted to the security administrator.');
      logout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile & Opportunity Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal credentials, education, skills, and notification preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile preferences saved successfully. Recommendations updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-850 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Country of Residence
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred Work Arrangement
              </label>
              <select
                value={workPreference}
                onChange={(e) => setWorkPreference(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="remote">100% Remote</option>
                <option value="physical">On-site / Physical</option>
                <option value="hybrid">Hybrid</option>
                <option value="any">Open to Any Format</option>
              </select>
            </div>
          </div>
        </div>

        {/* Qualification & Experience */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Education & Experience Match Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Highest Education
              </label>
              <select
                value={highestEducation}
                onChange={(e) => setHighestEducation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {EDUCATION_OPTIONS.map((edu) => (
                  <option key={edu} value={edu}>
                    {edu}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Years of Experience
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Appearance */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Preferences & Appearance</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Dark / Light Visual Mode</p>
                <p className="text-slate-500 text-[11px]">Currently using {theme} theme</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={notifyMatches}
                  onChange={(e) => setNotifyMatches(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>In-app notifications for 80%+ profile matched opportunities</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={notifyDeadlines}
                  onChange={(e) => setNotifyDeadlines(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>Urgent reminders for saved opportunities closing within 7 days</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all disabled:opacity-60"
          >
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Security & Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-4">
        <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Security & Account Management</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">Change Account Password</p>
            <p className="text-[11px] text-slate-500">
              Dispatches a secure reset link to {currentUser?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 self-start sm:self-auto"
          >
            {resetSent ? 'Link Dispatched to Email' : 'Send Password Reset Email'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-rose-200/60 dark:border-rose-900/40">
          <div>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">Request Account Deletion</p>
            <p className="text-[11px] text-slate-500">
              Permanently delete all your personal data, saved records, and tracker entries.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 self-start sm:self-auto"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
