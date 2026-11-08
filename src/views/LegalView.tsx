import React, { useState } from 'react';
import { ShieldCheck, Mail, HelpCircle, FileText, CheckCircle2, Send } from 'lucide-react';

export const LegalView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'disclaimer' | 'privacy' | 'terms' | 'help' | 'contact'>('disclaimer');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('disclaimer')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'disclaimer'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Opportunity Disclaimer
        </button>
        <button
          onClick={() => setActiveSection('privacy')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'privacy'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveSection('terms')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'terms'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveSection('help')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'help'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Help Centre & FAQ
        </button>
        <button
          onClick={() => setActiveSection('contact')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'contact'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Contact & Inquiries
        </button>
      </div>

      {/* Section 1: Opportunity Disclaimer (§22) */}
      {activeSection === 'disclaimer' && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Official Opportunity & Outcomes Disclaimer
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-purple-950 dark:text-purple-200">
            <strong>Core Principle:</strong> Opportunity Finder AI is an independent technological discovery, curation, and guidance platform. We are not an employer, scholarship granting institution, visa granting authority, or financial sponsor.
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. No Guarantee of Selection, Employment, or Financial Return
            </h3>
            <p>
              Opportunity Finder AI assists candidates in identifying relevant pathways and structuring competitive application materials. Under no circumstances does Opportunity Finder AI guarantee that any user will be awarded a scholarship, hired for a job, granted a visa, or accepted into an accelerator programme. Admission, employment, and scholarship decisions rest solely with the hosting organizations.
            </p>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. How Opportunity Verification Works
            </h3>
            <p>
              We verify opportunities by auditing them against official institutional registries, verified corporate careers portals, accredited university domains, and confirmed government gazettes. While our automated bots and editorial staff verify information regularly, organizations frequently adjust deadlines, compensation, and eligibility criteria. Users must always verify requirements directly on the official host portal before submitting sensitive materials.
            </p>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Zero Tolerance for Candidate Fees
            </h3>
            <p>
              Legitimate employers and official scholarship foundations never charge jobseekers registration fees, processing fees, or interview fees. Any individual claiming to represent Opportunity Finder AI or an external employer who requests payment for an interview or offer letter is fraudulent and should be immediately reported to our fraud team.
            </p>
          </div>
        </div>
      )}

      {/* Section 2: Privacy Policy */}
      {activeSection === 'privacy' && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Privacy Policy & Data Security
          </h2>
          <p>
            Last Updated: November 2026. Your privacy and the confidentiality of your career credentials are our highest priority.
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Data We Collect</h3>
            <p>
              We collect your name, email address, country of residence, self-reported educational attainment, skills, and application tracking records. We do not store sensitive financial credentials, banking passwords, BVN, or NIN.
            </p>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. How Your Data Is Used</h3>
            <p>
              Your data is used solely to generate personalized opportunity match scores, power the Opportunity AI Assistant, and save your application tracker records. We do not sell or monetize personal candidate data to third-party advertisers.
            </p>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Data Deletion Rights</h3>
            <p>
              Under our zero-lockin policy, you may update your profile or permanently request account deletion at any time in the Profile & Settings section.
            </p>
          </div>
        </div>
      )}

      {/* Section 3: Terms of Service */}
      {activeSection === 'terms' && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Terms of Service
          </h2>
          <p>
            By accessing or using Opportunity Finder AI, you agree to comply with our acceptable use policies.
          </p>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Acceptable Use</h3>
            <p>
              You agree not to scrape, reverse-engineer, or use automated scripts to disrupt the platform's infrastructure. You agree not to submit fraudulent advertisements or impersonate corporate recruiters.
            </p>
          </div>
        </div>
      )}

      {/* Section 4: Help Centre & FAQ */}
      {activeSection === 'help' && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions & Help Centre
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                Is Opportunity Finder AI completely free to use?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes. Browsing all verified opportunities, running scam checks with Opportunity Safeguard AI, and tracking applications is completely free. We also provide Pro memberships for users desiring advanced AI CV generation and coaching.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                How do I apply for an opportunity?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Click on any opportunity to view its full requirements. Then click "Apply on Official Website" to be directed to the official hosting organization's portal.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                What should I do if a recruiter asks for money?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Do not pay anything. Legitimate employers never charge candidates. Navigate to Opportunity Safeguard AI to analyze the message, flag it, and submit a scam report to our team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Contact Page */}
      {activeSection === 'contact' && (
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Contact & Platform Inquiries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Have a question, feedback, or need to report an unverified listing? Send a message to our support and safety desk.
            </p>
          </div>

          {contactSent && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your inquiry has been received by our support desk.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Victor Kosisochukwu"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Message / Report Details
              </label>
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your question or provide details of the opportunity you wish to verify..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
