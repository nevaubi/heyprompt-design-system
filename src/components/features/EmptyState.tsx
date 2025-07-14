import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, FileText, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-results' | 'no-prompts';
  searchQuery?: string;
  onReset?: () => void;
}

export function EmptyState({ type, searchQuery, onReset }: EmptyStateProps) {
  const isNoResults = type === 'no-results';

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isNoResults ? (
          <Search className="w-12 h-12 text-primary" />
        ) : (
          <FileText className="w-12 h-12 text-primary" />
        )}
      </motion.div>

      <motion.h3
        className="text-2xl font-semibold mb-2"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {isNoResults ? (
          searchQuery ? `No prompts found for "${searchQuery}"` : 'No prompts match your filters'
        ) : (
          'No prompts available'
        )}
      </motion.h3>

      <motion.p
        className="text-muted-foreground mb-8 max-w-md"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isNoResults ? (
          'Try adjusting your search terms or filters to find what you\'re looking for.'
        ) : (
          'It looks like there are no prompts available at the moment. Check back later!'
        )}
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {isNoResults && onReset && (
          <Button 
            variant="outline" 
            onClick={onReset}
            className="glass border-border/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
        
        <Button className="bg-gradient-to-r from-primary to-primary-light">
          {isNoResults ? 'Browse All Prompts' : 'Submit a Prompt'}
        </Button>
      </motion.div>
    </motion.div>
  );
}