import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from '@/store';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

import { HomePage } from '@/sections/HomePage';
import { BrowsePage } from '@/sections/BrowsePage';
import { ContentDetailPage } from '@/sections/ContentDetailPage';
import { PlayerPage } from '@/sections/PlayerPage';
import { SearchPage } from '@/sections/SearchPage';
import { SongsPage } from '@/sections/SongsPage';
import { NewsPage } from '@/sections/NewsPage';
import { PricingPage } from '@/sections/PricingPage';
import { AccountPage } from '@/sections/AccountPage';
import { LoginPage } from '@/sections/LoginPage';
import { RegisterPage } from '@/sections/RegisterPage';

import { Player } from '@/components/player/Player';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Header />
      <div className="flex pt-[60px] lg:pt-20">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 ">
          {children}
        </main>
      </div>
      <Player />
      <Toaster />
    </div>
  );
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/content/:id" element={<ContentDetailPage />} />
                  <Route path="/player/:id" element={<PlayerPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/songs" element={<SongsPage />} />
                  <Route path="/live-news" element={<NewsPage />} />
                  <Route path="/pricing" element={<PricingPage />} />

                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;