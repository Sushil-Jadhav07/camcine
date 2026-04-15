import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X, Bell, User, ChevronDown, Film } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';

export function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchVisible = searchOpen && location.pathname !== '/search';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const primaryLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse?type=movie', label: 'Movies' },
    { path: '/browse?type=series', label: 'Series' },
    { path: '/songs', label: 'Songs' },
  ];

  const moreLinks = [
    { path: '/browse', label: 'Genres' },
    { path: '/live-news', label: 'Live News' },
    { path: '/pricing', label: 'Pricing' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      return location.pathname === basePath && location.search.includes(query.split('=')[1]);
    }
    return location.pathname === path;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ height: '64px' }}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isScrolled ? 'rgba(8,10,14,0.52)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(14px) saturate(135%)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(14px) saturate(135%)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      />
      {/* Top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-center justify-between h-full px-4 md:px-6 lg:px-8 gap-3 md:gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div
            className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              boxShadow: '0 0 16px rgba(232,68,44,0.5)',
            }}
          >
            <Film className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </div>
          <span
            className="font-black text-base md:text-2xl text-white"
            style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.04em' }}
          >
            <span style={{ color: 'var(--accent)' }}>Camcine</span>
          </span>
        </Link>

        {/* Nav pill */}
        <nav className="hidden lg:flex items-center">
          <div
            className="flex items-center gap-0.5 px-2 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {primaryLinks.map((link, idx) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
                  style={{
                    color: active ? '#fff' : 'var(--text-secondary)',
                    animationDelay: `${idx * 40}ms`,
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(232,68,44,0.18)',
                        border: '1px solid rgba(232,68,44,0.35)',
                        boxShadow: '0 0 12px rgba(232,68,44,0.12)',
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(v => !v)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{ color: moreOpen ? '#fff' : 'var(--text-secondary)' }}
              >
                More
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {moreOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 min-w-[140px] rounded-xl py-1.5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    background: 'rgba(13,16,20,0.95)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                  }}
                >
                  {moreLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm transition-colors duration-150"
                      style={{ color: isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isActive(link.path) ? 'var(--accent)' : 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Search */}
          <div
            className="relative hidden md:flex items-center rounded-full overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${isSearchFocused ? 'rgba(232,68,44,0.4)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(232,68,44,0.08)' : 'none',
              backdropFilter: 'blur(10px)',
              width: searchOpen ? '240px' : '140px',
              transition: 'width 0.35s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <Search
              className="w-3.5 h-3.5 ml-3.5 shrink-0 transition-colors duration-200"
              style={{ color: isSearchFocused ? 'var(--accent)' : 'var(--text-muted)' }}
            />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => { setIsSearchFocused(true); setSearchOpen(true); }}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search..."
              className="w-full px-3 py-2.5 bg-transparent text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            {searchOpen && searchQuery && (
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-2 mr-1 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Icon Only */}
          <button
            className="md:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-white"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bell */}
          <button
            className="relative p-2 md:p-2.5 rounded-full transition-all duration-200 text-[var(--text-secondary)] hover:text-white hover:bg-white/5"
          >
            <Bell className="w-5 h-5 md:w-[18px] md:h-[18px]" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 6px rgba(232,68,44,0.8)' }}
            />
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button 
                onClick={() => setAccountOpen(v => !v)}
                className="group flex items-center gap-2 p-1 md:pr-2 rounded-full hover:bg-white/5 transition-all"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover transition-all duration-200"
                    style={{ border: '2px solid transparent', boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, rgba(232,68,44,0.25), rgba(255,107,74,0.15))',
                      border: '2px solid transparent',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  </div>
                )}
                <ChevronDown className={`hidden md:block w-4 h-4 text-white/40 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountOpen && (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 min-w-[200px] rounded-2xl py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: 'rgba(13,16,20,0.98)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  }}
                >
                  <div className="px-4 py-3 mb-2 border-b border-white/5">
                    <p className="text-white font-black text-sm truncate uppercase tracking-tight">{user?.name || 'Guest User'}</p>
                    <p className="text-white/40 text-[10px] truncate uppercase font-bold tracking-widest">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    to="/account?tab=watchlist"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Bell className="w-4 h-4" /> Watchlist
                  </Link>
                  <div className="h-px bg-white/5 my-2 mx-4 md:hidden" />
                  {/* Mobile nav links in account dropdown */}
                  <div className="md:hidden">
                    {primaryLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                         {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="h-px bg-white/5 my-2 mx-4" />
                  <button
                    onClick={() => { /* Logout logic */ setAccountOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all text-left"
                  >
                    <X className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 md:px-5 py-2 rounded-full bg-[var(--accent)] text-white text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(232,68,44,0.3)] hover:scale-105 transition-all active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {mobileSearchVisible && (
        <div className="md:hidden absolute top-full left-0 right-0 px-4 pt-2">
          <div className="flex items-center rounded-2xl border border-white/10 bg-[rgba(13,16,20,0.95)] backdrop-blur-xl px-3">
            <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search movies, shows..."
              className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none"
            />
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="p-2 text-[var(--text-muted)]"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
