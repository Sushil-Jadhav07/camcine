import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Film,
  Clapperboard,
  Radio,
  Music,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const discoverLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/browse', label: 'Browse', icon: Compass },
    { path: '/browse?type=movie', label: 'Movies', icon: Film },
    { path: '/browse?type=series', label: 'TV Series', icon: Clapperboard },
    { path: '/live-news', label: 'Live News', icon: Radio },
    { path: '/songs', label: 'Songs', icon: Music },
  ];

  const accountLinks = [
    { path: '/account', label: 'My Account', icon: UserCircle },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help & Support', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-72 glass-sidebar z-50 transform transition-all duration-300 lg:translate-x-0 lg:static lg:h-screen overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 lg:hidden border-b border-[var(--border-subtle)]">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <span className="font-bold text-lg text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                Cam<span className="bg-gradient-to-r from-[var(--accent)] to-[#FF6B4A] bg-clip-text text-transparent">cine</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 py-6 px-4">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 px-4 font-semibold">
                Discover
              </p>
              <nav className="space-y-1">
                {discoverLinks.map((link, idx) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`sidebar-item ${isActive(link.path) ? 'active' : ''}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <link.icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 px-4 font-semibold">
                Account
              </p>
              <nav className="space-y-1">
                {accountLinks.map((link, idx) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`sidebar-item ${isActive(link.path) ? 'active' : ''}`}
                    style={{ animationDelay: `${(discoverLinks.length + idx) * 50}ms` }}
                  >
                    <link.icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)]">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 p-3 rounded-xl glass hover-lift">
                <div className="relative">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl object-cover border-2 border-[var(--accent)]/30" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[#FF6B4A]/20 flex items-center justify-center border-2 border-[var(--accent)]/30">
                      <UserCircle className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email || ''}</p>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="btn-accent w-full justify-center"
                  onClick={onClose}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-ghost w-full justify-center"
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}