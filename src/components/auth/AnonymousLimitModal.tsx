import { X, Crown, Zap, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnonymousLimits } from '@/hooks/useAnonymousLimits';

interface AnonymousLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export function AnonymousLimitModal({ isOpen, onClose, onSignUp }: AnonymousLimitModalProps) {
  const { dailyLimit, copyCount } = useAnonymousLimits();

  const features = [
    {
      icon: Zap,
      title: 'Unlimited Access',
      description: 'Copy and save unlimited prompts every day',
    },
    {
      icon: Users,
      title: 'Community Features',
      description: 'Like, comment, and interact with other creators',
    },
    {
      icon: Shield,
      title: 'Personal Library',
      description: 'Save your favorite prompts and create collections',
    },
    {
      icon: Crown,
      title: 'Premium Content',
      description: 'Access exclusive prompts and advanced features',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-12 right-0 w-10 h-10 p-0 text-foreground hover:bg-background/10"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>

              <Card className="glass border-border/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Daily Limit Reached
                  </CardTitle>
                  <CardDescription>
                    You've used {copyCount} of {dailyLimit} free copies today. 
                    Create an account to unlock unlimited access!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-3 rounded-lg bg-background/50"
                      >
                        <feature.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        <h4 className="text-sm font-medium mb-1">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={onSignUp}
                      className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-glow"
                      size="lg"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Create Free Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full"
                    >
                      Maybe Later
                    </Button>
                  </div>

                  {/* Reset Info */}
                  <p className="text-xs text-center text-muted-foreground">
                    Your limit resets tomorrow at midnight. No credit card required to sign up.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}