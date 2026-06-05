import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 110%, rgba(167,139,250,0.15) 0%, transparent 55%), #030712',
      }}
    >
      {/* Animated orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[80px] animate-orb-1"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)',
          top: '-120px',
          left: '-100px',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-2"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)',
          bottom: '-100px',
          right: '-80px',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-[80px] animate-orb-3"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[440px] rounded-[28px] px-8 py-10 animate-card-in"
        style={{
          background: 'rgba(13,17,23,0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.07)',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <div className="w-9 h-9 shrink-0 logo-glow">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="url(#g1)" strokeWidth="2.5" />
              <path d="M13 20 L18 25 L27 15" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight brand-gradient-text">JobLens</span>
        </div>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[1.6rem] font-bold tracking-tight text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to continue your job journey</p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-shake">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-[0.82rem] font-medium text-slate-400 tracking-wide">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-[inherit] text-slate-100 placeholder-slate-600 outline-none transition-all duration-200
                  ${errors.email
                    ? 'border border-red-500/70 bg-white/[0.06] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
                    : 'border border-white/[0.08] bg-white/[0.04] focus:border-indigo-400 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                  }`}
              />
            </div>
            {errors.email && <p className="text-[0.78rem] text-red-400 mt-0.5">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-[0.82rem] font-medium text-slate-400 tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register('password')}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-[inherit] text-slate-100 placeholder-slate-600 outline-none transition-all duration-200
                  ${errors.password
                    ? 'border border-red-500/70 bg-white/[0.06] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
                    : 'border border-white/[0.08] bg-white/[0.04] focus:border-indigo-400 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors flex items-center"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-[0.78rem] text-red-400 mt-0.5">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[0.95rem] font-semibold tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
            }}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-btn" />
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-violet-400 hover:underline transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
