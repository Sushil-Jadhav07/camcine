import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Bell, User, Film } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';

export function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { toggleSidebar, searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/browse?type=movie', label: 'Movies' },
    { path: '/browse?type=series', label: 'TV Shows' },
    { path: '/live-news', label: 'Live News' },
    { path: '/songs', label: 'Songs' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[rgba(6,8,10,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:bg-white/5 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[#FF6B4A] transition-transform duration-300 group-hover:scale-110">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl lg:text-2xl text-white transition-all duration-300" style={{ fontFamily: 'Sora, sans-serif' }}>
              Cam<span className="bg-gradient-to-r from-[var(--accent)] to-[#FF6B4A] bg-clip-text text-transparent">cine</span>
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, idx) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link px-4 py-2 rounded-lg ${
                isActive(link.path) ? 'bg-white/5' : ''
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className={`relative transition-all duration-400 ${
            searchOpen ? 'w-56 lg:w-72' : 'w-auto'
          }`}>
            <div className={`glass-input rounded-full flex items-center overflow-hidden transition-all duration-300 ${
              isSearchFocused ? 'ring-2 ring-[var(--accent)]/30' : ''
            }`}>
              <Search className={`w-4 h-4 ml-4 transition-colors duration-300 ${isSearchFocused ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search movies, shows..."
                className="w-full px-4 py-2.5 bg-transparent text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none"
              />
              {searchOpen ? (
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 mr-1 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 mr-1 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <button className="relative p-2.5 text-[var(--text-secondary)] hover:text-white transition-all duration-300 hover:bg-white/5 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-pulse" />
          </button>

          {isAuthenticated ? (
            <Link to="/account" className="flex items-center gap-2 ml-1 group">
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover border-2 border-transparent transition-all duration-300 group-hover:border-[var(--accent)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[#FF6B4A]/20 flex items-center justify-center border-2 border-transparent transition-all duration-300 group-hover:border-[var(--accent)]">
                    <User className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="btn-accent text-sm py-2.5 px-5 ml-1"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}