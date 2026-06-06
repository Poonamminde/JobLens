import type { JobStats } from '../../types/jobApplication';

const cards = [
  {
    key: 'total' as const,
    label: 'Total Applications',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    key: 'applied' as const,
    label: 'Applied',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    key: 'interviews' as const,
    label: 'Interviews',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
  },
  {
    key: 'offers' as const,
    label: 'Offers Received',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    gradient: 'from-green-500 to-emerald-500',
    glow: 'rgba(34,197,94,0.3)',
  },
  {
    key: 'rejected' as const,
    label: 'Rejections',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-red-500 to-rose-500',
    glow: 'rgba(239,68,68,0.3)',
  },
];

interface Props { stats: JobStats; loading: boolean }

export default function StatsBar({ stats, loading }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map(({ key, label, icon, gradient, glow }) => (
        <div
          key={key}
          className="relative rounded-2xl p-4 overflow-hidden transition-all duration-200 hover:-translate-y-1 group"
          style={{
            background: 'rgba(13,17,23,0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Subtle glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
            style={{ boxShadow: `inset 0 0 30px ${glow}` }}
          />
          <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 text-white mb-3`}
            style={{ background: `linear-gradient(135deg, ${glow.replace('0.3', '0.2')}, transparent)` }}>
            <div className={`bg-gradient-to-br ${gradient} rounded-lg p-1.5 text-white`}>
              {icon}
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
            {loading ? <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" /> : stats[key]}
          </div>
          <div className="text-[0.72rem] text-slate-500 uppercase tracking-wider font-medium mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
