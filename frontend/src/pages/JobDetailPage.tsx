import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJob, updateJob, deleteJob } from '../api/jobApi';
import type { JobApplication, JobFormData, ApplicationStatus } from '../types/jobApplication';
import { STATUS_STYLES, STATUSES } from '../types/jobApplication';
import JobFormModal from '../components/tracker/JobFormModal';
import DeleteConfirmModal from '../components/tracker/DeleteConfirmModal';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatSalary(job: JobApplication) {
  const { min, max, currency } = job.salaryRange ?? {};
  if (!min && !max) return null;
  const fmt = (n?: number) => n ? n.toLocaleString('en-IN') : '?';
  return `${currency ?? 'INR'} ${fmt(min)} – ${fmt(max)}`;
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <h2 className="text-[0.72rem] font-semibold text-slate-500 uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  );
}

// ── Meta pill ─────────────────────────────────────────────────────────────────
function Pill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-slate-300 bg-white/[0.05] border border-white/[0.07]">
      <span className="text-slate-500">{icon}</span>
      {label}
    </span>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchJob(id)
      .then(setJob)
      .catch(() => setError('Job application not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: JobFormData) => {
    if (!job) return;
    const updated = await updateJob(job._id, data);
    setJob(updated);
  };

  const handleDelete = async () => {
    if (!job) return;
    setDeleting(true);
    try {
      await deleteJob(job._id);
      navigate('/tracker', { replace: true });
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: ApplicationStatus) => {
    if (!job) return;
    const prev = job.status;
    setJob({ ...job, status });
    setStatusOpen(false);
    try {
      const form: JobFormData = {
        jobTitle: job.jobTitle, companyName: job.companyName,
        jobDescription: job.jobDescription ?? '', jobLocation: job.jobLocation,
        employmentType: job.employmentType,
        salaryMin: job.salaryRange?.min?.toString() ?? '',
        salaryMax: job.salaryRange?.max?.toString() ?? '',
        currency: job.salaryRange?.currency ?? 'INR',
        skillsRequired: job.skillsRequired, jobUrl: job.jobUrl ?? '',
        platformSource: job.platformSource, recruiterEmail: job.recruiterEmail ?? '',
        applicationDate: job.applicationDate.split('T')[0] ?? '',
        status, notes: job.notes ?? '',
      };
      const updated = await updateJob(job._id, form);
      setJob(updated);
    } catch {
      setJob((j) => j ? { ...j, status: prev } : j);
    }
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="w-10 h-10 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-400 animate-spin-auth" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#030712] text-slate-400">
        <svg className="w-12 h-12 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{error || 'Application not found'}</p>
        <Link to="/tracker" className="text-indigo-400 hover:underline text-sm">← Back to tracker</Link>
      </div>
    );
  }

  const style = STATUS_STYLES[job.status];
  const salary = formatSalary(job);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% -15%, rgba(99,102,241,0.1) 0%, transparent 60%), #030712',
      }}
    >
      {/* Orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-1 opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', top: '-80px', left: '-80px' }} />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 flex items-center gap-3 px-6 py-3.5"
        style={{
          background: 'rgba(3,7,18,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Link to="/tracker" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Job Tracker
        </Link>
        <span className="text-slate-600 text-sm">/</span>
        <span className="text-slate-300 text-sm font-medium truncate max-w-[240px]">{job.jobTitle}</span>
      </nav>

      {/* Content */}
      <main className="max-w-[900px] mx-auto px-6 py-8 space-y-5">
        {/* ── Hero header ──────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(13,17,23,0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Title + company */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight leading-tight">
                {job.jobTitle}
              </h1>
              <p className="text-base text-slate-400 mt-1 font-medium">{job.companyName}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-slate-300 border border-white/[0.1] hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  View Job
                </a>
              )}
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-slate-300 border border-white/[0.1] hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-red-400 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Meta pills row */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Pill
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
              label={job.jobLocation}
            />
            <Pill
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" /></svg>}
              label={job.employmentType}
            />
            <Pill
              icon={<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
              label={formatDate(job.applicationDate)}
            />
            {job.platformSource && (
              <Pill
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16A8 8 0 0010 2zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" /></svg>}
                label={job.platformSource}
              />
            )}
            {salary && (
              <Pill
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" /></svg>}
                label={salary}
              />
            )}
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/[0.06]">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <div className="relative">
              <button
                onClick={() => setStatusOpen((v) => !v)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer ${style.bg} ${style.text}`}
              >
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                {job.status}
                <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {statusOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                  <div
                    className="absolute top-full left-0 mt-2 z-20 rounded-xl overflow-hidden shadow-2xl"
                    style={{ background: 'rgba(12,16,26,0.98)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '200px' }}
                  >
                    {STATUSES.map((s) => {
                      const st = STATUS_STYLES[s];
                      return (
                        <button
                          key={s}
                          onClick={() => void handleStatusChange(s)}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-white/[0.05] transition-colors ${s === job.status ? 'bg-white/[0.04]' : ''}`}
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                          <span className={st.text}>{s}</span>
                          {s === job.status && (
                            <svg className="w-3.5 h-3.5 ml-auto text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <span className="text-xs text-slate-600 ml-auto">
              Last updated: {formatDate(job.updatedAt)}
            </span>
          </div>
        </div>

        {/* ── Two-column grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — wider column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Job Description */}
            {job.jobDescription && (
              <Section title="Job Description">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{job.jobDescription}</p>
              </Section>
            )}

            {/* Notes */}
            {job.notes ? (
              <Section title="Notes & Interview Feedback">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{job.notes}</p>
              </Section>
            ) : (
              <div
                className="rounded-2xl p-5 border border-dashed border-white/[0.07] flex flex-col items-center justify-center gap-2 text-center py-8 cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all group"
                onClick={() => setEditOpen(true)}
              >
                <svg className="w-8 h-8 text-slate-600 group-hover:text-indigo-500/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">Add notes or interview feedback</p>
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="space-y-5">

            {/* Skills */}
            {job.skillsRequired.length > 0 && (
              <Section title="Skills Required">
                <div className="flex flex-wrap gap-1.5">
                  {job.skillsRequired.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg text-[0.75rem] font-medium text-slate-200 bg-white/[0.06] border border-white/[0.08]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Contact */}
            {job.recruiterEmail && (
              <Section title="Recruiter Contact">
                <a
                  href={`mailto:${job.recruiterEmail}`}
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors break-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {job.recruiterEmail}
                </a>
              </Section>
            )}

            {/* Timeline */}
            <Section title="Timeline">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-200 font-medium">Application Date</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(job.applicationDate)}</p>
                  </div>
                </div>
                <div className="ml-1 w-px h-4 bg-white/[0.07]" />
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${STATUS_STYLES[job.status].dot}`} />
                  <div>
                    <p className={`text-sm font-medium ${STATUS_STYLES[job.status].text}`}>{job.status}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Last updated {formatDate(job.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Meta */}
            <Section title="Details">
              <dl className="space-y-2.5">
                {[
                  { label: 'Platform', value: job.platformSource },
                  { label: 'Type', value: job.employmentType },
                  { label: 'Added', value: formatDate(job.createdAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-xs text-slate-300 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          </div>
        </div>
      </main>

      {/* Modals */}
      <JobFormModal
        open={editOpen}
        job={job}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
      <DeleteConfirmModal
        job={deleteOpen ? job : null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </div>
  );
}
