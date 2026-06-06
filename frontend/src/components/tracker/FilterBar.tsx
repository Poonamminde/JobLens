import { useState } from 'react';
import type { JobFilters } from '../../api/jobApi';
import { STATUSES, PLATFORMS } from '../../types/jobApplication';

interface Props {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
}

const inputCls =
  'bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] h-10 px-3';

const selectCls = `${inputCls} cursor-pointer appearance-none pr-8`;

export default function FilterBar({ filters, onChange }: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search ?? '');

  const set = (key: keyof JobFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined });

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search title, company, skills…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && set('search', localSearch)}
          onBlur={() => set('search', localSearch)}
          className={`${inputCls} pl-9 w-full`}
        />
        {localSearch && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            onClick={() => { setLocalSearch(''); set('search', ''); }}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={filters.status ?? ''}
          onChange={(e) => set('status', e.target.value)}
          className={selectCls}
          style={{ minWidth: '160px' }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {/* Platform filter */}
      <div className="relative">
        <select
          value={filters.platform ?? ''}
          onChange={(e) => set('platform', e.target.value)}
          className={selectCls}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={filters.sort ?? 'date_desc'}
          onChange={(e) => set('sort', e.target.value)}
          className={selectCls}
          style={{ minWidth: '165px' }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {/* Clear filters */}
      {(filters.search || filters.status || filters.platform) && (
        <button
          onClick={() => { setLocalSearch(''); onChange({ sort: filters.sort }); }}
          className="flex items-center gap-1.5 px-3 h-10 rounded-xl text-sm text-slate-400 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 bg-white/[0.03] transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
