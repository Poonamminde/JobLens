import { Link } from 'react-router-dom';
import type { JobApplication, ApplicationStatus } from '../../types/jobApplication';
import { STATUS_STYLES, STATUSES } from '../../types/jobApplication';

interface Props {
  job: JobApplication;
  onEdit: (j: JobApplication) => void;
  onDelete: (j: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function JobCard({ job, onEdit, onDelete, onStatusChange }: Props) {
  const style = STATUS_STYLES[job.status];

  return (
    <div
      className="group relative flex flex-col gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        background: 'rgba(13,17,23,0.85)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top row: company + status + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/tracker/${job._id}`}
            className="text-base font-semibold text-slate-100 truncate leading-tight hover:text-indigo-300 transition-colors block"
          >
            {job.jobTitle}
          </Link>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{job.companyName}</p>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Job URL"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(job)}
            title="Edit"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(job)}
            title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {job.jobLocation}
        </span>
        <span>·</span>
        <span>{job.employmentType}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          {formatDate(job.applicationDate)}
        </span>
        {job.platformSource && (
          <>
            <span>·</span>
            <span>{job.platformSource}</span>
          </>
        )}
      </div>

      {/* Skills chips */}
      {job.skillsRequired.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skillsRequired.slice(0, 6).map((sk) => (
            <span
              key={sk}
              className="px-2 py-0.5 rounded-md text-[0.7rem] font-medium text-slate-300 bg-white/[0.06] border border-white/[0.08]"
            >
              {sk}
            </span>
          ))}
          {job.skillsRequired.length > 6 && (
            <span className="px-2 py-0.5 rounded-md text-[0.7rem] text-slate-500 bg-white/[0.04]">
              +{job.skillsRequired.length - 6}
            </span>
          )}
        </div>
      )}

      {/* Notes preview */}
      {job.notes && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic border-t border-white/[0.06] pt-3">
          {job.notes}
        </p>
      )}

      {/* Footer: salary + status dropdown */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-1">
        {/* Salary */}
        <span className="text-xs text-slate-400">
          {job.salaryRange?.min || job.salaryRange?.max
            ? `${job.salaryRange.currency} ${job.salaryRange.min ? job.salaryRange.min.toLocaleString() : '?'} – ${job.salaryRange.max ? job.salaryRange.max.toLocaleString() : '?'}`
            : <span className="text-slate-600">Salary not specified</span>
          }
        </span>

        {/* Status badge + quick change */}
        <div className="relative group/status">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold cursor-pointer select-none ${style.bg} ${style.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {job.status}
          </span>
          {/* Dropdown on hover */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover/status:flex flex-col z-20 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(15,20,30,0.97)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '180px' }}>
            {STATUSES.map((s) => {
              const st = STATUS_STYLES[s];
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(job._id, s)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/[0.06] transition-colors ${s === job.status ? 'bg-white/[0.04]' : ''}`}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                  <span className={st.text}>{s}</span>
                  {s === job.status && <svg className="w-3 h-3 ml-auto text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
