import type { ResumeTemplate } from '../../../types/resume';
import type { TemplateOption } from '../resumeConstants';

interface Props {
  options:          TemplateOption[];
  selectedTemplate: ResumeTemplate;
  onSelect:         (template: ResumeTemplate) => void;
}

const PALETTE: Record<string, { thumb: string; badge: string; badgeText: string }> = {
  'minimalist':         { thumb: 'linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%)', badge: 'bg-slate-200 text-slate-600',    badgeText: 'Clean'    },
  'professional-split': { thumb: 'linear-gradient(90deg,#1e1b4b 40%,#f8fafc 40%)',  badge: 'bg-indigo-900/60 text-indigo-300', badgeText: 'Split'    },
  'modern-accent':      { thumb: 'linear-gradient(120deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%)', badge: 'bg-violet-900/60 text-violet-300', badgeText: 'Gradient' },
  'timeline':           { thumb: 'linear-gradient(180deg,#fffbeb 0%,#fff 100%)',    badge: 'bg-amber-900/40 text-amber-300',   badgeText: 'Story'    },
};

export function TemplateSelectorSection({ options, selectedTemplate, onSelect }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">Template selection</h2>
        <span className="text-sm text-slate-400">{options.length} layouts available</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isActive = selectedTemplate === option.value;
          const palette  = PALETTE[option.value] ?? PALETTE['minimalist'];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`group overflow-hidden rounded-2xl border p-0 text-left transition-all ${isActive ? 'border-indigo-400 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30' : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'}`}
            >
              {/* Mini thumbnail */}
              <div style={{ background: palette.thumb, height: 52, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 8, display: 'flex', flexDirection: 'column', gap: 4, opacity: 0.5 }}>
                  <div style={{ height: 3, width: '55%', background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
                  <div style={{ height: 2, width: '40%', background: 'rgba(0,0,0,0.10)', borderRadius: 2 }} />
                  <div style={{ height: 2, width: '70%', background: 'rgba(0,0,0,0.08)', borderRadius: 2 }} />
                  <div style={{ height: 2, width: '60%', background: 'rgba(0,0,0,0.06)', borderRadius: 2 }} />
                </div>
                {isActive && (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                  </div>
                )}
              </div>
              {/* Card body */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-100">{option.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${palette.badge}`}>{palette.badgeText}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
