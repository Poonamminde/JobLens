import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: 'Weak',   color: '#f87171' };
  if (s <= 3) return { score: s, label: 'Fair',   color: '#fb923c' };
  if (s === 4) return { score: s, label: 'Good',  color: '#facc15' };
  return           { score: s, label: 'Strong', color: '#4ade80' };
}

function EyeOpen() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  );
}

const inputBase =
  'w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 border bg-white/[0.04]';
const inputNormal = 'border-white/[0.08] focus:border-indigo-400 focus:bg-white/[0.08] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]';
const inputError  = 'border-red-500/70 bg-white/[0.06] shadow-[0_0_0_3px_rgba(248,113,113,0.12)]';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwValue, setPwValue] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const strength = getStrength(pwValue);

  const onSubmit = async (data: RegisterForm) => {
    setServerError('');
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const Field = ({
    id, label, type, show, setShow, icon, placeholder, autoComplete, reg, err, onChange,
  }: {
    id: string; label: string; type: string; show?: boolean; setShow?: () => void;
    icon: React.ReactNode; placeholder: string; autoComplete: string;
    reg: ReturnType<typeof register>; err?: string; onChange?: (v: string) => void;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.82rem] font-medium text-slate-400 tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">{icon}</span>
        <input
          id={id}
          type={show !== undefined ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`${inputBase} ${err ? inputError : inputNormal}`}
          {...reg}
          onChange={(e) => {
            void reg.onChange(e);
            onChange?.(e.target.value);
          }}
        />
        {setShow && (
          <button
            type="button"
            onClick={setShow}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors flex items-center"
            aria-label="Toggle visibility"
          >
            {show ? <EyeOpen /> : <EyeOff />}
          </button>
        )}
      </div>
      {err && <p className="text-[0.78rem] text-red-400 mt-0.5">{err}</p>}
    </div>
  );

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 110%, rgba(167,139,250,0.15) 0%, transparent 55%), #030712',
      }}
    >
      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[80px] animate-orb-1"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)', top: '-120px', left: '-100px' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none blur-[80px] animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)', bottom: '-100px', right: '-80px' }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-[460px] rounded-[28px] px-8 py-10 animate-card-in"
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
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#g2)" strokeWidth="2.5" />
              <path d="M13 20 L18 25 L27 15" stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" /><stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight brand-gradient-text">JobLens</span>
        </div>

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[1.6rem] font-bold tracking-tight text-slate-100 mb-1">Create your account</h1>
          <p className="text-sm text-slate-400">Start your AI-powered job search today</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-shake">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {serverError}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field
            id="reg-name" label="Full name" type="text"
            placeholder="Jane Doe" autoComplete="name"
            icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
            reg={register('name')} err={errors.name?.message}
          />
          <Field
            id="reg-email" label="Email address" type="email"
            placeholder="you@example.com" autoComplete="email"
            icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>}
            reg={register('email')} err={errors.email?.message}
          />

          {/* Password with strength meter */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-[0.82rem] font-medium text-slate-400 tracking-wide">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                id="reg-password" type={showPw ? 'text' : 'password'}
                placeholder="Min. 6 characters" autoComplete="new-password"
                className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
                {...register('password', { onChange: (e) => setPwValue(e.target.value) })}
              />
              <button type="button" onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors flex items-center">
                {showPw ? <EyeOpen /> : <EyeOff />}
              </button>
            </div>
            {errors.password && <p className="text-[0.78rem] text-red-400 mt-0.5">{errors.password.message}</p>}

            {/* Strength meter */}
            {pwValue && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full strength-bar"
                      style={{ backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)' }}
                    />
                  ))}
                </div>
                <span className="text-[0.75rem] font-semibold min-w-[44px] text-right" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <Field
            id="reg-confirm" label="Confirm password" type="password"
            show={showConfirm} setShow={() => setShowConfirm((v) => !v)}
            placeholder="Repeat your password" autoComplete="new-password"
            icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            reg={register('confirmPassword')} err={errors.confirmPassword?.message}
          />

          {/* Submit */}
          <button
            id="register-submit" type="submit" disabled={isSubmitting}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[0.95rem] font-semibold tracking-wide cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 hover:-translate-y-px active:translate-y-0 transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}
          >
            {isSubmitting ? (
              <><span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin-btn" />Creating account…</>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 font-semibold hover:text-violet-400 hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
