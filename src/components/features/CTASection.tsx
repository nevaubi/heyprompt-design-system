import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-primary-light/10 to-primary/10">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Join{' '}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                10,000+ creators
              </span>{' '}
              using better prompts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the latest curated prompts, tips, and techniques delivered to your inbox every week.
            </p>
          </motion.div>

          <motion.div
            className="max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 glass border-border/50 focus:border-primary/50 transition-all"
                />
              </div>
              <Button 
                size="lg"
                className="h-12 bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all duration-300 px-6"
              >
                Subscribe <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam. Unsubscribe at any time. Free forever.
            </p>
          </motion.div>

          <motion.div
            className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Weekly updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Exclusive content</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Early access</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}