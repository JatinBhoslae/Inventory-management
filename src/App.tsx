import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { supabase } from '@/db/supabase';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import routes from './routes';

const AppContent = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <RequireAuth whiteList={['/login', '/']}>
      <div className="flex flex-col min-h-screen">
        {showHeader && <Header />}
        <main className="flex-grow">
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </RequireAuth>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider client={supabase}>
          <Toaster />
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
