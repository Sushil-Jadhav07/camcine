import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Film, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/services';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg-base)] relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--accent)]/[0.06] blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--accent-hover)]/[0.04] blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative w-full max-w-md">
        <div className="glass-card p-10 rounded-3xl">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] transition-transform group-hover:scale-110">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-2xl text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                Cam<span className="gradient-text">cine</span>
              </span>
            </Link>
            <h1 className="text-[28px] font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Forgot Password</h1>
            <p className="text-[var(--text-muted)] text-sm">Enter your email and we'll send you a reset link</p>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">
                If an account with <span className="text-white">{email}</span> exists, a password reset link has been sent.
              </p>
              <Link to="/login" className="btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-xl">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-4 mb-6 glass-accent rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-[var(--text-secondary)] mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="btn-accent w-full h-13 text-base">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Send Reset Link'}
                </button>
              </form>

              <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
