import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get('returnUrl');
      navigate(returnUrl ? decodeURIComponent(returnUrl) : '/', { replace: true });
    }
  }, [user, navigate, searchParams]);

  const handleSuccess = () => {
    const returnUrl = searchParams.get('returnUrl');
    navigate(returnUrl ? decodeURIComponent(returnUrl) : '/', { replace: true });
  };

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <AuthForm
            mode={mode}
            onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            onSuccess={handleSuccess}
          />
        </div>
      </div>

      {/* Right side - Hero Image/Gradient */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-glow"
        />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-white max-w-md"
          >
            <h2 className="text-4xl font-bold mb-6">
              Join the Future of AI Prompts
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Discover, create, and share the most effective prompts for AI models. 
              Join thousands of creators building the future together.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                <span className="text-sm opacity-80">10,000+ curated prompts</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                <span className="text-sm opacity-80">Active community of creators</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-60" />
                <span className="text-sm opacity-80">Free to join and use</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}