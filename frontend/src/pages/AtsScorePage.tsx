import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analyzeResume } from '../api/atsApi';
import type { AtsReport } from '../types/ats';

function scoreColor(n: number): string {
  if (n >= 75) return '#22c55e';
  if (n >= 50) return '#f59e0b';
  return '#ef4444';
}
function scoreBg(n: number): string {
  if (n >= 75) return 'rgba(34,197,94,0.12)';
  if (n >= 50) return 'rgba(245,158,11,0.12)';
  return 'rgba(239,68,68,0.12)';
}
function scoreLabel(n: number): string {
  if (n >= 80) return 'Excellent';
  if (n >= 65) return 'Good';
  if (n >= 50) return 'Fair';
  return 'Needs Work';
}
function formatBytes(b: number): string {
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function ScoreRing({ score }: { score: number }) {
  const r = 72;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <circle
            cx="90" cy="90" r={r} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold" style={{ color }}>{score}</span>
          <span className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ color, background: scoreBg(score) }}>
        {scoreLabel(score)}
      </span>
    </div>
  );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }}
        />
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-indigo-400">{icon}</span>
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AtsScorePage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [report, setReport] = useState<AtsReport | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const acceptFile = useCallback((f: File) => {
    const ok = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(f.type);
    if (!ok) { setError('Only PDF and DOCX files are accepted.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setFile(f);
    setError('');
    setReport(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  }, [acceptFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) acceptFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload your resume first.'); return; }
    if (jd.trim().length < 50) { setError('Job description must be at least 50 characters.'); return; }
    setError('');
    setLoading(true);
    setReport(null);

    const steps = [
      'Parsing resume text…',
      'Reading job description…',
      'Matching keywords with AI…',
      'Scoring skills alignment…',
      'Generating insights…',
    ];
    let i = 0;
    setProgress(steps[0] ?? '');
    const ticker = setInterval(() => {
      i = (i + 1) % steps.length;
      setProgress(steps[i] ?? '');
    }, 1800);

    try {
      const result = await analyzeResume(file, jd);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      clearInterval(ticker);
      setLoading(false);
      setProgress('');
    }
  };

  const copyToClipboard = async () => {
    if (!report?.optimizedSummary) return;
    await navigator.clipboard.writeText(report.optimizedSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 40% at 50% -20%, rgba(99,102,241,0.1) 0%, transparent 60%), #030712' }}>
      {/* Orbs */}
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-1 opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', top: '-80px', left: '-80px' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-[80px] animate-orb-2 opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)', bottom: '-60px', right: '-60px' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex items-center gap-3 px-6 py-3.5"
        style={{ background: 'rgba(3,7,18,0.85)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 shrink-0">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#gats)" strokeWidth="2.5" />
              <path d="M13 20 L18 25 L27 15" stroke="url(#gats)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs><linearGradient id="gats" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" /></linearGradient></defs>
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight brand-gradient-text">JobLens</span>
        </Link>
        <span className="text-slate-600 text-sm">/</span>
        <span className="text-slate-300 text-sm font-medium">ATS Score</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
            {initials}
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-6 py-8 relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-3"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Powered by Gemini AI
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">ATS Resume Score</h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Upload your resume and paste a job description. Gemini AI will analyze compatibility, surface keyword gaps, and generate an optimized summary.
          </p>
        </div>

        {/* Input area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Resume upload */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Upload Resume
            </h2>

            {file ? (
              /* File selected state */
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                </div>
                <button onClick={() => { setFile(null); setReport(null); }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              /* Drop zone */
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  border: `2px dashed ${dragging ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  background: dragging ? 'rgba(99,102,241,0.05)' : 'transparent',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-300">Drop your resume here</p>
                  <p className="text-xs text-slate-500 mt-0.5">PDF or DOCX · max 5 MB</p>
                </div>
                <span className="text-xs text-indigo-400 font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  Browse Files
                </span>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileChange} />
          </div>

          {/* Job Description */}
          <div className="rounded-2xl p-5 flex flex-col" style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Job Description
              </h2>
              <span className="text-[0.68rem] text-slate-600">{jd.length} chars</span>
            </div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for the best analysis…"
              className="flex-1 min-h-[220px] w-full text-sm text-slate-200 placeholder-slate-600 bg-transparent outline-none resize-none leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Analyze button */}
        <div className="flex justify-center">
          <button
            onClick={() => void handleAnalyze()}
            disabled={loading || !file || jd.trim().length < 50}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 8px 30px rgba(99,102,241,0.35)' }}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-btn" />
                <span>{progress || 'Analyzing…'}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Analyze with AI
              </>
            )}
          </button>
        </div>

        {/* ── Results ────────────────────────────────────────────────────────── */}
        {report && (
          <div className="space-y-5 animate-card-in">
            {/* Score + breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Ring */}
              <div className="rounded-2xl p-6 flex flex-col items-center gap-5"
                style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">ATS Compatibility Score</h2>
                <ScoreRing score={report.atsScore} />
                <p className="text-xs text-slate-500 text-center max-w-xs leading-relaxed">
                  {report.atsScore >= 75
                    ? 'Your resume is highly compatible with this job posting.'
                    : report.atsScore >= 50
                      ? 'Your resume needs some improvements to pass ATS filters.'
                      : 'Significant gaps detected. Review the suggestions below.'}
                </p>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl p-6 space-y-4"
                style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Score Breakdown</h2>
                <BreakdownBar label="Keyword Match"          value={report.scoreBreakdown.keywordMatch} />
                <BreakdownBar label="Skills Alignment"       value={report.scoreBreakdown.skillsAlignment} />
                <BreakdownBar label="Experience Relevance"   value={report.scoreBreakdown.experienceRelevance} />
                <BreakdownBar label="Format & Readability"   value={report.scoreBreakdown.formatReadability} />
              </div>
            </div>

            {/* Keywords row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Matched */}
              <Section
                title={`Matched Keywords (${report.matchedKeywords.length})`}
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  {report.matchedKeywords.length > 0 ? report.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium text-green-300 bg-green-500/10 border border-green-500/20">{kw}</span>
                  )) : <p className="text-xs text-slate-500">No strong keyword matches found.</p>}
                </div>
              </Section>

              {/* Missing */}
              <Section
                title={`Missing Keywords (${report.missingKeywords.length})`}
                icon={
                  <svg className="w-4 h-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                }
              >
                <div className="flex flex-wrap gap-1.5">
                  {report.missingKeywords.length > 0 ? report.missingKeywords.map((kw) => (
                    <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20">{kw}</span>
                  )) : <p className="text-xs text-slate-500">No critical keywords missing. Great job!</p>}
                </div>
              </Section>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Section
                title="Resume Strengths"
                icon={<svg className="w-4 h-4 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              >
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section
                title="Areas to Improve"
                icon={<svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
              >
                <ul className="space-y-2">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </span>
                      {w}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Suggestions */}
            <Section
              title="Actionable Suggestions"
              icon={<svg className="w-4 h-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}
            >
              <ol className="space-y-3">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[0.7rem] font-bold text-indigo-300 shrink-0 mt-0.5"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </Section>

            {/* Optimised summary */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(13,17,23,0.85)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 30px rgba(99,102,241,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-sm font-semibold text-slate-200">AI-Optimized Resume Summary</h2>
                  <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full text-indigo-300"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    ATS-Friendly · Ready to paste
                  </span>
                </div>
                <button
                  onClick={() => void copyToClipboard()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-slate-400 border border-white/[0.1] hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/5'}`}
                >
                  {copied ? (
                    <><svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Copied!</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>Copy</>
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {report.optimizedSummary}
              </p>
            </div>

            {/* Re-analyze button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => { setReport(null); setFile(null); setJd(''); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-slate-400 border border-white/[0.1] hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
