interface Props {
  value:    string;
  onChange: (value: string) => void;
}

export function SummarySection({ value, onChange }: Props) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Professional summary</h2>
      <textarea
        className="mt-4 min-h-[110px] w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        placeholder="Write a concise summary of your experience and goals"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
}
