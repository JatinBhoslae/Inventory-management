import { Link, useLocation } from 'react-router-dom';
import { Package, User, LogOut, Menu, ShoppingCart, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ThemeToggle from '@/components/common/ThemeToggle';
import routes from '@/routes';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const adminMode = typeof window !== 'undefined' && localStorage.getItem('admin_mode') === 'true';
  const hasInventoryAccess = adminMode || (profile && (profile.role === 'inventory_manager' || profile.role === 'admin'));
  const navigation = hasInventoryAccess
    ? routes.filter((route) => route.visible !== false && route.path !== '/shop')
    : routes.filter((route) => route.path === '/shop');

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('admin_mode');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StockMaster</span>
          </Link>
          {hasInventoryAccess && (
            <Link to="/shop" className="text-primary hover:underline">Shop</Link>
          )}

          <nav className="hidden xl:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user || adminMode ? (
            <>
              <ThemeToggle />
              <Link to="/cart" className="text-muted-foreground hover:text-foreground">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link to="/user/orders" className="text-muted-foreground hover:text-foreground">
                <ClipboardList className="h-5 w-5" />
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-2">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{adminMode ? 'Admin' : (profile?.full_name || 'User')}</p>
                      {!adminMode && <p className="text-xs text-muted-foreground">{profile?.email}</p>}
                      <p className="text-xs text-muted-foreground capitalize mt-1">Role: {adminMode ? 'admin' : profile?.role?.replace('_', ' ')}</p>
                    </div>
                    {!adminMode && (
                      <div className="border-t pt-2">
                        <Button asChild variant="ghost" className="w-full justify-start">
                          <Link to="/user/profile">Profile</Link>
                        </Button>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-2 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          location.pathname === item.path
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild>
                <Link to="/login">Manager Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
