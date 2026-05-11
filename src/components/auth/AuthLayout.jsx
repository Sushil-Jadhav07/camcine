import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export function AuthLayout({
  badge,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)] px-4 py-8 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(122,16,39,0.18),transparent_28%),linear-gradient(180deg,#050608_0%,#080A0D_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-[32px] border border-white/10 bg-[rgba(8,10,13,0.96)] px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.52)] sm:px-10 sm:py-10">
          <div className="mb-10">
            <Link to="/" className="mb-8 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent-hover))] shadow-[0_0_24px_rgba(122,16,39,0.25)]">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                Cam<span className="gradient-text">cine</span>
              </span>
            </Link>

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-hover)]">
              {badge}
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: 'Sora, sans-serif' }}>
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
              {subtitle}
            </p>
          </div>

          {children}

          {footer ? <div className="mt-8 border-t border-white/10 pt-6">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
