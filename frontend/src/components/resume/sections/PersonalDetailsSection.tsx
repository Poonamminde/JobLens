import type { PersonalDetails } from '../../../types/resume';

interface Props {
  data:   PersonalDetails;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

const INPUT = 'rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-indigo-400';

const FIELDS: Array<{ key: keyof PersonalDetails; placeholder: string }> = [
  { key: 'fullName',  placeholder: 'Full name'  },
  { key: 'email',     placeholder: 'Email'      },
  { key: 'phone',     placeholder: 'Phone'      },
  { key: 'linkedin',  placeholder: 'LinkedIn'   },
  { key: 'github',    placeholder: 'GitHub'     },
  { key: 'portfolio', placeholder: 'Portfolio'  },
];

export function PersonalDetailsSection({ data, onChange }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Personal details</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {FIELDS.map(({ key, placeholder }) => (
          <input
            key={key}
            className={INPUT}
            placeholder={placeholder}
            value={data[key]}
            onChange={(e) => onChange(key, e.target.value)}
          />
        ))}
      </div>
    </section>
  );
}
