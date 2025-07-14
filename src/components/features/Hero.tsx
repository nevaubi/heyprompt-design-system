import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BookMarked, Users, Star } from 'lucide-react';

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-12 h-12 bg-primary/10 rounded-full blur-xl"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-8 h-8 bg-primary-light/10 rounded-full blur-lg"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-16 h-16 bg-primary/5 rounded-full blur-2xl"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 2
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4" />
            <span>Trusted by 10,000+ creators and teams</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Discover & Share{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              AI Prompts
            </span>{' '}
            That Actually Work
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Find tested prompts from the community, save your favorites, and never run out of inspiration. 
            Every prompt includes real examples and results.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search thousands of prompts..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-background border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg"
              />
              <Button 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary to-primary-light"
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <a href="/browse">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all duration-300 text-lg px-8 py-4 h-auto"
              >
                Browse Popular Prompts <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto glass border-border/50 hover:bg-primary/5"
            >
              Submit a Prompt
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                <BookMarked className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">50k+</div>
              <div className="text-sm text-muted-foreground">Curated Prompts</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">10k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}