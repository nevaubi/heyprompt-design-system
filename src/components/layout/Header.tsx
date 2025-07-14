import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X, Search, BookOpen } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Browse', href: '#browse' },
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            PromptLib
          </span>
        </motion.div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prompts..."
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
        <div className="flex items-center space-x-4">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden w-10 h-10 p-0"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 p-0"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light hover:shadow-glow">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-10 h-10 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden glass border-t border-border/50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-foreground/80 hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}