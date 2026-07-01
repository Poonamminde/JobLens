import type { ResumeFormData } from '../../../types/resume';
import { ResumeIcons } from '../ResumeIcons';

interface Props { formData: ResumeFormData }

export function TimelineTemplate({ formData }: Props) {
  const p = formData.personalDetails;
  const summary = formData.professionalSummary.trim() || 'Your professional summary will appear here.';

  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
      {/* Rainbow accent bar */}
      <div style={{ height: 5, background: 'linear-gradient(90deg,#f59e0b,#ef4444,#8b5cf6,#3b82f6)' }} />

      {/* Header */}
      <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(180deg,#fffbeb 0%,#fff 100%)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', marginBottom: 4 }}>{p.fullName || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 12 }}>
          {p.email     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.mail('w-3 h-3 text-amber-500')}{p.email}</span>}
          {p.phone     && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.phone('w-3 h-3 text-amber-500')}{p.phone}</span>}
          {p.linkedin  && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.linkedin('w-3 h-3 text-amber-500')}{p.linkedin}</span>}
          {p.github    && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.github('w-3 h-3 text-amber-500')}{p.github}</span>}
          {p.portfolio && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>{ResumeIcons.globe('w-3 h-3 text-amber-500')}{p.portfolio}</span>}
        </div>
        {formData.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {formData.skills.map((skill) => (
              <span key={skill} style={{ background: '#fef3c7', color: '#92400e', fontSize: 9, fontWeight: 600, padding: '2px 9px', borderRadius: 99, border: '1px solid #fde68a' }}>{skill}</span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ padding: '16px 28px', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
        <p style={{ fontSize: 10, color: '#78350f', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>About</p>
        <p style={{ fontSize: 11, lineHeight: 1.75, color: '#475569' }}>{summary}</p>
      </div>

      {/* Two-column body */}
      <div style={{ padding: '20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
        {/* Experience timeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#d97706' }}>Experience</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#fde68a,transparent)' }} />
          </div>
          <div style={{ position: 'relative', paddingLeft: 20 }}>
            {/* Vertical timeline line */}
            <div style={{ position: 'absolute', left: 6, top: 4, bottom: 0, width: 2, background: 'linear-gradient(180deg,#f59e0b,#fde68a,transparent)', borderRadius: 2 }} />
            {formData.experience.map((item, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: 16 }}>
                <div style={{ position: 'absolute', left: -16, top: 4, width: 9, height: 9, borderRadius: '50%', background: '#f59e0b', border: '2px solid #fff', boxShadow: '0 0 0 2px #fde68a' }} />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>{item.role || 'Role'}</p>
                <p style={{ fontSize: 10, color: '#d97706', fontWeight: 600, marginBottom: 2 }}>{item.company || 'Company'}</p>
                {(item.startDate || item.endDate) && <p style={{ fontSize: 9, color: '#94a3b8', marginBottom: 3 }}>{item.startDate || '—'} → {item.endDate || 'Present'}</p>}
                {item.description && <p style={{ fontSize: 10, lineHeight: 1.6, color: '#64748b' }}>{item.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Education + Projects */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#7c3aed' }}>Education</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#ddd6fe,transparent)' }} />
          </div>
          {formData.education.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '3px solid #8b5cf6' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.degree || 'Degree'}</p>
              <p style={{ fontSize: 10, color: '#7c3aed', fontWeight: 500 }}>{item.institution || 'Institution'}</p>
              {item.year && <p style={{ fontSize: 9, color: '#94a3b8' }}>{item.year}</p>}
            </div>
          ))}

          {formData.projects.some((pr) => pr.name) && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 10px' }}>
                <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: '#0284c7' }}>Projects</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,#bae6fd,transparent)' }} />
              </div>
              {formData.projects.map((item, idx) => item.name ? (
                <div key={idx} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '3px solid #38bdf8' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.name}</p>
                  {item.techStack  && <p style={{ fontSize: 9, color: '#0284c7', fontWeight: 500 }}>{item.techStack}</p>}
                  {item.description && <p style={{ fontSize: 10, lineHeight: 1.6, color: '#64748b', marginTop: 2 }}>{item.description}</p>}
                </div>
              ) : null)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
