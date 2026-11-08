import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';

export interface ApplicationRecord {
  id: string;
  userId: string;
  opportunityId?: string;
  opportunityTitle: string;
  organization: string;
  status:
    | 'Saved'
    | 'Planning to Apply'
    | 'Applied'
    | 'Under Review'
    | 'Interview'
    | 'Accepted'
    | 'Rejected'
    | 'Withdrawn';
  appliedDate?: string;
  deadline?: string;
  notes?: string;
  updatedAt?: string;
}

interface TrackerViewProps {
  applications: ApplicationRecord[];
  onRefresh: () => void;
}

const STATUS_COLUMNS = [
  'Saved',
  'Planning to Apply',
  'Applied',
  'Under Review',
  'Interview',
  'Accepted',
  'Rejected',
] as const;

export const TrackerView: React.FC<TrackerViewProps> = ({ applications, onRefresh }) => {
  const { currentUser, openAuthModal } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ApplicationRecord | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formOrg, setFormOrg] = useState('');
  const [formStatus, setFormStatus] = useState<ApplicationRecord['status']>('Applied');
  const [formAppliedDate, setFormAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDeadline, setFormDeadline] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Sign In to Access Your Application Tracker
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Keep private notes, organize your deadlines, and track your interview stages across jobs and scholarships.
        </p>
        <button
          onClick={() => openAuthModal('signin')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-sm"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const openNewModal = () => {
    setEditingRecord(null);
    setFormTitle('');
    setFormOrg('');
    setFormStatus('Planning to Apply');
    setFormAppliedDate(new Date().toISOString().split('T')[0]);
    setFormDeadline('');
    setFormNotes('');
    setModalOpen(true);
  };

  const openEditModal = (rec: ApplicationRecord) => {
    setEditingRecord(rec);
    setFormTitle(rec.opportunityTitle);
    setFormOrg(rec.organization);
    setFormStatus(rec.status);
    setFormAppliedDate(rec.appliedDate || '');
    setFormDeadline(rec.deadline || '');
    setFormNotes(rec.notes || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSaving(true);
    try {
      if (editingRecord) {
        const ref = doc(db, 'applications', editingRecord.id);
        await updateDoc(ref, {
          opportunityTitle: formTitle.trim(),
          organization: formOrg.trim(),
          status: formStatus,
          appliedDate: formAppliedDate,
          deadline: formDeadline,
          notes: formNotes.trim(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await addDoc(collection(db, 'applications'), {
          userId: currentUser.uid,
          opportunityTitle: formTitle.trim(),
          organization: formOrg.trim(),
          status: formStatus,
          appliedDate: formAppliedDate,
          deadline: formDeadline,
          notes: formNotes.trim(),
          updatedAt: new Date().toISOString(),
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, editingRecord ? OperationType.UPDATE : OperationType.CREATE, 'applications');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this tracked application?')) return;
    try {
      await deleteDoc(doc(db, 'applications', id));
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `applications/${id}`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationRecord['status']) => {
    try {
      await updateDoc(doc(db, 'applications', id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `applications/${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Tracker Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Application Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track deadlines, interview progress, and private application notes.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Application</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500 font-medium">Total Tracked</p>
          <p className="font-mono text-xl font-bold text-slate-900 dark:text-white mt-1">
            {applications.length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Applied & Active</p>
          <p className="font-mono text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {applications.filter((a) => a.status === 'Applied' || a.status === 'Under Review').length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Interviews</p>
          <p className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {applications.filter((a) => a.status === 'Interview').length}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Offers / Accepted</p>
          <p className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {applications.filter((a) => a.status === 'Accepted').length}
          </p>
        </div>
      </div>

      {/* Applications List & Status Cards */}
      {applications.length > 0 ? (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {app.opportunityTitle}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-xs text-slate-500 truncate">{app.organization}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {app.appliedDate && (
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Applied: {app.appliedDate}
                    </span>
                  )}
                  {app.deadline && (
                    <span className="flex items-center gap-1 font-mono text-[11px] text-purple-600 dark:text-purple-400">
                      <Clock className="w-3 h-3" />
                      Deadline: {app.deadline}
                    </span>
                  )}
                  {app.notes && (
                    <span className="text-[11px] text-slate-400 italic line-clamp-1 max-w-sm">
                      Note: "{app.notes}"
                    </span>
                  )}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    app.status === 'Accepted'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : app.status === 'Interview'
                      ? 'border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      : app.status === 'Rejected'
                      ? 'border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <option value="Saved">Saved</option>
                  <option value="Planning to Apply">Planning to Apply</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview">Interview</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>

                <button
                  onClick={() => openEditModal(app)}
                  className="p-2 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit details & notes"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove from tracker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            No applications tracked yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you view an opportunity, click "Track Application" or click the button above to manually record your submissions.
          </p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Add Your First Application
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingRecord ? 'Update Application Record' : 'Track New Application'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Opportunity Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Organization / University
                </label>
                <input
                  type="text"
                  required
                  value={formOrg}
                  onChange={(e) => setFormOrg(e.target.value)}
                  placeholder="e.g. Andela, Chevening, Microsoft"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Planning to Apply">Planning to Apply</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview">Interview</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date Applied
                  </label>
                  <input
                    type="date"
                    value={formAppliedDate}
                    onChange={(e) => setFormAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Application Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Private Notes & Reminders
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Sent customized portfolio. Follow up on Tuesday..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
