import puppeteer from 'puppeteer';
import type { IResume } from '../models/Resume.js';

type ResumeDocument = IResume & { _id?: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Wraps the template body in a full HTML document. Uses system fonts that mirror Inter. */
function htmlDoc(head: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    ${head}
  </style>
</head>
<body>${body}</body>
</html>`;
}

// ─── MINIMALIST ───────────────────────────────────────────────────────────────

function renderMinimalist(r: ResumeDocument): string {
  const p = r.personalDetails ?? {};
  const summary = r.professionalSummary?.trim() || 'Your professional summary will appear here.';
  const skills = (r.skills ?? []).filter(Boolean);
  const exp = r.experience ?? [];
  const edu = r.education ?? [];
  const proj = r.projects ?? [];

  const contactRow = [
    p.email ? `<span>${esc(p.email)}</span>` : '',
    p.phone ? `<span>${esc(p.phone)}</span>` : '',
    p.linkedin ? `<span>${esc(p.linkedin)}</span>` : '',
    p.github ? `<span>${esc(p.github)}</span>` : '',
    p.portfolio ? `<span>${esc(p.portfolio)}</span>` : '',
  ].filter(Boolean).join('<span class="sep">•</span>');

  const skillsHtml = skills.length
    ? skills.map((s) => `<span class="pill">${esc(s)}</span>`).join('')
    : '';

  const expHtml = exp.map((item, idx) => `
    <div class="exp-entry ${idx < exp.length - 1 ? 'border-b' : ''}">
      <div class="exp-row">
        <span class="role">${esc(item.role || 'Role')}</span>
        ${(item.startDate || item.endDate) ? `<span class="date">${esc(item.startDate || '—')} – ${esc(item.endDate || 'Present')}</span>` : ''}
      </div>
      <p class="company">${esc(item.company || 'Company')}</p>
      ${item.description ? `<p class="desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const eduHtml = edu.map((item) => `
    <div class="edu-entry">
      <p class="role">${esc(item.degree || 'Degree')}</p>
      <p class="company">${esc(item.institution || 'Institution')}</p>
      ${item.year ? `<p class="date">${esc(item.year)}</p>` : ''}
    </div>`).join('');

  const projHtml = proj.filter((pr) => pr.name).map((item) => `
    <div class="edu-entry">
      <p class="role">${esc(item.name)}</p>
      ${item.techStack ? `<p class="date">${esc(item.techStack)}</p>` : ''}
    </div>`).join('');

  const css = `
    body { background:#fff; color:#1e293b; padding: 32px 28px; }
    .header { padding-bottom: 20px; border-bottom: 1.5px solid #f1f5f9; margin-bottom: 20px; }
    h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; color: #0f172a; margin-bottom: 8px; }
    .contacts { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 10px; color: #64748b; }
    .sep { color: #cbd5e1; }
    .summary { font-size: 11px; line-height: 1.8; color: #475569; margin-bottom: 22px; }
    .section-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 10px; }
    .pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
    .pill { background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; font-size: 10px; font-weight: 500; padding: 3px 11px; border-radius: 99px; }
    .exp-section { margin-bottom: 22px; }
    .exp-entry { padding-bottom: 16px; margin-bottom: 16px; }
    .border-b { border-bottom: 1px solid #f1f5f9; }
    .exp-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
    .role { font-size: 13px; font-weight: 700; color: #0f172a; }
    .date { font-size: 9px; color: #94a3b8; white-space: nowrap; margin-left: 8px; }
    .company { font-size: 10px; color: #64748b; font-weight: 500; margin-bottom: 6px; }
    .desc { font-size: 10.5px; line-height: 1.7; color: #64748b; }
    .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
    .edu-entry { margin-bottom: 10px; }
  `;

  const body = `
    <div class="header">
      <h1>${esc(p.fullName || 'Your Name')}</h1>
      <div class="contacts">${contactRow}</div>
    </div>
    <p class="summary">${esc(summary)}</p>
    ${skills.length ? `<p class="section-title">Skills</p><div class="pills">${skillsHtml}</div>` : ''}
    <p class="section-title">Experience</p>
    <div class="exp-section">${expHtml}</div>
    <div class="bottom-grid">
      <div>
        <p class="section-title">Education</p>
        ${eduHtml}
      </div>
      ${proj.some((pr) => pr.name) ? `
      <div>
        <p class="section-title">Projects</p>
        ${projHtml}
      </div>` : ''}
    </div>
  `;

  return htmlDoc(css, body);
}

// ─── PROFESSIONAL SPLIT ───────────────────────────────────────────────────────

function renderProfessionalSplit(r: ResumeDocument): string {
  const p = r.personalDetails ?? {};
  const summary = r.professionalSummary?.trim() || 'Your professional summary will appear here.';
  const skills = (r.skills ?? []).filter(Boolean);
  const exp = r.experience ?? [];
  const edu = r.education ?? [];
  const proj = r.projects ?? [];

  const initial = (p.fullName || 'Y')[0].toUpperCase();

  const expHtml = exp.map((item) => `
    <div class="exp-entry">
      <p class="exp-role">${esc(item.role || 'Role')}</p>
      <p class="exp-company">${esc(item.company || 'Company')}</p>
      ${(item.startDate || item.endDate) ? `<p class="exp-date">${esc(item.startDate || '—')} → ${esc(item.endDate || 'Present')}</p>` : ''}
      ${item.description ? `<p class="exp-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const projHtml = proj.filter((pr) => pr.name).map((item) => `
    <div class="proj-card">
      <div class="proj-row">
        <p class="proj-name">${esc(item.name)}</p>
        ${item.link ? `<a href="${esc(item.link)}" class="proj-link">↗ View</a>` : ''}
      </div>
      ${item.techStack ? `<p class="proj-tech">${esc(item.techStack)}</p>` : ''}
      ${item.description ? `<p class="proj-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const css = `
    body { margin: 0; padding: 0; background: #fff; font-family: 'Inter', system-ui, sans-serif; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 38%; background: linear-gradient(160deg,#1e1b4b 0%,#312e81 60%,#1e293b 100%); padding: 28px 20px; color: #f1f5f9; }
    .main { flex: 1; padding: 28px 24px; }
    .avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg,#818cf8,#a78bfa); display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 14px; box-shadow: 0 4px 20px rgba(129,140,248,0.4); }
    .sb-name { font-size: 17px; font-weight: 700; margin-bottom: 3px; }
    .sb-title { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #a5b4fc; margin-bottom: 20px; }
    .sb-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #818cf8; font-weight: 600; margin-bottom: 8px; }
    .sb-contact p { font-size: 10px; color: #cbd5e1; margin-bottom: 5px; }
    .sb-skills { margin-top: 16px; }
    .sb-pill { display: inline-block; background: rgba(129,140,248,0.15); border: 1px solid rgba(129,140,248,0.3); border-radius: 99px; padding: 2px 10px; font-size: 9px; color: #c7d2fe; margin: 2px 3px 2px 0; }
    .sb-edu { margin-top: 16px; }
    .sb-edu-degree { font-size: 10px; font-weight: 600; color: #e2e8f0; }
    .sb-edu-inst { font-size: 9px; color: #94a3b8; }
    .sb-edu-year { font-size: 9px; color: #6b7280; }
    .accent-bar { width: 3px; height: 14px; border-radius: 2px; background: linear-gradient(180deg,#6366f1,#a78bfa); display: inline-block; vertical-align: middle; margin-right: 8px; }
    .section-header { display: flex; align-items: center; margin-bottom: 10px; }
    .section-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: #6366f1; }
    .summary-section { margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid #f1f5f9; }
    .summary-text { font-size: 11px; line-height: 1.75; color: #475569; }
    .exp-section { margin-bottom: 22px; }
    .exp-entry { margin-bottom: 14px; padding-left: 12px; border-left: 2px solid #e0e7ff; position: relative; }
    .exp-dot { position: absolute; left: -4.5px; top: 3px; width: 7px; height: 7px; border-radius: 50%; background: #6366f1; }
    .exp-role { font-size: 12px; font-weight: 700; color: #1e293b; }
    .exp-company { font-size: 10px; color: #6366f1; font-weight: 500; margin-bottom: 2px; }
    .exp-date { font-size: 9px; color: #94a3b8; margin-bottom: 4px; }
    .exp-desc { font-size: 10px; line-height: 1.65; color: #64748b; }
    .proj-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; }
    .proj-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .proj-name { font-size: 11px; font-weight: 700; color: #1e293b; }
    .proj-link { font-size: 9px; color: #6366f1; text-decoration: none; }
    .proj-tech { font-size: 9px; color: #818cf8; font-weight: 500; margin-top: 2px; }
    .proj-desc { font-size: 10px; line-height: 1.6; color: #64748b; margin-top: 4px; }
  `;

  const body = `
    <div class="layout">
      <div class="sidebar">
        <div class="avatar">${esc(initial)}</div>
        <p class="sb-name">${esc(p.fullName || 'Your Name')}</p>
        <p class="sb-title">Professional</p>
        <p class="sb-label">Contact</p>
        <div class="sb-contact">
          ${p.email ? `<p>${esc(p.email)}</p>` : ''}
          ${p.phone ? `<p>${esc(p.phone)}</p>` : ''}
          ${p.linkedin ? `<p>${esc(p.linkedin)}</p>` : ''}
          ${p.github ? `<p>${esc(p.github)}</p>` : ''}
          ${p.portfolio ? `<p>${esc(p.portfolio)}</p>` : ''}
        </div>
        ${skills.length ? `
        <div class="sb-skills">
          <p class="sb-label">Skills</p>
          ${skills.map((s) => `<span class="sb-pill">${esc(s)}</span>`).join('')}
        </div>` : ''}
        <div class="sb-edu">
          <p class="sb-label">Education</p>
          ${edu.map((item) => `
            <div style="margin-bottom:10px">
              <p class="sb-edu-degree">${esc(item.degree || 'Degree')}</p>
              <p class="sb-edu-inst">${esc(item.institution || 'Institution')}</p>
              ${item.year ? `<p class="sb-edu-year">${esc(item.year)}</p>` : ''}
            </div>`).join('')}
        </div>
      </div>
      <div class="main">
        <div class="summary-section">
          <div class="section-header"><span class="accent-bar"></span><span class="section-title">Professional Summary</span></div>
          <p class="summary-text">${esc(summary)}</p>
        </div>
        <div class="exp-section">
          <div class="section-header"><span class="accent-bar"></span><span class="section-title">Experience</span></div>
          ${expHtml}
        </div>
        ${proj.some((pr) => pr.name) ? `
        <div>
          <div class="section-header"><span class="accent-bar"></span><span class="section-title">Projects</span></div>
          ${projHtml}
        </div>` : ''}
      </div>
    </div>
  `;

  return htmlDoc(css, body);
}

// ─── MODERN ACCENT ────────────────────────────────────────────────────────────

function renderModernAccent(r: ResumeDocument): string {
  const p = r.personalDetails ?? {};
  const summary = r.professionalSummary?.trim() || 'Your professional summary will appear here.';
  const skills = (r.skills ?? []).filter(Boolean);
  const exp = r.experience ?? [];
  const edu = r.education ?? [];
  const proj = r.projects ?? [];

  const contactItems = [
    p.email, p.phone, p.linkedin, p.github, p.portfolio,
  ].filter(Boolean);

  const expHtml = exp.map((item, idx) => `
    <div class="exp-entry ${idx < exp.length - 1 ? 'border-b' : ''}">
      <div class="exp-row">
        <p class="exp-role">${esc(item.role || 'Role')}</p>
        ${(item.startDate || item.endDate) ? `<span class="exp-date">${esc(item.startDate || '—')} – ${esc(item.endDate || 'Present')}</span>` : ''}
      </div>
      <p class="exp-company">${esc(item.company || 'Company')}</p>
      ${item.description ? `<p class="exp-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const eduHtml = edu.map((item) => `
    <div class="edu-card">
      <p class="edu-degree">${esc(item.degree || 'Degree')}</p>
      <p class="edu-inst">${esc(item.institution || 'Institution')}</p>
      ${item.year ? `<p class="edu-year">${esc(item.year)}</p>` : ''}
    </div>`).join('');

  const projHtml = proj.filter((pr) => pr.name).map((item) => `
    <div class="proj-card">
      <p class="proj-name">${esc(item.name)}</p>
      ${item.techStack ? `<p class="proj-tech">${esc(item.techStack)}</p>` : ''}
      ${item.description ? `<p class="proj-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const css = `
    body { margin: 0; padding: 0; background: #f8fafc; font-family: 'Inter', system-ui, sans-serif; }
    .hero { background: linear-gradient(120deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%); padding: 28px; color: #fff; position: relative; overflow: hidden; }
    .hero h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
    .hero-contacts { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 10px; color: rgba(255,255,255,0.85); }
    .skills-bar { background: #fff; padding: 10px 24px; border-bottom: 1px solid #e2e8f0; display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-pill { background: linear-gradient(135deg,#ede9fe,#dbeafe); color: #4338ca; font-size: 9px; font-weight: 600; padding: 3px 10px; border-radius: 99px; }
    .body-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; }
    .col-left { padding: 20px 20px 20px 24px; border-right: 1px solid #e2e8f0; }
    .col-right { padding: 20px; }
    .icon-badge { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 5px; background: linear-gradient(135deg,#6366f1,#a78bfa); margin-right: 6px; vertical-align: middle; }
    .section-header { display: flex; align-items: center; margin-bottom: 10px; }
    .section-title { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; color: #4f46e5; }
    .summary-text { font-size: 10.5px; line-height: 1.75; color: #475569; }
    .exp-entry { margin-bottom: 14px; padding-bottom: 14px; }
    .border-b { border-bottom: 1px dashed #e2e8f0; }
    .exp-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .exp-role { font-size: 12px; font-weight: 700; color: #1e293b; }
    .exp-date { font-size: 9px; color: #94a3b8; white-space: nowrap; margin-left: 8px; }
    .exp-company { font-size: 10px; color: #6366f1; font-weight: 600; margin-bottom: 4px; }
    .exp-desc { font-size: 10px; line-height: 1.65; color: #64748b; }
    .edu-card { background: linear-gradient(135deg,#f0f9ff,#ede9fe); border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
    .edu-degree { font-size: 11px; font-weight: 700; color: #1e293b; }
    .edu-inst { font-size: 10px; color: #0284c7; font-weight: 500; }
    .edu-year { font-size: 9px; color: #94a3b8; margin-top: 2px; }
    .edu-header .section-title { color: #0284c7; }
    .proj-card { border: 1px solid #d1fae5; background: #f0fdf4; border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
    .proj-name { font-size: 11px; font-weight: 700; color: #1e293b; }
    .proj-tech { font-size: 9px; color: #059669; font-weight: 500; }
    .proj-desc { font-size: 10px; line-height: 1.6; color: #64748b; margin-top: 4px; }
    .proj-header .section-title { color: #059669; }
  `;

  const body = `
    <div class="hero">
      <h1>${esc(p.fullName || 'Your Name')}</h1>
      <div class="hero-contacts">
        ${contactItems.map((c) => `<span>${esc(c!)}</span>`).join('')}
      </div>
    </div>
    ${skills.length ? `<div class="skills-bar">${skills.map((s) => `<span class="skill-pill">${esc(s)}</span>`).join('')}</div>` : ''}
    <div class="body-grid">
      <div class="col-left">
        <div style="margin-bottom:20px">
          <div class="section-header"><span class="section-title">Summary</span></div>
          <p class="summary-text">${esc(summary)}</p>
        </div>
        <div class="section-header"><span class="section-title">Experience</span></div>
        ${expHtml}
      </div>
      <div class="col-right">
        <div class="edu-header">
          <div class="section-header"><span class="section-title" style="color:#0284c7">Education</span></div>
          ${eduHtml}
        </div>
        ${proj.some((pr) => pr.name) ? `
        <div class="proj-header">
          <div class="section-header"><span class="section-title" style="color:#059669">Projects</span></div>
          ${projHtml}
        </div>` : ''}
      </div>
    </div>
  `;

  return htmlDoc(css, body);
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────

function renderTimeline(r: ResumeDocument): string {
  const p = r.personalDetails ?? {};
  const summary = r.professionalSummary?.trim() || 'Your professional summary will appear here.';
  const skills = (r.skills ?? []).filter(Boolean);
  const exp = r.experience ?? [];
  const edu = r.education ?? [];
  const proj = r.projects ?? [];

  const expHtml = exp.map((item) => `
    <div class="tl-entry">
      <div class="tl-dot"></div>
      <p class="tl-role">${esc(item.role || 'Role')}</p>
      <p class="tl-company">${esc(item.company || 'Company')}</p>
      ${(item.startDate || item.endDate) ? `<p class="tl-date">${esc(item.startDate || '—')} → ${esc(item.endDate || 'Present')}</p>` : ''}
      ${item.description ? `<p class="tl-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const eduHtml = edu.map((item) => `
    <div class="edu-entry">
      <p class="edu-degree">${esc(item.degree || 'Degree')}</p>
      <p class="edu-inst">${esc(item.institution || 'Institution')}</p>
      ${item.year ? `<p class="edu-year">${esc(item.year)}</p>` : ''}
    </div>`).join('');

  const projHtml = proj.filter((pr) => pr.name).map((item) => `
    <div class="proj-entry">
      <p class="proj-name">${esc(item.name)}</p>
      ${item.techStack ? `<p class="proj-tech">${esc(item.techStack)}</p>` : ''}
      ${item.description ? `<p class="proj-desc">${esc(item.description)}</p>` : ''}
    </div>`).join('');

  const css = `
    body { margin: 0; padding: 0; background: #fff; font-family: 'Inter', system-ui, sans-serif; }
    .rainbow-bar { height: 5px; background: linear-gradient(90deg,#f59e0b,#ef4444,#8b5cf6,#3b82f6); }
    .header { padding: 24px 28px 20px; border-bottom: 1px solid #f1f5f9; background: linear-gradient(180deg,#fffbeb 0%,#fff 100%); }
    .header h1 { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.02em; margin-bottom: 8px; }
    .contacts { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 10px; color: #64748b; margin-bottom: 12px; }
    .skill-pill { display: inline-block; background: #fef3c7; color: #92400e; font-size: 9px; font-weight: 600; padding: 2px 9px; border-radius: 99px; border: 1px solid #fde68a; margin: 2px 3px 2px 0; }
    .about-band { padding: 14px 28px; background: #fffbeb; border-bottom: 1px solid #fde68a; }
    .about-label { font-size: 10px; color: #78350f; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
    .about-text { font-size: 11px; line-height: 1.75; color: #475569; }
    .body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; padding: 20px 28px; }
    .col-label { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .col-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; }
    .amber-title { color: #d97706; }
    .purple-title { color: #7c3aed; }
    .blue-title { color: #0284c7; }
    .rule { flex: 1; height: 1px; }
    .amber-rule { background: linear-gradient(90deg,#fde68a,transparent); }
    .purple-rule { background: linear-gradient(90deg,#ddd6fe,transparent); }
    .blue-rule { background: linear-gradient(90deg,#bae6fd,transparent); }
    .tl-container { position: relative; padding-left: 20px; }
    .tl-line { position: absolute; left: 6px; top: 4px; bottom: 0; width: 2px; background: linear-gradient(180deg,#f59e0b,#fde68a,transparent); border-radius: 2px; }
    .tl-entry { position: relative; margin-bottom: 16px; }
    .tl-dot { position: absolute; left: -16px; top: 4px; width: 9px; height: 9px; border-radius: 50%; background: #f59e0b; border: 2px solid #fff; box-shadow: 0 0 0 2px #fde68a; }
    .tl-role { font-size: 11px; font-weight: 700; color: #1e293b; }
    .tl-company { font-size: 10px; color: #d97706; font-weight: 600; margin-bottom: 2px; }
    .tl-date { font-size: 9px; color: #94a3b8; margin-bottom: 3px; }
    .tl-desc { font-size: 10px; line-height: 1.6; color: #64748b; }
    .edu-entry { margin-bottom: 12px; padding-left: 12px; border-left: 3px solid #8b5cf6; }
    .edu-degree { font-size: 11px; font-weight: 700; color: #1e293b; }
    .edu-inst { font-size: 10px; color: #7c3aed; font-weight: 500; }
    .edu-year { font-size: 9px; color: #94a3b8; }
    .proj-entry { margin-bottom: 10px; padding-left: 12px; border-left: 3px solid #38bdf8; }
    .proj-name { font-size: 11px; font-weight: 700; color: #1e293b; }
    .proj-tech { font-size: 9px; color: #0284c7; font-weight: 500; }
    .proj-desc { font-size: 10px; line-height: 1.6; color: #64748b; margin-top: 2px; }
    .proj-section-label { margin: 14px 0 10px; }
  `;

  const body = `
    <div class="rainbow-bar"></div>
    <div class="header">
      <h1>${esc(p.fullName || 'Your Name')}</h1>
      <div class="contacts">
        ${[p.email, p.phone, p.linkedin, p.github, p.portfolio].filter(Boolean).map((c) => `<span>${esc(c!)}</span>`).join('')}
      </div>
      ${skills.length ? `<div>${skills.map((s) => `<span class="skill-pill">${esc(s)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="about-band">
      <p class="about-label">About</p>
      <p class="about-text">${esc(summary)}</p>
    </div>
    <div class="body-grid">
      <div>
        <div class="col-label">
          <span class="col-title amber-title">Experience</span>
          <div class="rule amber-rule"></div>
        </div>
        <div class="tl-container">
          <div class="tl-line"></div>
          ${expHtml}
        </div>
      </div>
      <div>
        <div class="col-label">
          <span class="col-title purple-title">Education</span>
          <div class="rule purple-rule"></div>
        </div>
        ${eduHtml}
        ${proj.some((pr) => pr.name) ? `
        <div class="col-label proj-section-label">
          <span class="col-title blue-title">Projects</span>
          <div class="rule blue-rule"></div>
        </div>
        ${projHtml}` : ''}
      </div>
    </div>
  `;

  return htmlDoc(css, body);
}

// ─── Dispatcher + PDF builder ─────────────────────────────────────────────────

export function renderResumeHtml(resume: ResumeDocument): string {
  switch (resume.selectedTemplate) {
    case 'professional-split': return renderProfessionalSplit(resume);
    case 'modern-accent': return renderModernAccent(resume);
    case 'timeline': return renderTimeline(resume);
    case 'minimalist':
    default: return renderMinimalist(resume);
  }
}

export async function buildResumePdf(resume: ResumeDocument): Promise<Buffer> {
  const html = renderResumeHtml(resume);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    return Buffer.from(
      await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      }),
    );
  } finally {
    await browser.close();
  }
}
