import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store';
import { AuthLayout } from '@/components/auth/AuthLayout';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    if (!trimmedFirstName || !trimmedLastName) {
      setFormError('Please enter both first and last name.');
      return;
    }

    if (!agreed) {
      setFormError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    try {
      await register(email.trim(), password, `${trimmedFirstName} ${trimmedLastName}`, {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        phone_number: phoneNumber.trim(),
        age: age.trim(),
      });
      navigate('/');
    } catch {}
  };

  return (
    <AuthLayout
      badge="New account"
      title="Create your account"
      footer={
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-white transition-colors hover:text-[var(--accent-hover)]">
            Sign in
          </Link>
        </p>
      }
    >
      {error || formError ? (
        <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-300">{formError || error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">First name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="John"
                autoComplete="given-name"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Last name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="Doe"
                autoComplete="family-name"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
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
            <label className="text-sm font-medium text-white/80">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Age</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                placeholder="25"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-14 text-white placeholder:text-[var(--text-muted)]"
                required
                minLength={8}
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

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-white/80">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="glass-input h-14 w-full rounded-2xl pl-12 pr-4 text-white placeholder:text-[var(--text-muted)]"
                required
              />
            </div>
            {confirmPassword && password !== confirmPassword ? (
              <p className="text-sm text-red-300">Passwords do not match.</p>
            ) : null}
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--border-default)] bg-transparent text-[var(--accent)] focus:ring-[var(--accent)]/40"
          />
          <span className="text-sm leading-6 text-[var(--text-secondary)]">
            I agree to the{' '}
            <Link to="/terms" className="text-white transition-colors hover:text-[var(--accent-hover)]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-white transition-colors hover:text-[var(--accent-hover)]">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading || !agreed || password !== confirmPassword}
          className="btn-accent h-14 w-full rounded-2xl text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
