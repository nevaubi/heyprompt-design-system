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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Trusted by 10,000+ creators and teams</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2"
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
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
          >
            Find tested prompts from the community, save your favorites, and never run out of inspiration. 
            Every prompt includes real examples and results.
          </motion.p>

          {/* Hero Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2"
          >
            <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search thousands of prompts..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg bg-background border-2 border-border rounded-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-light sm:rounded-l-none px-6 py-3 sm:py-4 text-base sm:text-lg"
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12 max-w-md sm:max-w-none mx-auto px-2"
          >
            <a href="/browse" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto"
              >
                Browse Popular Prompts <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 h-auto glass border-border/50 hover:bg-primary/5"
            >
              Submit a Prompt
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-2"
          >
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-2 sm:mb-3">
                <BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">50k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Curated Prompts</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-2 sm:mb-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">10k+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Users</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mx-auto mb-2 sm:mb-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-xs sm:text-sm text-muted-foreground">User Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}