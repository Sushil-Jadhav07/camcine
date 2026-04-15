import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, History, Settings, Camera, LogOut, Check } from 'lucide-react';
import { useAuthStore, useWatchlistStore } from '@/store';
import { ContentCard } from '@/components/cards/ContentCard';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuthStore();
  const { watchlist, continueWatching } = useWatchlistStore();
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'history', label: 'Watch History', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

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
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
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
                <h2 className="text-lg font-bold text-white mt-4" style={{ fontFamily: 'Sora, sans-serif' }}>{user?.name || 'User'}</h2>
                <p className="text-[var(--text-muted)] text-sm">{user?.email}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === item.id ? 'bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-hover)]/10 text-[var(--accent)] border-l-3 border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'}`}>
                    <item.icon className="w-5 h-5" />{item.label}
                  </button>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-5 h-5" />Sign Out
                </button>
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Profile</h3>
                <div className="space-y-5">
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Full Name</label><input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-3.5 glass-input rounded-xl text-white" /></div>
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Email</label><input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3.5 glass-input rounded-xl text-white" /></div>
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Phone</label><input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)]" /></div>
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Bio</label><textarea rows={3} placeholder="Tell us about yourself..." className="w-full px-4 py-3.5 glass-input rounded-xl text-white placeholder:text-[var(--text-muted)] resize-none" /></div>
                  <button className="btn-accent"><Check className="w-4 h-4" />Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="glass-card p-8 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>Current Plan</h3>
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] text-white text-sm font-semibold rounded-full">{user?.subscription?.charAt(0).toUpperCase()}{user?.subscription?.slice(1)} Plan</span>
                    <button className="text-[var(--accent)] text-sm hover:underline">Upgrade Plan</button>
                  </div>
                  <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-[var(--text-muted)]">Billing Date</span><span className="text-white">15th of every month</span></div><div className="flex justify-between"><span className="text-[var(--text-muted)]">Next Renewal</span><span className="text-white">15 May 2026</span></div></div>
                </div>
                <div className="glass-card p-8 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>Screen Usage</h3>
                  <div className="mb-2 flex justify-between text-sm"><span className="text-[var(--text-secondary)]">2 of 4 screens used</span><span className="text-white">50%</span></div>
                  <div className="h-2.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden"><div className="h-full w-1/2 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full" /></div>
                </div>
                <div className="glass-card p-8 rounded-2xl"><button className="btn-ghost w-full justify-center mb-3">Manage Billing</button><button className="text-red-400 text-sm hover:underline">Cancel Subscription</button></div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="glass-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Watch History</h3><button className="text-sm text-[var(--text-secondary)] hover:text-white">Clear History</button></div>
                {continueWatching.length > 0 ? (
                  <div className="space-y-4">{continueWatching.slice(0, 5).map((item) => (<div key={item.content.id} className="flex items-center gap-4 p-4 glass rounded-xl hover-lift"><img src={item.content.poster} alt={item.content.title} className="w-14 h-18 rounded-lg object-cover" /><div className="flex-1 min-w-0"><h4 className="text-white font-medium text-sm truncate">{item.content.title}</h4><div className="mt-2 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]" style={{ width: `${item.progress}%` }} /></div></div><button className="btn-accent text-sm py-2 px-4">Resume</button></div>))}</div>
                ) : <p className="text-[var(--text-muted)] text-center py-12">No watch history yet</p>}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>Preferences</h3>
                <div className="space-y-5">
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Preferred Language</label><select className="w-full px-4 py-3.5 glass-input rounded-xl text-white"><option>English</option><option>Hindi</option><option>Tamil</option><option>Telugu</option></select></div>
                  <div><label className="text-sm text-[var(--text-secondary)] mb-2 block">Subtitle Language</label><select className="w-full px-4 py-3.5 glass-input rounded-xl text-white"><option>English</option><option>Hindi</option><option>None</option></select></div>
                  <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]"><div><p className="text-white font-medium">Autoplay</p><p className="text-[var(--text-muted)] text-sm">Automatically play next episode</p></div><button className="w-12 h-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] relative transition-colors"><span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" /></button></div>
                  <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]"><div><p className="text-white font-medium">Email Notifications</p><p className="text-[var(--text-muted)] text-sm">Receive updates about new content</p></div><button className="w-12 h-6 rounded-full bg-[var(--bg-elevated)] relative transition-colors"><span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" /></button></div>
                  <div className="flex items-center justify-between py-4 opacity-50"><div><p className="text-white font-medium">Dark Mode</p><p className="text-[var(--text-muted)] text-sm">Always on</p></div><button className="w-12 h-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] relative cursor-not-allowed" disabled><span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" /></button></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
