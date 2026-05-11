import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '@/store';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/');
    } catch {}
  };

  return (
    <AuthLayout
      badge="Member sign in"
      title="Welcome back"
      subtitle="Pick up where you left off. Your watchlist, access, and preferences are tied to this account."
      footer={
        <p className="text-center text-sm text-[var(--text-secondary)]">
          New to Camcine?{' '}
          <Link to="/register" className="font-semibold text-white transition-colors hover:text-[var(--accent-hover)]">
            Create an account
          </Link>
        </p>
      }
    >
      {error ? (
        <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-white/80">Password</label>
            <Link to="/forgot-password" className="text-sm text-[var(--accent-hover)] transition-colors hover:text-white">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="glass-input h-14 w-full rounded-2xl pl-12 pr-14 text-white placeholder:text-[var(--text-muted)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-white/5 hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[var(--text-secondary)]">
          Use the same email and password you registered with on the Camcine platform.
        </div>

        <button type="submit" disabled={isLoading} className="btn-accent h-14 w-full rounded-2xl text-base font-semibold">
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
