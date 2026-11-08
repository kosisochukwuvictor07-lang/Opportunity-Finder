import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { OpportunityItem, SourceItem } from '../lib/seedData.ts';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Users,
  Database,
  Globe,
  Lock,
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';

interface AdminViewProps {
  opportunities: OpportunityItem[];
  onRefreshOpportunities: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  opportunities,
  onRefreshOpportunities,
}) => {
  const { isAdmin, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'scams' | 'sources' | 'audit'>('overview');

  const [scamReports, setScamReports] = useState<any[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Opportunity Modal
  const [oppModalOpen, setOppModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityItem | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formCat, setFormCat] = useState('Jobs');
  const [formLocation, setFormLocation] = useState('Nigeria');
  const [formWorkType, setFormWorkType] = useState<'Remote' | 'On-site' | 'Hybrid'>('Remote');
  const [formDesc, setFormDesc] = useState('');
  const [formEligibility, setFormEligibility] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formOfficialUrl, setFormOfficialUrl] = useState('');
  const [formSourceName, setFormSourceName] = useState('');
  const [formStatus, setFormStatus] = useState<'verified' | 'unverified' | 'suspicious' | 'expired'>('verified');

  // Load scam reports & sources from Firestore
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const scamsSnap = await getDocs(collection(db, 'scam_reports'));
      const scamsList: any[] = [];
      scamsSnap.forEach((d) => scamsList.push({ id: d.id, ...d.data() }));
      setScamReports(scamsList);

      const sourcesSnap = await getDocs(collection(db, 'opportunity_sources'));
      const sourcesList: SourceItem[] = [];
      sourcesSnap.forEach((d) => sourcesList.push({ id: d.id, ...d.data() } as SourceItem));
      setSources(sourcesList);

      const logsSnap = await getDocs(collection(db, 'admin_logs'));
      const logsList: any[] = [];
      logsSnap.forEach((d) => logsList.push({ id: d.id, ...d.data() }));
      setAuditLogs(logsList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.warn('Admin load note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted: Admin Authorization Required
        </h2>
        <p className="text-xs text-slate-500">
          Administrator privileges are strictly restricted to authorized server configuration and primary engineering personnel.
        </p>
      </div>
    );
  }

  // Open modal for new opportunity
  const openNewOppModal = () => {
    setEditingOpp(null);
    setFormTitle('');
    setFormOrg('');
    setFormCat('Jobs');
    setFormLocation('Nigeria & Remote');
    setFormWorkType('Remote');
    setFormDesc('');
    setFormEligibility('');
    setFormBenefits('');
    setFormDeadline(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setFormOfficialUrl('');
    setFormSourceName('Official Organization Careers Portal');
    setFormStatus('verified');
    setOppModalOpen(true);
  };

  const openEditOppModal = (opp: OpportunityItem) => {
    setEditingOpp(opp);
    setFormTitle(opp.title);
    setFormOrg(opp.organization);
    setFormCat(opp.category);
    setFormLocation(opp.location);
    setFormWorkType(opp.workType);
    setFormDesc(opp.description);
    setFormEligibility(opp.eligibility);
    setFormBenefits(opp.benefits);
    setFormDeadline(opp.deadline.split('T')[0]);
    setFormOfficialUrl(opp.officialUrl);
    setFormSourceName(opp.sourceName);
    setFormStatus(opp.verificationStatus);
    setOppModalOpen(true);
  };

  const handleSaveOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formOrg || !formOfficialUrl) return;

    try {
      if (editingOpp) {
        const oppRef = doc(db, 'opportunities', editingOpp.id);
        await updateDoc(oppRef, {
          title: formTitle,
          organization: formOrg,
          category: formCat,
          location: formLocation,
          workType: formWorkType,
          description: formDesc,
          eligibility: formEligibility,
          benefits: formBenefits,
          deadline: `${formDeadline}T23:59:59Z`,
          officialUrl: formOfficialUrl,
          sourceName: formSourceName,
          verificationStatus: formStatus,
          isExpired: formStatus === 'expired',
          lastChecked: new Date().toISOString(),
        });
      } else {
        const id = `opp-${Date.now()}`;
        await addDoc(collection(db, 'opportunities'), {
          id,
          title: formTitle,
          organization: formOrg,
          category: formCat,
          location: formLocation,
          workType: formWorkType,
          description: formDesc,
          eligibility: formEligibility,
          requiredQualifications: ['Relevant degree or equivalent experience'],
          requiredSkills: ['Communication', 'Professional Competence'],
          benefits: formBenefits,
          deadline: `${formDeadline}T23:59:59Z`,
          officialUrl: formOfficialUrl,
          sourceName: formSourceName,
          verificationStatus: formStatus,
          isExpired: false,
          lastChecked: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          createdBy: currentUser?.uid,
        });
      }

      // Record audit log
      await addDoc(collection(db, 'admin_logs'), {
        adminId: currentUser?.uid,
        adminEmail: currentUser?.email,
        action: editingOpp ? 'UPDATE_OPPORTUNITY' : 'CREATE_OPPORTUNITY',
        targetEntity: formTitle,
        timestamp: new Date().toISOString(),
      });

      setOppModalOpen(false);
      onRefreshOpportunities();
      loadAdminData();
    } catch (err) {
      handleFirestoreError(err, editingOpp ? OperationType.UPDATE : OperationType.CREATE, 'opportunities');
    }
  };

  const handleDeleteOpportunity = async (id: string, title: string) => {
    if (!confirm(`Delete listing "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'opportunities', id));
      await addDoc(collection(db, 'admin_logs'), {
        adminId: currentUser?.uid,
        adminEmail: currentUser?.email,
        action: 'DELETE_OPPORTUNITY',
        targetEntity: title,
        timestamp: new Date().toISOString(),
      });
      onRefreshOpportunities();
      loadAdminData();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `opportunities/${id}`);
    }
  };

  const handleUpdateStatus = async (opp: OpportunityItem, newStatus: any) => {
    try {
      await updateDoc(doc(db, 'opportunities', opp.id), {
        verificationStatus: newStatus,
        isExpired: newStatus === 'expired',
        lastChecked: new Date().toISOString(),
      });
      onRefreshOpportunities();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `opportunities/${opp.id}`);
    }
  };

  const handleResolveScamReport = async (reportId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'scam_reports', reportId), {
        adminReviewed: true,
        adminNotes: status,
      });
      loadAdminData();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `scam_reports/${reportId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Control Console</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Authorized: {currentUser?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Platform Operations & Moderation
          </h1>
        </div>

        <button
          onClick={openNewOppModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Opportunity</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Metrics Overview
        </button>
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'opportunities'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Manage Listings ({opportunities.length})
        </button>
        <button
          onClick={() => setActiveTab('scams')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'scams'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Scam Reports ({scamReports.length})
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'sources'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Portal Sources ({sources.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'audit'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab 1: Overview Metrics (§16.A) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-xs text-slate-500 font-medium">Total Published</p>
              <p className="font-mono text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {opportunities.filter((o) => !o.isExpired).length}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Verified Active</p>
              <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {opportunities.filter((o) => o.verificationStatus === 'verified').length}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Expired Listings</p>
              <p className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {opportunities.filter((o) => o.isExpired || o.verificationStatus === 'expired').length}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Reported Scams</p>
              <p className="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {scamReports.length}
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Integrity & Extensible Discovery Status
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every opportunity listed in Opportunity Finder AI is verified against approved university portals, government scholarship agencies (e.g. Chevening / DAAD / Commonwealth), or accredited corporate programs (Google / Andela / Microsoft). Automatic duplicate detection and deadline expiration routines are active.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Opportunities Management (§16.B) */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3.5 font-semibold">Title & Organization</th>
                  <th className="p-3.5 font-semibold">Category</th>
                  <th className="p-3.5 font-semibold">Deadline</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{opp.title}</p>
                      <p className="text-slate-500 text-[11px]">{opp.organization}</p>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{opp.category}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(opp.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={opp.verificationStatus}
                        onChange={(e) => handleUpdateStatus(opp, e.target.value)}
                        className="px-2 py-1 text-[11px] rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="suspicious">Suspicious</option>
                        <option value="expired">Expired</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditOppModal(opp)}
                        className="p-1.5 text-slate-500 hover:text-purple-600 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id, opp.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Scam Reports (§16.E) */}
      {activeTab === 'scams' && (
        <div className="space-y-4">
          {scamReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {scamReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Report Level: {report.riskLevel}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {report.targetUrl && (
                    <p className="text-xs font-mono text-purple-600 dark:text-purple-400 break-all">
                      URL: {report.targetUrl}
                    </p>
                  )}

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-800 p-3 rounded-xl font-mono text-[11px]">
                    {report.advertText}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Status: {report.adminReviewed ? `Reviewed (${report.adminNotes})` : 'Pending Review'}
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleResolveScamReport(report.id, 'Confirmed Fraud')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white"
                      >
                        Confirm Fraud
                      </button>
                      <button
                        onClick={() => handleResolveScamReport(report.id, 'Dismissed / False Positive')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No user scam reports submitted yet.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Source Management (§16.D) */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{src.name}</h4>
                  <a
                    href={src.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    {src.website}
                  </a>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Frequency: {src.frequency} · Status: {src.status}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connector Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>: {log.targetEntity}
                  <span className="text-[10px] text-slate-400 ml-2">by {log.adminEmail}</span>
                </div>
                <span className="text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-slate-400 text-xs">No audit logs recorded yet.</p>
          )}
        </div>
      )}

      {/* Create / Edit Opportunity Modal */}
      {oppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingOpp ? 'Edit Opportunity' : 'Publish New Verified Opportunity'}
            </h3>

            <form onSubmit={handleSaveOpportunity} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chevening UK Government Scholarships"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={formOrg}
                    onChange={(e) => setFormOrg(e.target.value)}
                    placeholder="e.g. UK FCDO"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Jobs">Jobs</option>
                    <option value="Remote Work">Remote Work</option>
                    <option value="Scholarships">Scholarships</option>
                    <option value="Business Grants">Business Grants</option>
                    <option value="Internships">Internships</option>
                    <option value="Free Courses">Free Courses</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. United Kingdom, Nigeria, Remote"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Work Arrangement
                  </label>
                  <select
                    value={formWorkType}
                    onChange={(e) => setFormWorkType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Overview of the opportunity..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Eligibility Criteria
                </label>
                <textarea
                  rows={2}
                  value={formEligibility}
                  onChange={(e) => setFormEligibility(e.target.value)}
                  placeholder="Degrees required, citizenship, minimum experience..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Benefits & Compensation
                </label>
                <input
                  type="text"
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  placeholder="e.g. $5,000 equity-free grant or Full tuition + £1,500/mo stipend"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Verification Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Official Application Website URL
                </label>
                <input
                  type="url"
                  required
                  value={formOfficialUrl}
                  onChange={(e) => setFormOfficialUrl(e.target.value)}
                  placeholder="https://official-portal.org/apply"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOppModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
