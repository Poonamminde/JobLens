import type { ResumeFormData } from '../../../types/resume';
import { ResumeIcons } from '../ResumeIcons';

interface Props { formData: ResumeFormData }

const ICON_BADGE = (gradient: string) => ({
  width: 20, height: 20, borderRadius: 6,
  background: gradient,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
} as const);

export function ModernAccentTemplate({ formData }: Props) {
  const p = formData.personalDetails;
  const summary = formData.professionalSummary.trim() || 'Your professional summary will appear here.';

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f8fafc', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 40px rgba(99,102,241,0.12)' }}>
      {/* ── Gradient hero header ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(120deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%)', padding: '28px 28px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: '45%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>{p.fullName || 'Your Name'}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
            {p.email     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{ResumeIcons.mail('w-3 h-3')}{p.email}</span>}
            {p.phone     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{ResumeIcons.phone('w-3 h-3')}{p.phone}</span>}
            {p.linkedin  && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{ResumeIcons.linkedin('w-3 h-3')}{p.linkedin}</span>}
            {p.github    && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{ResumeIcons.github('w-3 h-3')}{p.github}</span>}
            {p.portfolio && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(255,255,255,0.85)' }}>{ResumeIcons.globe('w-3 h-3')}{p.portfolio}</span>}
          </div>
        </div>
      </div>

      {/* ── Skills pill bar ──────────────────────────────────────────────── */}
      {formData.skills.length > 0 && (
        <div style={{ background: '#fff', padding: '10px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {formData.skills.map((skill) => (
            <span key={skill} style={{ background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', color: '#4338ca', fontSize: 9, fontWeight: 600, padding: '3px 10px', borderRadius: 99 }}>{skill}</span>
          ))}
        </div>
      )}

      {/* ── Body grid ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 0 }}>
        {/* Left column */}
        <div style={{ padding: '20px 20px 20px 24px', borderRight: '1px solid #e2e8f0' }}>
          {/* Summary */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={ICON_BADGE('linear-gradient(135deg,#6366f1,#a78bfa)')}>{ResumeIcons.briefcase('w-2.5 h-2.5 text-white')}</span>
              <h2 style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#4f46e5' }}>Summary</h2>
            </div>
            <p style={{ fontSize: 10.5, lineHeight: 1.75, color: '#475569' }}>{summary}</p>
          </div>

          {/* Experience */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={ICON_BADGE('linear-gradient(135deg,#6366f1,#a78bfa)')}>{ResumeIcons.briefcase('w-2.5 h-2.5 text-white')}</span>
              <h2 style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#4f46e5' }}>Experience</h2>
            </div>
            {formData.experience.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: idx < formData.experience.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{item.role || 'Role'}</p>
                  {(item.startDate || item.endDate) && (
                    <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {item.startDate || '—'} – {item.endDate || 'Present'}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>{item.company || 'Company'}</p>
                {item.description && <p style={{ fontSize: 10, lineHeight: 1.65, color: '#64748b' }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ padding: '20px' }}>
          {/* Education */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={ICON_BADGE('linear-gradient(135deg,#0ea5e9,#6366f1)')}>{ResumeIcons.graduation('w-2.5 h-2.5 text-white')}</span>
              <h2 style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#0284c7' }}>Education</h2>
            </div>
            {formData.education.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 10, background: 'linear-gradient(135deg,#f0f9ff,#ede9fe)', borderRadius: 10, padding: '8px 10px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.degree || 'Degree'}</p>
                <p style={{ fontSize: 10, color: '#0284c7', fontWeight: 500 }}>{item.institution || 'Institution'}</p>
                {item.year && <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{item.year}</p>}
              </div>
            ))}
          </div>

          {/* Projects */}
          {formData.projects.some((pr) => pr.name) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <span style={ICON_BADGE('linear-gradient(135deg,#10b981,#6366f1)')}>{ResumeIcons.code('w-2.5 h-2.5 text-white')}</span>
                <h2 style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#059669' }}>Projects</h2>
              </div>
              {formData.projects.map((item, idx) => item.name ? (
                <div key={idx} style={{ marginBottom: 10, border: '1px solid #d1fae5', background: '#f0fdf4', borderRadius: 10, padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.name}</p>
                  {item.techStack  && <p style={{ fontSize: 9, color: '#059669', fontWeight: 500 }}>{item.techStack}</p>}
                  {item.description && <p style={{ fontSize: 10, lineHeight: 1.6, color: '#64748b', marginTop: 4 }}>{item.description}</p>}
                </div>
              ) : null)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
