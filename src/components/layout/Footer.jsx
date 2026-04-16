import { Link } from 'react-router-dom';
import { Mail, Trash2, Globe, Film } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Authentication',
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Favorites', path: '/favorites' },
        { name: 'Watchlist', path: '/watchlist' },
        { name: 'Rated Film', path: '/rated' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { name: 'Movies', path: '/browse?type=movie' },
        { name: 'TV Shows', path: '/browse?type=series' },
        { name: 'Top Rated Movies', path: '/browse?sort=top_rated' },
        { name: 'Upcoming Movies', path: '/browse?sort=upcoming' },
        { name: 'Popular TV Shows', path: '/browse?sort=popular&type=series' },
      ],
    },
    {
      title: 'Search',
      links: [
        { name: 'Filters', path: '/search' },
        { name: 'Genres', path: '/search' },
        { name: 'Actors', path: '/search' },
        { name: 'Streaming', path: '/search' },
        { name: 'Vote Count', path: '/search' },
      ],
    },
  ];

  return (
    <footer className="bg-[var(--bg-base)] border-t border-white/5 px-4 pt-14 pb-8 md:px-6 md:pt-0 md:pb-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl md:h-16 md:w-16"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              boxShadow: '0 0 20px rgba(232,68,44,0.4)',
            }}
          >
            <Film className="h-7 w-7 text-white md:h-8 md:w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            <span style={{ color: 'var(--accent)' }}>Camcine</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-white md:mb-6 md:text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-[15px] text-white/50 transition-colors hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-white md:mb-6 md:text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
              Get in Touch
            </h3>
            <p className="mb-6 text-[15px] leading-relaxed text-white/50">
              Stay connected with us to discover more stories about new movies and explore more with us
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20">
                <Trash2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-center text-xs text-white/30 md:mt-20 md:flex-row md:pt-8 md:text-left">
          <p>&copy; 2026 Camcine. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
