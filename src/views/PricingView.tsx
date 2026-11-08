import React, { useState } from 'react';
import { Check, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const PricingView: React.FC = () => {
  const { userProfile, openAuthModal, currentUser } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [stagingModalOpen, setStagingModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span>Transparent Freemium Architecture</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Accelerate Your Global Career Pathways
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Opportunity Finder AI provides free access to every verified listing. Upgrade to Pro for unlimited AI ATS CV generation, personalized cover letters, and deep career coaching.
        </p>

        {/* Cadence Selector */}
        <div className="pt-2 flex justify-center">
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* FREE PLAN */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Discovery
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Standard Free
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Ideal for general browsing, search, and scam verification.
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₦0</span>
              <span className="text-xs text-slate-500">/ forever free</span>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Access all verified jobs, scholarships & grants</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Opportunity Safeguard AI scam checks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic search filters & location sorting</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Save bookmarks & track up to 10 applications</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Free accredited learning centre resources</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard AI Assistant queries (15/day)</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => (!currentUser ? openAuthModal('register') : null)}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              {currentUser ? 'Current Active Plan' : 'Sign Up Free'}
            </button>
          </div>
        </div>

        {/* PRO PLAN */}
        <div className="p-8 rounded-3xl border-2 border-purple-500 dark:border-purple-500 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Career Accelerator
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Pro Membership
                </h3>
              </div>
              <span className="text-[11px] font-bold text-white bg-purple-600 px-2.5 py-0.5 rounded-full">
                Popular
              </span>
            </div>

            <p className="text-xs text-slate-500">
              For ambitious professionals applying to international remote roles and prestigious scholarships.
            </p>

            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">
                {billingPeriod === 'monthly' ? '₦7,500' : '₦67,500'}
              </span>
              <span className="text-xs text-slate-500">
                {billingPeriod === 'monthly' ? '/ month ($8 USD)' : '/ year ($72 USD)'}
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Unlimited ATS-Optimized CV Generation & PDF Export
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Unlimited Tailored Cover Letters for any listing
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>STAR-Method Mock Interview Question Generator</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Unlimited Opportunity AI Assistant conversations</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Unlimited application records in Tracker</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Priority deadline notification alerts</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => setStagingModalOpen(true)}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition-all hover:scale-[1.01]"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* Payment Gateway Sandbox / Staging Notice Modal (§19) */}
      {stagingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Payment Integration Architecture
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with security requirements, real financial transactions require connecting a certified merchant account (e.g. Paystack / Flutterwave / Stripe).
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-white">Developer Staging Status:</p>
              <p>• Plan: Pro Membership ({billingPeriod})</p>
              <p>• Webhook & Subscription schema configured in Firestore</p>
              <p>• Live charge processing disabled until administrator API credentials are connected.</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStagingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
