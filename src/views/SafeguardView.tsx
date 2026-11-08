import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  Lock,
  Send,
  ExternalLink,
  Info,
  Clock,
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const SafeguardView: React.FC = () => {
  const { currentUser } = useAuth();
  const [url, setUrl] = useState('');
  const [advertText, setAdvertText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  const sampleScamAdverts = [
    {
      title: 'Fake Trainee Registration Fee Scam',
      text: 'Urgent recruitment at Global Energy Consortium. Selected candidates must pay a non-refundable registration and security badge fee of ₦15,000 to Account No: 0123456789. Send proof on WhatsApp immediately.',
      url: 'https://careers-globalenergy.wixsite.com/portal',
    },
    {
      title: 'Unrealistic "Earn $600/Day with No Skills"',
      text: 'Earn $600 daily typing captchas from your phone! No experience or degree needed. Work 30 minutes a day. Message our recruitment agent on Telegram @hiringagent99.',
      url: 'https://tinyurl.com/easy-daily-payout',
    },
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !advertText.trim()) {
      setError('Please provide a URL or paste the job/scholarship advertisement text.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/gemini/safeguard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          text: advertText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis server error. Please try again.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Scam analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReportFraud = async () => {
    if (!result) return;
    try {
      await addDoc(collection(db, 'scam_reports'), {
        userId: currentUser?.uid || 'anonymous',
        userEmail: currentUser?.email || 'unregistered',
        targetUrl: url || 'Text-only submission',
        advertText: advertText.slice(0, 3000),
        riskLevel: result.riskLevel,
        riskAnalysis: result.aiAnalysis || result.verdictSummary,
        adminReviewed: false,
        adminNotes: '',
        createdAt: new Date().toISOString(),
      });
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'scam_reports');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-rose-900/40 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>OPPORTUNITY SAFEGUARD AI</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Employment & Scholarship Fraud Defense</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verify Before You Apply or Pay.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Legitimate employers, international scholarship boards, and grant foundations <strong>NEVER</strong> charge application fees, aptitude test fees, or training fees. Submit an ad or link to detect red flags instantly.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-center">
            <img
              src="/src/assets/images/scam_shield_security_1794173411667.jpg"
              alt="Cyber Safeguard Shield"
              className="w-40 h-32 object-cover rounded-xl border border-rose-900/60 shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Critical Security Warning Callout */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Golden Security Invariant:</p>
          <p className="leading-relaxed">
            Never disclose your banking PIN, Bank Verification Number (BVN), National Identity Number (NIN), one-time passwords (OTP), or login credentials to any recruiter. Any offer demanding gift cards, crypto, or money transfers is 100% fraudulent.
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Analyze an Opportunity or Recruiter Message
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste the suspicious website URL or the text of the job description, WhatsApp message, or scholarship email.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website or Application Portal URL (Optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://careers-unverified-portal.com/apply"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Advertisement Text / Message Copy (Required if no URL)
            </label>
            <textarea
              rows={4}
              value={advertText}
              onChange={(e) => setAdvertText(e.target.value)}
              placeholder="Paste the full job advertisement, scholarship message, or email body here..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Quick Test Samples */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Try sample test:</span>
              {sampleScamAdverts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAdvertText(s.text);
                    setUrl(s.url);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <FileSearch className="w-4 h-4" />
              <span>{loading ? 'Performing Forensic Scan...' : 'Analyze Safety Risk'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6 animate-in fade-in">
          {/* Header Verdict Card */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3.5 ${
              result.riskLevel === 'high_risk'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200'
                : result.riskLevel === 'suspicious'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            {result.riskLevel === 'high_risk' ? (
              <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            ) : result.riskLevel === 'suspicious' ? (
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Assessment: {result.riskLevel.replace('_', ' ').toUpperCase()}
                </span>
                <span className="font-mono text-xs font-bold">
                  (Risk Score: {result.riskScore}/100)
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">{result.verdictSummary}</p>
            </div>
          </div>

          {/* Identified Red Flags */}
          {result.redFlags && result.redFlags.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Detected Fraud Warning Signals</span>
              </h3>
              <ul className="space-y-2 pl-2">
                {result.redFlags.map((flag: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Positive Indicators */}
          {result.positiveIndicators && result.positiveIndicators.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standard Indicators Verified</span>
              </h3>
              <ul className="space-y-2 pl-2">
                {result.positiveIndicators.map((pos: string, idx: number) => (
                  <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Forensic Deep Dive */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
              Gemini Forensic Assessment
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {result.aiAnalysis}
            </div>
          </div>

          {/* Actions: Report Fraud Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              *AI safety assessments are advisory. Official verification requires checking the verified corporate registry.
            </p>
            <button
              onClick={handleReportFraud}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
            >
              {reportSuccess ? 'Report Submitted to Admin' : 'Flag & Report Suspicious Listing'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
