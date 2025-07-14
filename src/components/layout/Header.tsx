import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Search, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { AuthModal } from '@/components/auth/AuthModal';
import { supabase } from '@/integrations/supabase/client';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user profile to check admin status
  useEffect(() => {
    if (user?.id) {
      const fetchUserProfile = async () => {
        setIsLoadingAdmin(true);
        try {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setIsAdmin(false);
        } finally {
          setIsLoadingAdmin(false);
        }
      };

      fetchUserProfile();
    } else {
      setIsAdmin(false);
      setIsLoadingAdmin(false);
    }
  }, [user]);

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const navigation = [
    { name: 'Browse', href: '/browse' },
    { name: 'Categories', href: '#categories' },
    { name: 'Community', href: '#community' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass border-b border-border/50' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="/"
          className="flex items-center space-x-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            HeyPrompt!
          </span>
        </motion.a>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-6 xl:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:bg-background/70"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="text-foreground/80 hover:text-foreground transition-colors relative"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {item.name}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary-light"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-10 w-10"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth Section */}
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)} className="hidden md:inline-flex">
                  Sign In
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all" onClick={() => setShowAuthModal(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-10 w-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <motion.div
            className="sm:hidden fixed top-14 left-0 right-0 z-60 bg-background border border-border shadow-lg max-h-[60vh] overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-4">
              {/* User Section (if logged in) */}
              {user && (
                <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.user_metadata?.full_name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Navigation Links */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.href.startsWith('#')) {
                        // Handle anchor links
                        const element = document.querySelector(item.href);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        handleNavigation(item.href);
                      }
                    }}
                    className="w-full text-left block text-foreground hover:text-primary active:bg-muted/70 transition-colors py-4 px-4 text-base font-medium rounded-lg hover:bg-muted/50 min-h-[44px] flex items-center"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              
              {/* User Menu Items (if logged in) */}
              {user && (
                <div className="space-y-1 pt-2 border-t border-border">
                  <button
                    onClick={() => handleNavigation('/library')}
                    className="w-full text-left block text-foreground hover:text-primary active:bg-muted/70 transition-colors py-4 px-4 text-base font-medium rounded-lg hover:bg-muted/50 min-h-[44px] flex items-center"
                  >
                    My Library
                  </button>
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full text-left block text-foreground hover:text-primary active:bg-muted/70 transition-colors py-4 px-4 text-base font-medium rounded-lg hover:bg-muted/50 min-h-[44px] flex items-center"
                  >
                    Settings
                  </button>
                  {isLoadingAdmin ? (
                    <div className="flex items-center space-x-2 py-4 px-4 text-base font-medium rounded-lg min-h-[44px]">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-muted-foreground">Loading...</span>
                    </div>
                  ) : isAdmin ? (
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full text-left flex items-center space-x-2 text-foreground hover:text-primary active:bg-muted/70 transition-colors py-4 px-4 text-base font-medium rounded-lg hover:bg-muted/50 min-h-[44px]"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </button>
                  ) : null}
                  <button
                    onClick={async () => {
                      await signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-destructive hover:bg-destructive/10 active:bg-destructive/20 transition-colors py-4 px-4 text-base font-medium rounded-lg min-h-[44px] flex items-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              
              {/* Auth Buttons (if not logged in) */}
              {!user && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-base font-medium" 
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full h-11 bg-gradient-to-r from-primary to-primary-light text-base font-medium" 
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setShowMobileSearch(false)}
          />
          
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border lg:hidden safe-top"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileSearch(false)}
                  className="h-11 w-11 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </motion.header>
  );
}