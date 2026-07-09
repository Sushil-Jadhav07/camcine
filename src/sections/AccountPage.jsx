import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  History,
  Bookmark,
  Settings,
  Camera,
  LogOut,
  Check,
} from 'lucide-react';
import { useAuthStore, useWatchlistStore } from '@/store';

function DivSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = option => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="w-full px-4 py-3.5 glass-input rounded-xl text-white flex items-center justify-between cursor-pointer"
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(value => !value);
          }
          if (event.key === 'Escape') setOpen(false);
        }}
      >
        <span>{value}</span>
        <div className={`w-2 h-2 border-r-2 border-b-2 border-white/60 transition-transform ${open ? 'rotate-[225deg] mt-1' : 'rotate-45 -mt-1'}`} />
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 p-1.5 rounded-xl border border-white/10 bg-[#101010] shadow-2xl" role="listbox">
          {options.map(option => (
            <div
              key={option}
              className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors ${option === value ? 'bg-[var(--accent)]/20 text-[var(--accent)] font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
              role="option"
              tabIndex={0}
              aria-selected={option === value}
              onClick={() => select(option)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  select(option);
                }
                if (event.key === 'Escape') setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const { continueWatching, watchlist, fetchContinueWatching, fetchWatchlist, removeFromWatchlist } = useWatchlistStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [subtitleLanguage, setSubtitleLanguage] = useState('English');

  // Profile form state — initialized from the current user
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone_number || '');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchContinueWatching(user.id);
      fetchWatchlist(user.id);
    }
  }, [user?.id, fetchContinueWatching, fetchWatchlist]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    if (!firstName.trim() || !lastName.trim()) {
      setProfileError('First name and last name are required.');
      return;
    }
    setProfileSaving(true);
    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err?.message || 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'watchlist', label: 'My List', icon: Bookmark },
    { id: 'history', label: 'Watch History', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="glass-card p-6 sticky top-24 rounded-2xl">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-[var(--accent)]/30 mx-auto shadow-lg shadow-[var(--accent)]/10">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-hover)]/20">
                        <User className="w-10 h-10 text-[var(--accent)]" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white hover:shadow-lg hover:shadow-[var(--accent)]/30 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2
                  className="text-lg font-bold text-white mt-4"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {user?.name || 'User'}
                </h2>
                <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  Member since{' '}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-hover)]/10 text-[var(--accent)] border-l-3 border-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-8 rounded-2xl">
                <h3
                  className="text-xl font-bold text-white mb-6"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Profile
                </h3>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-3.5 glass-input rounded-xl text-white/50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                  {profileError && (
                    <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3">
                      <p className="text-sm text-red-300">{profileError}</p>
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                      <p className="text-sm text-emerald-300">Profile updated successfully!</p>
                    </div>
                  )}
                  <button type="submit" className="btn-accent" disabled={profileSaving}>
                    {profileSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-2xl">
                  <h3
                    className="text-xl font-bold text-white mb-5"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Current Plan
                  </h3>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white text-sm font-semibold rounded-full">
                      {user?.subscription?.charAt(0).toUpperCase()}
                      {user?.subscription?.slice(1)} Plan
                    </span>
                    <button className="text-[var(--accent)] text-sm hover:underline">
                      Upgrade Plan
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        Billing Date
                      </span>
                      <span className="text-white">15th of every month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        Next Renewal
                      </span>
                      <span className="text-white">15 May 2026</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                  <h3
                    className="text-lg font-bold text-white mb-4"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Screen Usage
                  </h3>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      2 of 4 screens used
                    </span>
                    <span className="text-white">50%</span>
                  </div>
                  <div className="h-2.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full" />
                  </div>
                </div>

                <div className="glass-card p-8 rounded-2xl">
                  <button className="btn-ghost w-full justify-center mb-3">
                    Manage Billing
                  </button>
                  <button className="text-red-400 text-sm hover:underline">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                    My List
                  </h3>
                </div>
                {watchlist.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {watchlist.map((item) => (
                      <div key={item.id} className="glass rounded-xl overflow-hidden border border-white/10">
                        <img src={item.poster || item.thumbnail} alt={item.title} className="aspect-[2/3] w-full object-cover" />
                        <div className="p-3">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeFromWatchlist(user.id, item.id)}
                            className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-white/70 transition hover:border-[var(--accent)]/50 hover:text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] text-center py-12">Your list is empty</p>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Watch History
                  </h3>
                  <button className="text-sm text-[var(--text-secondary)] hover:text-white">
                    Clear History
                  </button>
                </div>

                {continueWatching.length > 0 ? (
                  <div className="space-y-4">
                    {continueWatching.slice(0, 5).map((item) => (
                      <div
                        key={`${item.content.id}-${item.episodeId || 'main'}`}
                        className="flex items-center gap-4 p-4 glass rounded-xl hover-lift"
                      >
                        <img
                          src={item.content.poster}
                          alt={item.content.title}
                          className="w-14 h-18 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm truncate">
                            {item.content.title}
                          </h4>
                          <div className="mt-2 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                        <button className="btn-accent text-sm py-2 px-4">
                          Resume
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] text-center py-12">
                    No watch history yet
                  </p>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="glass-card p-8 rounded-2xl">
                <h3
                  className="text-xl font-bold text-white mb-6"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Preferences
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                      Preferred Language
                    </label>
                    <DivSelect
                      value={preferredLanguage}
                      onChange={setPreferredLanguage}
                      options={['English', 'Hindi', 'Tamil', 'Telugu']}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                      Subtitle Language
                    </label>
                    <DivSelect
                      value={subtitleLanguage}
                      onChange={setSubtitleLanguage}
                      options={['English', 'Hindi', 'None']}
                    />
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
                    <div>
                      <p className="text-white font-medium">Autoplay</p>
                      <p className="text-[var(--text-muted)] text-sm">
                        Automatically play next episode
                      </p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] relative transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
                    <div>
                      <p className="text-white font-medium">
                        Email Notifications
                      </p>
                      <p className="text-[var(--text-muted)] text-sm">
                        Receive updates about new content
                      </p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[var(--bg-elevated)] relative transition-colors">
                      <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-4 opacity-50">
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-[var(--text-muted)] text-sm">
                        Always on
                      </p>
                    </div>
                    <button
                      className="w-12 h-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] relative cursor-not-allowed"
                      disabled
                    >
                      <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
