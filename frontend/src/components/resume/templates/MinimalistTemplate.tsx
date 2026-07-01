import type { ResumeFormData } from '../../../types/resume';
import { ResumeIcons } from '../ResumeIcons';

interface Props { formData: ResumeFormData }

export function MinimalistTemplate({ formData }: Props) {
  const p = formData.personalDetails;
  const summary = formData.professionalSummary.trim() || 'Your professional summary will appear here.';

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', fontFamily: "'Inter', sans-serif", color: '#1e293b', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1.5px solid #f1f5f9' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 6 }}>
          {p.fullName || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
          {p.email     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.mail('w-3 h-3 text-slate-400')}{p.email}</span>}
          {p.phone     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.phone('w-3 h-3 text-slate-400')}{p.phone}</span>}
          {p.linkedin  && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.linkedin('w-3 h-3 text-slate-400')}{p.linkedin}</span>}
          {p.github    && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.github('w-3 h-3 text-slate-400')}{p.github}</span>}
          {p.portfolio && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.globe('w-3 h-3 text-slate-400')}{p.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontSize: 11, lineHeight: 1.8, color: '#475569', marginBottom: 22 }}>{summary}</p>

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {formData.skills.map((skill) => (
              <span key={skill} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontSize: 10, fontWeight: 500, padding: '3px 11px', borderRadius: 99 }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>Experience</h2>
        {formData.experience.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: idx < formData.experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.role || 'Role'}</p>
              {(item.startDate || item.endDate) && (
                <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8, marginTop: 2 }}>
                  {item.startDate || '—'} – {item.endDate || 'Present'}
                </span>
              )}
            </div>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>{item.company || 'Company'}</p>
            {item.description && <p style={{ fontSize: 10.5, lineHeight: 1.7, color: '#64748b' }}>{item.description}</p>}
          </div>
        ))}
      </div>

      {/* Education + Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
        <div>
          <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>Education</h2>
          {formData.education.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{item.degree || 'Degree'}</p>
              <p style={{ fontSize: 10, color: '#64748b' }}>{item.institution || 'Institution'}</p>
              {item.year && <p style={{ fontSize: 9, color: '#94a3b8' }}>{item.year}</p>}
            </div>
          ))}
        </div>
        {formData.projects.some((pr) => pr.name) && (
          <div>
            <h2 style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>Projects</h2>
            {formData.projects.map((item, idx) => item.name ? (
              <div key={idx} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{item.name}</p>
                {item.techStack && <p style={{ fontSize: 9, color: '#64748b' }}>{item.techStack}</p>}
              </div>
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
}
