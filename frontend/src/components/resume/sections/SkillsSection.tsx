interface Props {
  skills:      string[];
  skillInput:  string;
  onInputChange: (value: string) => void;
  onAdd:       () => void;
  onRemove:    (skill: string) => void;
}

export function SkillsSection({ skills, skillInput, onInputChange, onAdd, onRemove }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Skills</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => onRemove(skill)}
            className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-sm text-slate-200"
          >
            {skill} ×
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          placeholder="Type a skill and press enter"
          value={skillInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add
        </button>
      </div>
    </section>
  );
}
