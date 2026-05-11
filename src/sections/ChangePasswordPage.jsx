import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Film, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services';

export function ChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const [resetToken, setResetToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Invalid or expired token. Please request a new reset link.');
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
            <h1 className="text-[28px] font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Set New Password</h1>
            <p className="text-[var(--text-muted)] text-sm">Enter your reset token and choose a new password</p>
          </div>

          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Password Updated!</h2>
              <p className="text-[var(--text-muted)] text-sm mb-6">Your password has been changed successfully.</p>
              <Link to="/login" className="btn-accent inline-flex items-center gap-2 px-6 py-3 rounded-xl">
                Sign In with New Password
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
                {!searchParams.get('token') && (
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-2 block">Reset Token</label>
                    <input
                      type="text"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Paste token from your email"
                      className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-[var(--text-secondary)] mb-2 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                      required
                      minLength={8}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[var(--text-secondary)] mb-2 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                      required
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>

                <button type="submit" disabled={isLoading || newPassword !== confirmPassword} className="btn-accent w-full h-13 text-base">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Change Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
