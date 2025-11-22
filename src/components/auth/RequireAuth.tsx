import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  whiteList?: string[];
}

export const RequireAuth = ({ children, whiteList = [] }: RequireAuthProps) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const adminMode = typeof window !== 'undefined' && localStorage.getItem('admin_mode') === 'true';
  const protectedPrefixes = ['/dashboard', '/products', '/receipts', '/deliveries', '/transfers', '/adjustments', '/ledger', '/advanced'];

  useEffect(() => {
    if (loading) return;

    const isWhitelisted = whiteList.some(path => {
      if (path.endsWith('/*')) {
        const basePath = path.slice(0, -2);
        return location.pathname.startsWith(basePath);
      }
      return location.pathname === path;
    });

    const isProtected = protectedPrefixes.some(prefix => location.pathname.startsWith(prefix));

    if (isProtected) {
      const hasInventoryAccess = adminMode || (profile && (profile.role === 'inventory_manager' || profile.role === 'admin'));
      if (!hasInventoryAccess) {
        navigate('/shop', { replace: true });
        return;
      }
    }

    if (!user && !adminMode && !isWhitelisted) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, loading, location, navigate, whiteList, adminMode, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
