import type { ExperienceItem } from '../../../types/resume';

interface Props {
  items:    ExperienceItem[];
  onChange: (index: number, field: string, value: string) => void;
  onAdd:    () => void;
  onRemove: (index: number) => void;
}

const DATE_INPUT = 'rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100';
const TEXT_INPUT = 'rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm';

export function ExperienceSection({ items, onChange, onAdd, onRemove }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Experience</h2>
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
              <input className={TEXT_INPUT} placeholder="Company"    value={item.company}   onChange={(e) => onChange(index, 'company',   e.target.value)} />
              <input className={TEXT_INPUT} placeholder="Role"       value={item.role}      onChange={(e) => onChange(index, 'role',      e.target.value)} />
              <input type="date" className={DATE_INPUT}              value={item.startDate} onChange={(e) => onChange(index, 'startDate', e.target.value)} />
              <input type="date" className={DATE_INPUT}              value={item.endDate}   onChange={(e) => onChange(index, 'endDate',   e.target.value)} />
            </div>
            <textarea
              className="mt-3 min-h-[80px] w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm"
              placeholder="Describe your impact"
              value={item.description}
              onChange={(e) => onChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
