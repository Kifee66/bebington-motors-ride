import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Car, Plus, LogOut, User, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const navigation = [
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    ...(isAdmin ? [{ name: 'Add Car', href: '/add-car', icon: Plus }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="md" />
            </div>

            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.href)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-smooth ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-glow'
                          : 'text-foreground hover:bg-muted hover:text-primary'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Mobile Navigation */}
            {user && (
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex items-center justify-between mb-6">
                      <Logo size="sm" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <nav className="space-y-4">
                      {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              navigate(item.href);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-smooth text-left ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-glow'
                                : 'text-foreground hover:bg-muted hover:text-primary'
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                          </button>
                        );
                      })}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-border">
                      <div className="flex items-center space-x-3 px-4 py-2 mb-4">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {isAdmin ? 'Administrator' : 'User'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-border hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}

            {/* Desktop User menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{user.email}</span>
                    {isAdmin && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="premium-button"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
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