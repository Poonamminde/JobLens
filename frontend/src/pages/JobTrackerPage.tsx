import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchJobs, fetchStats, createJob, updateJob, deleteJob } from '../api/jobApi';
import type { JobFilters } from '../api/jobApi';
import type { JobApplication, JobFormData, ApplicationStatus } from '../types/jobApplication';
import type { JobStats } from '../types/jobApplication';
import StatsBar from '../components/tracker/StatsBar';
import FilterBar from '../components/tracker/FilterBar';
import JobCard from '../components/tracker/JobCard';
import JobFormModal from '../components/tracker/JobFormModal';
import DeleteConfirmModal from '../components/tracker/DeleteConfirmModal';

const defaultStats: JobStats = { total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 };

export default function JobTrackerPage() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<JobStats>(defaultStats);
  const [filters, setFilters] = useState<JobFilters>({ sort: 'date_desc' });

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // ── Data loading ──────────────────────────────────────────────────────────
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    setError('');
    try {
      const data = await fetchJobs(filters);
      setJobs(data);
    } catch {
      setError('Failed to load job applications. Please try again.');
    } finally {
      setLoadingJobs(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await fetchStats();
      setStats(data);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => { void loadJobs(); }, [loadJobs]);
  useEffect(() => { void loadStats(); }, [loadStats]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleSave = async (data: JobFormData) => {
    if (editJob) {
      await updateJob(editJob._id, data);
    } else {
      await createJob(data);
    }
    await Promise.all([loadJobs(), loadStats()]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget._id);
      setDeleteTarget(null);
      await Promise.all([loadJobs(), loadStats()]);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    const job = jobs.find((j) => j._id === id);
    if (!job) return;
    // Optimistic update
    setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status } : j));
    try {
      const form: JobFormData = {
        jobTitle: job.jobTitle, companyName: job.companyName,
        jobDescription: job.jobDescription ?? '', jobLocation: job.jobLocation,
        employmentType: job.employmentType,
        salaryMin: job.salaryRange?.min?.toString() ?? '',
        salaryMax: job.salaryRange?.max?.toString() ?? '',
        currency: job.salaryRange?.currency ?? 'INR',
        skillsRequired: job.skillsRequired,
        jobUrl: job.jobUrl ?? '', platformSource: job.platformSource,
        recruiterEmail: job.recruiterEmail ?? '',
        applicationDate: job.applicationDate.split('T')[0] ?? '',
        status, notes: job.notes ?? '',
      };
      await updateJob(id, form);
      await loadStats();
    } catch {
      // Revert on failure
      setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status: job.status } : j));
    }
  };

  const openAdd = () => { setEditJob(null); setFormOpen(true); };
  const openEdit = (j: JobApplication) => { setEditJob(j); setFormOpen(true); };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 40% at 50% -20%, rgba(99,102,241,0.1) 0%, transparent 60%), #030712',
      }}
    >
      {/* Orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-1 opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', top: '-80px', left: '-80px' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-[80px] animate-orb-2 opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)', bottom: '-60px', right: '-60px' }} />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5"
        style={{
          background: 'rgba(3,7,18,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 shrink-0 logo-glow">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="url(#gn)" strokeWidth="2.5" />
                <path d="M13 20 L18 25 L27 15" stroke="url(#gn)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="gn" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight brand-gradient-text">JobLens</span>
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-slate-300 font-medium">Job Tracker</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            {initials}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10">
        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Job Application Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {loadingJobs ? 'Loading…' : `${jobs.length} application${jobs.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Application
          </button>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} loading={loadingStats} />

        {/* Filters */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
            <button onClick={() => void loadJobs()} className="ml-auto text-xs underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* Jobs grid */}
        {loadingJobs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl h-52 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <svg className="w-10 h-10 text-indigo-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No applications found</h3>
            <p className="text-sm text-slate-500 mb-5 max-w-xs">
              {filters.search || filters.status || filters.platform
                ? 'Try adjusting your filters'
                : 'Start tracking your job search by adding your first application'}
            </p>
            {!filters.search && !filters.status && !filters.platform && (
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your First Application
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <JobFormModal
        open={formOpen}
        job={editJob}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        job={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
