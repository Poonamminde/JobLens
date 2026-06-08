import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { JobApplication, JobFormData } from '../../types/jobApplication';
import { STATUSES, PLATFORMS, EMPLOYMENT_TYPES } from '../../types/jobApplication';

// Schema: no .optional() — every field is required in the inferred type.
// .default() only serves as a fallback during Zod parsing; react-hook-form
// supplies actual initial values through defaultValues.
const schema = z.object({
  jobTitle:        z.string().min(1, 'Job title is required').max(150),
  companyName:     z.string().min(1, 'Company name is required').max(100),
  jobDescription:  z.string(),
  jobLocation:     z.string().min(1, 'Location is required'),
  employmentType:  z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  salaryMin:       z.string(),
  salaryMax:       z.string(),
  currency:        z.string(),
  skillsRequired:  z.array(z.string()),
  jobUrl:          z.string(),
  platformSource:  z.string().min(1, 'Platform is required'),
  recruiterEmail:  z.union([z.string().email('Invalid email'), z.literal('')]),
  applicationDate: z.string().min(1, 'Application date is required'),
  status:          z.enum(['Saved', 'Applied', 'Interview Scheduled', 'Technical Round', 'HR Round', 'Offer Received', 'Rejected', 'Withdrawn']),
  notes:           z.string(),
});

// Derived from the schema — guaranteed to match what zodResolver produces.
type FormValues = z.infer<typeof schema>;

function today() {
  return new Date().toISOString().split('T')[0] ?? '';
}

interface Props {
  open: boolean;
  job: JobApplication | null;
  onClose: () => void;
  onSave: (data: JobFormData) => Promise<void>;
}

const labelCls = 'block text-[0.78rem] font-medium text-slate-400 mb-1';
const inputCls =
  'w-full px-3 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 border bg-white/[0.04] border-white/[0.08] focus:border-indigo-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]';
const inputErrCls = 'border-red-500/60 shadow-[0_0_0_3px_rgba(248,113,113,0.1)]';
const selectCls = `${inputCls} appearance-none cursor-pointer`;
const errCls = 'text-[0.72rem] text-red-400 mt-1';

