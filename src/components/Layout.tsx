import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Car, Plus, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GlobalBackground } from '@/pages/Background';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      <GlobalBackground />
      
      {/* Header */}
      <header className="relative z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/vehicles" 
                className={`transition-smooth hover:text-primary ${
                  location.pathname === '/vehicles' ? 'text-primary font-medium' : 'text-foreground'
                }`}
              >
                <Car className="h-4 w-4 inline mr-2" />
                Vehicles
              </Link>
              
              {user?.email === 'muturimichael66@gmail.com' && (
                <Link 
                  to="/add-car" 
                  className={`transition-smooth hover:text-primary ${
                    location.pathname === '/add-car' ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Car
                </Link>
              )}
            </nav>

            {/* Right side - Theme toggle and auth buttons */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="hidden md:inline text-muted-foreground">
                    <User className="h-4 w-4 inline mr-2" />
                    {user.email}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="transition-smooth"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="premium-button transition-smooth"
                  size="sm"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/vehicles"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    location.pathname === '/vehicles'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Car className="h-4 w-4 inline mr-2" />
                  Vehicles
                </Link>
                
                {user?.email === 'muturimichael66@gmail.com' && (
                  <Link
                    to="/add-car"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                      location.pathname === '/add-car'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Plus className="h-4 w-4 inline mr-2" />
                    Add Car
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-card/95 backdrop-blur-sm border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Logo size="sm" />
              <span className="text-muted-foreground">Premium Automotive Experience</span>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              © 2024 Bebington Motors. All rights reserved. | A Kibs Tech Development
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};