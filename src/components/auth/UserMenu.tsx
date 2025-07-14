import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, BookOpen, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const menuItems = [
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: BookOpen, label: 'My Library', href: '/library' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="h-10 px-3 space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="w-6 h-6">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="text-xs">
            {getInitials(user.email || '')}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline text-sm">{user.email}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="md:hidden fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 z-50"
            >
              <div className="glass border border-border/50 rounded-lg shadow-lg overflow-hidden">
                {/* User Info */}
                <div className="p-4 bg-background/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Menu Items */}
                <div className="p-1">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.a>
                  ))}
                </div>

                <Separator />

                {/* Sign Out */}
                <div className="p-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}