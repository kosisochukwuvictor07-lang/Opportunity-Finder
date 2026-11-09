import React, { useState } from 'react';
import { OpportunityItem } from '../lib/seedData.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  FileText,
  Mail,
  HelpCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  Building2,
  Briefcase,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { getApiUrl } from '../lib/api.ts';

interface ApplicationToolsViewProps {
  opportunities: OpportunityItem[];
  preselectedOpportunity?: OpportunityItem | null;
  defaultTool?: 'cv' | 'cover' | 'email' | 'interview';
}

export const ApplicationToolsView: React.FC<ApplicationToolsViewProps> = ({
  opportunities,
  preselectedOpportunity,
  defaultTool = 'cv',
}) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'cv' | 'cover' | 'email' | 'interview'>(defaultTool);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(
    preselectedOpportunity?.id || (opportunities[0]?.id ?? '')
  );

  const selectedOpp = opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];

  // Tool states
  const [cvTemplate, setCvTemplate] = useState<'modern' | 'executive' | 'scholarship'>('executive');
  const [cvContent, setCvContent] = useState('');
  const [coverContent, setCoverContent] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [interviewContent, setInterviewContent] = useState('');

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate CV
  const handleGenerateCV = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/gemini/cv-generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetOpportunity: selectedOpp,
          template: cvTemplate,
        }),
      });
      const data = await res.json();
      setCvContent(data.content || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Cover Letter
  const handleGenerateCover = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/gemini/cover-letter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetOpportunity: selectedOpp,
          tone: 'persuasive and professional',
        }),
      });
      const data = await res.json();
      setCoverContent(data.coverLetter || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Email
  const handleGenerateEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/gemini/application-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetOpportunity: selectedOpp,
          emailType: 'formal_application_submission',
        }),
      });
      const data = await res.json();
      setEmailContent(data.emailText || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Interview Questions
  const handleGenerateInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/gemini/interview-prep'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetOpportunity: selectedOpp,
          userProfile,
        }),
      });
      const data = await res.json();
      setInterviewContent(data.interviewGuide || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Export CV to PDF
  const handleExportPDF = () => {
    const textToExport = cvContent || 'Opportunity Finder AI CV Draft';
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(textToExport, 180);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(splitText, 15, 20);
    doc.save(`${userProfile?.fullName || 'Candidate'}_CV.pdf`);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>AI Application Preparation Centre</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Craft Winning Applications Tailored to Any Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate ATS-optimized CVs, targeted cover letters, cold outreach emails, and practice interview questions.
        </p>
      </div>

      {/* Target Opportunity Selector */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Briefcase className="w-4 h-4 text-purple-500" />
          <span>Targeting Opportunity:</span>
        </div>
        <div className="flex-1 max-w-xl">
          <select
            value={selectedOpportunityId}
            onChange={(e) => setSelectedOpportunityId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.title} ({opp.organization}) - {opp.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tools Container with Tabs */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cv')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'cv'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>CV / Resume Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('cover')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'cover'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Cover Letter Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'email'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Application Email</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'interview'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interview Coach (STAR)</span>
          </button>
        </div>

        {/* Tab 1: CV Builder */}
        {activeTab === 'cv' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ATS Professional CV Builder
                </h3>
                <p className="text-xs text-slate-500">
                  Select a template and let AI synthesize your profile into a structured, highly persuasive document.
                </p>
              </div>

              {/* Template selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Template:</span>
                <select
                  value={cvTemplate}
                  onChange={(e) => setCvTemplate(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="executive">Executive Corporate</option>
                  <option value="modern">Modern Tech & Remote</option>
                  <option value="scholarship">Academic & Scholarship</option>
                </select>
                <button
                  onClick={handleGenerateCV}
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all disabled:opacity-60"
                >
                  {loading ? 'Drafting...' : 'Generate CV'}
                </button>
              </div>
            </div>

            {/* Editable CV Canvas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>You can directly review and edit the draft below before downloading:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(cvContent)}
                    disabled={!cvContent}
                    className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-purple-600 rounded flex items-center gap-1 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={!cvContent}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={16}
                value={cvContent}
                onChange={(e) => setCvContent(e.target.value)}
                placeholder="Click 'Generate CV' to populate this canvas with an ATS-optimized resume draft tailored to your target opportunity..."
                className="w-full p-4 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Cover Letter Generator */}
        {activeTab === 'cover' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tailored Cover Letter Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Craft a persuasive letter highlighting why you are the ideal applicant for {selectedOpp.title}.
                </p>
              </div>
              <button
                onClick={handleGenerateCover}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all disabled:opacity-60"
              >
                {loading ? 'Generating...' : 'Generate Tailored Letter'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopyText(coverContent)}
                  disabled={!coverContent}
                  className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 rounded flex items-center gap-1 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={14}
                value={coverContent}
                onChange={(e) => setCoverContent(e.target.value)}
                placeholder="Click 'Generate Tailored Letter' to generate an impact-focused cover letter..."
                className="w-full p-4 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Application Email */}
        {activeTab === 'email' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Application Email & Cold Outreach
                </h3>
                <p className="text-xs text-slate-500">
                  Generate a polished submission email or direct message to hiring teams and scholarship coordinators.
                </p>
              </div>
              <button
                onClick={handleGenerateEmail}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all disabled:opacity-60"
              >
                {loading ? 'Drafting...' : 'Write Application Email'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopyText(emailContent)}
                  disabled={!emailContent}
                  className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 rounded flex items-center gap-1 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={12}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Click 'Write Application Email' to generate formal submission email copy..."
                className="w-full p-4 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Interview Coach */}
        {activeTab === 'interview' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interview Questions & STAR Method Preparation
                </h3>
                <p className="text-xs text-slate-500">
                  Practice high-frequency interview questions with model answers tailored for {selectedOpp.title}.
                </p>
              </div>
              <button
                onClick={handleGenerateInterview}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-all disabled:opacity-60"
              >
                {loading ? 'Analyzing Questions...' : 'Generate Interview Prep'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopyText(interviewContent)}
                  disabled={!interviewContent}
                  className="p-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-purple-600 rounded flex items-center gap-1 disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={16}
                value={interviewContent}
                onChange={(e) => setInterviewContent(e.target.value)}
                placeholder="Click 'Generate Interview Prep' to receive 5 targeted technical & behavioral interview questions with model STAR answers..."
                className="w-full p-4 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
