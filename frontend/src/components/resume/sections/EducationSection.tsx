import type { EducationItem } from '../../../types/resume';

interface Props {
  items:    EducationItem[];
  onChange: (index: number, field: string, value: string) => void;
  onAdd:    () => void;
  onRemove: (index: number) => void;
}

const INPUT = 'rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm';

export function EducationSection({ items, onChange, onAdd, onRemove }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Education</h2>
        <button type="button" onClick={onAdd} className="text-sm text-indigo-300">+ Add</button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-200">Entry #{index + 1}</p>
              {items.length > 1 && (
                <button type="button" onClick={() => onRemove(index)} className="text-sm text-rose-400">Remove</button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input className={INPUT} placeholder="Institution" value={item.institution} onChange={(e) => onChange(index, 'institution', e.target.value)} />
              <input className={INPUT} placeholder="Degree"      value={item.degree}      onChange={(e) => onChange(index, 'degree',      e.target.value)} />
              <input className={INPUT} placeholder="Year"        value={item.year}        onChange={(e) => onChange(index, 'year',        e.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
