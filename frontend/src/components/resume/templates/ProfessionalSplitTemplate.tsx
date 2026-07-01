import type { ResumeFormData } from '../../../types/resume';
import { ResumeIcons } from '../ResumeIcons';

interface Props { formData: ResumeFormData }

const ACCENT_BAR = { width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg,#6366f1,#a78bfa)' };

export function ProfessionalSplitTemplate({ formData }: Props) {
  const p = formData.personalDetails;
  const summary = formData.professionalSummary.trim() || 'Your professional summary will appear here.';

  return (
    <div className="flex overflow-hidden rounded-2xl bg-white text-slate-800 shadow-xl" style={{ minHeight: 640, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{ width: '38%', background: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 60%,#1e293b 100%)', padding: '28px 20px' }} className="flex flex-col text-slate-100">
        {/* Avatar */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, marginBottom: 16, flexShrink: 0, boxShadow: '0 4px 20px rgba(129,140,248,0.4)' }}>
          {(p.fullName || 'Y')[0].toUpperCase()}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 4 }}>{p.fullName || 'Your Name'}</h1>
        <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a5b4fc', marginBottom: 20 }}>Professional</p>

        {/* Contact */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 600, marginBottom: 10 }}>Contact</p>
          {p.email     && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 10, color: '#cbd5e1' }}>{ResumeIcons.mail('w-3 h-3 text-indigo-400 shrink-0')}<span style={{ wordBreak: 'break-all' }}>{p.email}</span></div>}
          {p.phone     && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 10, color: '#cbd5e1' }}>{ResumeIcons.phone('w-3 h-3 text-indigo-400 shrink-0')}<span>{p.phone}</span></div>}
          {p.linkedin  && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 10, color: '#cbd5e1' }}>{ResumeIcons.linkedin('w-3 h-3 text-indigo-400 shrink-0')}<span style={{ wordBreak: 'break-all' }}>{p.linkedin}</span></div>}
          {p.github    && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 10, color: '#cbd5e1' }}>{ResumeIcons.github('w-3 h-3 text-indigo-400 shrink-0')}<span style={{ wordBreak: 'break-all' }}>{p.github}</span></div>}
          {p.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#cbd5e1' }}>{ResumeIcons.globe('w-3 h-3 text-indigo-400 shrink-0')}<span style={{ wordBreak: 'break-all' }}>{p.portfolio}</span></div>}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 600, marginBottom: 10 }}>Skills</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {formData.skills.length
              ? formData.skills.map((skill) => (
                  <span key={skill} style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 99, padding: '2px 10px', fontSize: 9, color: '#c7d2fe' }}>{skill}</span>
                ))
              : <p style={{ fontSize: 10, color: '#6b7280' }}>Add skills above.</p>}
          </div>
        </div>

        {/* Education */}
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#818cf8', fontWeight: 600, marginBottom: 10 }}>Education</p>
          {formData.education.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#e2e8f0' }}>{item.degree || 'Degree'}</p>
              <p style={{ fontSize: 9, color: '#94a3b8' }}>{item.institution || 'Institution'}</p>
              {item.year && <p style={{ fontSize: 9, color: '#6b7280' }}>{item.year}</p>}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>
        {/* Summary */}
        <section style={{ marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={ACCENT_BAR} />
            <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#6366f1' }}>Professional Summary</h2>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.75, color: '#475569' }}>{summary}</p>
        </section>

        {/* Experience */}
        <section style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={ACCENT_BAR} />
            <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#6366f1' }}>Experience</h2>
          </div>
          {formData.experience.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '2px solid #e0e7ff', position: 'relative' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', position: 'absolute', left: -4.5, top: 3 }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{item.role || 'Role'}</p>
              <p style={{ fontSize: 10, color: '#6366f1', fontWeight: 500, marginBottom: 2 }}>{item.company || 'Company'}</p>
              {(item.startDate || item.endDate) && <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4 }}>{item.startDate || '—'} → {item.endDate || 'Present'}</p>}
              {item.description && <p style={{ fontSize: 10, lineHeight: 1.65, color: '#64748b' }}>{item.description}</p>}
            </div>
          ))}
        </section>

        {/* Projects */}
        {formData.projects.some((pr) => pr.name) && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={ACCENT_BAR} />
              <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#6366f1' }}>Projects</h2>
            </div>
            {formData.projects.map((item, idx) => item.name ? (
              <div key={idx} style={{ marginBottom: 12, background: '#f8fafc', borderRadius: 10, padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.name}</p>
                  {item.link && <a href={item.link} style={{ fontSize: 9, color: '#6366f1', textDecoration: 'none' }}>↗ View</a>}
                </div>
                {item.techStack  && <p style={{ fontSize: 9, color: '#818cf8', fontWeight: 500, marginTop: 2 }}>{item.techStack}</p>}
                {item.description && <p style={{ fontSize: 10, lineHeight: 1.6, color: '#64748b', marginTop: 4 }}>{item.description}</p>}
              </div>
            ) : null)}
          </section>
        )}
      </main>
    </div>
  );
}
