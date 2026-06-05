import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const features = [
    {
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'Job Tracker',
      description: 'Organize and monitor all your applications in one place.',
    },
    {
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'ATS Resume Score',
      description: 'Get AI-powered resume analysis and beat ATS filters.',
    },
    {
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: 'AI Interview Practice',
      description: 'Practice with role-specific AI interview questions.',
    },
    {
      icon: (
        <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Resume Manager',
      description: 'Store and manage multiple resume versions.',
    },
  ];

  const stats = [
    { value: '0',  label: 'Applications' },
    { value: '—',  label: 'ATS Score' },
    { value: '0',  label: 'Interviews' },
    { value: '0',  label: 'Resumes' },
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 40% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%), #030712',
      }}
    >
      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[80px] animate-orb-1 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)', top: '-120px', left: '-100px' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-2 opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)', bottom: '-100px', right: '-80px' }} />

      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(3,7,18,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 shrink-0 logo-glow">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#g3)" strokeWidth="2.5" />
              <path d="M13 20 L18 25 L27 15" stroke="url(#g3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g3" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[1.15rem] font-bold tracking-tight brand-gradient-text">JobLens</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white tracking-wider shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            {initials}
          </div>

          {/* Logout */}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[0.85rem] text-slate-400 cursor-pointer transition-all duration-200 hover:text-slate-100"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-[1100px] mx-auto px-6 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-[2.75rem] font-extrabold tracking-tight text-slate-100 mb-3">
            Welcome back,{' '}
            <span className="gradient-text">{user?.name ?? 'there'}</span>{' '}
            👋
          </h1>
          <p className="text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            Your AI-powered job search command center. Everything you need to land your dream job.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              style={{
                background: 'rgba(13,17,23,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="block text-3xl font-extrabold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </span>
              <span className="block text-[0.72rem] text-slate-500 mt-1 uppercase tracking-widest font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 items-start rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] group"
              style={{
                background: 'rgba(13,17,23,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              {/* Icon box */}
              <div
                className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center text-indigo-400"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.15))',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-[0.95rem] font-semibold text-slate-100">{title}</h3>
                  <span
                    className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap text-indigo-400"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.2))',
                      border: '1px solid rgba(99,102,241,0.25)',
                    }}
                  >
                    Coming Soon
                  </span>
                </div>
                <p className="text-[0.82rem] text-slate-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
