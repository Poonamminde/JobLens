import type { JobApplication } from '../../types/jobApplication';

interface Props {
  job: JobApplication | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmModal({ job, onConfirm, onCancel, loading }: Props) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 animate-card-in"
        style={{
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid rgba(248,113,113,0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(248,113,113,0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-slate-100 text-center mb-1">Delete Application?</h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          This will permanently delete{' '}
          <span className="text-slate-200 font-medium">{job.jobTitle}</span> at{' '}
          <span className="text-slate-200 font-medium">{job.companyName}</span>.
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', boxShadow: '0 4px 20px rgba(239,68,68,0.3)' }}
          >
            {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-btn" /> : null}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