export default function JobFormModal({ open, job, onClose, onSave }: Props) {
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        jobTitle: '', companyName: '', jobDescription: '', jobLocation: '',
        employmentType: 'Full-time', salaryMin: '', salaryMax: '', currency: 'INR',
        skillsRequired: [], jobUrl: '', platformSource: 'LinkedIn',
        recruiterEmail: '', applicationDate: today(), status: 'Saved', notes: '',
      },
    });

  const skills = watch('skillsRequired');

  useEffect(() => {
    if (!open) return;
    if (job) {
      reset({
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        jobDescription: job.jobDescription ?? '',
        jobLocation: job.jobLocation,
        employmentType: job.employmentType,
        salaryMin: job.salaryRange?.min?.toString() ?? '',
        salaryMax: job.salaryRange?.max?.toString() ?? '',
        currency: job.salaryRange?.currency ?? 'INR',
        skillsRequired: job.skillsRequired,
        jobUrl: job.jobUrl ?? '',
        platformSource: job.platformSource,
        recruiterEmail: job.recruiterEmail ?? '',
        applicationDate: job.applicationDate.split('T')[0] ?? today(),
        status: job.status,
        notes: job.notes ?? '',
      });
    } else {
      reset({
        jobTitle: '', companyName: '', jobDescription: '', jobLocation: '',
        employmentType: 'Full-time', salaryMin: '', salaryMax: '', currency: 'INR',
        skillsRequired: [], jobUrl: '', platformSource: 'LinkedIn',
        recruiterEmail: '', applicationDate: today(), status: 'Saved', notes: '',
      });
    }
    setServerError('');
    setSkillInput('');
    setTimeout(() => firstRef.current?.focus(), 80);
  }, [open, job, reset]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setValue('skillsRequired', [...skills, s]);
    setSkillInput('');
  };

  const removeSkill = (sk: string) =>
    setValue('skillsRequired', skills.filter((s) => s !== sk));

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    setServerError('');
    try {
      // FormValues and JobFormData are structurally identical — safe cast
      await onSave(data as unknown as JobFormData);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Slide-in panel */}
      <div
        className="relative ml-auto w-full max-w-xl h-full flex flex-col overflow-hidden"
        style={{
          background: 'rgba(10,14,22,0.97)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {job ? 'Edit Application' : 'Add Job Application'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {job ? `Editing ${job.jobTitle} at ${job.companyName}` : 'Track a new job opportunity'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.06] transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {serverError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className={labelCls}>Job Title *</label>
            <input {...register('jobTitle')}
              className={`${inputCls} ${errors.jobTitle ? inputErrCls : ''}`}
              placeholder="e.g. Senior Frontend Developer" />
            {errors.jobTitle && <p className={errCls}>{errors.jobTitle.message}</p>}
          </div>

          {/* Company */}
          <div>
            <label className={labelCls}>Company Name *</label>
            <input {...register('companyName')}
              className={`${inputCls} ${errors.companyName ? inputErrCls : ''}`}
              placeholder="e.g. Google" />
            {errors.companyName && <p className={errCls}>{errors.companyName.message}</p>}
          </div>

          {/* Location + Employment Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Location *</label>
              <input {...register('jobLocation')}
                className={`${inputCls} ${errors.jobLocation ? inputErrCls : ''}`}
                placeholder="e.g. Bangalore" />
              {errors.jobLocation && <p className={errCls}>{errors.jobLocation.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Employment Type</label>
              <div className="relative">
                <select {...register('employmentType')} className={selectCls}>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className={labelCls}>Salary Range</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <select {...register('currency')} className={`${selectCls} pl-2 pr-6`}>
                  {['INR', 'USD', 'EUR', 'GBP', 'AED'].map((c) => <option key={c}>{c}</option>)}
                </select>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </div>
              <input {...register('salaryMin')} type="number" className={inputCls} placeholder="Min" />
              <input {...register('salaryMax')} type="number" className={inputCls} placeholder="Max" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className={labelCls}>Skills Required</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                className={`${inputCls} flex-1`}
                placeholder="Type skill and press Enter"
              />
              <button type="button" onClick={addSkill}
                className="px-3 py-2 rounded-xl text-sm font-medium text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all shrink-0">
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((sk) => (
                  <span key={sk} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-200 bg-white/[0.06] border border-white/[0.08]">
                    {sk}
                    <button type="button" onClick={() => removeSkill(sk)} className="text-slate-500 hover:text-red-400 transition-colors ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Platform + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Platform Source *</label>
              <div className="relative">
                <select {...register('platformSource')} className={`${selectCls} ${errors.platformSource ? inputErrCls : ''}`}>
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <div className="relative">
                <Controller name="status" control={control} render={({ field }) => (
                  <select {...field} className={selectCls}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                )} />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </div>
            </div>
          </div>

          {/* Application Date */}
          <div>
            <label className={labelCls}>Application Date *</label>
            <input {...register('applicationDate')} type="date"
              className={`${inputCls} ${errors.applicationDate ? inputErrCls : ''}`}
              style={{ colorScheme: 'dark' }} />
            {errors.applicationDate && <p className={errCls}>{errors.applicationDate.message}</p>}
          </div>

          {/* Job URL */}
          <div>
            <label className={labelCls}>Job URL</label>
            <input {...register('jobUrl')} type="url"
              className={inputCls} placeholder="https://linkedin.com/jobs/..." />
          </div>

          {/* Recruiter Email */}
          <div>
            <label className={labelCls}>Recruiter Email (Optional)</label>
            <input {...register('recruiterEmail')} type="email"
              className={`${inputCls} ${errors.recruiterEmail ? inputErrCls : ''}`}
              placeholder="recruiter@company.com" />
            {errors.recruiterEmail && <p className={errCls}>{errors.recruiterEmail.message}</p>}
          </div>

          {/* Job Description */}
          <div>
            <label className={labelCls}>Job Description</label>
            <textarea {...register('jobDescription')} rows={4}
              className={`${inputCls} resize-none leading-relaxed`}
              placeholder="Paste the job description here…" />
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes / Interview Feedback</label>
            <textarea {...register('notes')} rows={3}
              className={`${inputCls} resize-none leading-relaxed`}
              placeholder="Interview feedback, follow-up tasks, salary negotiations…" />
          </div>

          {/* Extra bottom padding for footer */}
          <div className="h-4" />
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.07] flex gap-3 shrink-0 bg-[rgba(10,14,22,0.95)]">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all">
            Cancel
          </button>
          <button
            type="submit"
            form="job-form"
            disabled={saving}
            onClick={handleSubmit(onSubmit)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}
          >
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-btn" /> : null}
            {saving ? 'Saving…' : job ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
