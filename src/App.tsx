import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <Header />
      <div className="pt-16 md:pt-20">
        <main className=" pb-8 md:pb-12">
          {children}
        </main>
      </div>
      <Footer />
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
        <ScrollToTop />
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
