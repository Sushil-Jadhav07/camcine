import { Film } from 'lucide-react';

export function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex min-h-screen items-start justify-center overflow-hidden bg-[var(--bg-base)]/68 px-4 pb-24 pt-[18vh] backdrop-blur-md md:pt-[16vh]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.15)_0%,rgba(6,8,10,0.72)_48%,rgba(6,8,10,0.2)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              boxShadow: '0 0 24px rgba(232,68,44,0.45)',
            }}
          >
            <Film className="h-4.5 w-4.5 text-white" />
          </div>
          <span
            className="text-2xl font-black text-[var(--accent)]"
            style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.04em' }}
          >
            Camcine
          </span>
        </div>
        <h1
          className="text-5xl font-black uppercase italic leading-[0.86] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Coming Soon
        </h1>
        <div className="my-7 h-px w-36 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <p className="max-w-md text-center text-xs font-black uppercase leading-relaxed tracking-[0.24em] text-white/45 md:text-sm">
          We're preparing this section for Camcine. Stay tuned.
        </p>
      </div>
    </div>
  );
}
