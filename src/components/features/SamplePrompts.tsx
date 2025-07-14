import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface SamplePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  tags: string[];
  image: string;
  author: string;
}

export function SamplePrompts() {
  const [samplePrompts, setSamplePrompts] = useState<SamplePrompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSamplePrompts();
  }, []);

  const fetchSamplePrompts = async () => {
    try {
      setLoading(true);
      
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select(`
          *,
          prompt_tags (
            tags (
              name,
              type
            )
          )
        `)
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching sample prompts:', error);
        return;
      }

      // Transform data to match expected format
      const transformedPrompts = prompts?.map((prompt, index) => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        category: prompt.prompt_tags?.find(pt => pt.tags.type === 'who_for')?.tags.name || "General",
        rating: 4.5 + (Math.random() * 0.5), // Randomize between 4.5-5.0
        reviews: 50 + Math.floor(Math.random() * 200),
        tags: prompt.prompt_tags?.map(pt => pt.tags.name).slice(0, 3) || [],
        image: [
          "photo-1498050108023-c5249f4df085",
          "photo-1487058792275-0ad4aaf24ca7", 
          "photo-1581091226825-a6a2a5aee158",
          "photo-1531297484001-80022131f5a1",
          "photo-1488590528505-98d2b5aba04b",
          "photo-1649972904349-6e44c42644a7"
        ][index % 6],
        author: "Anonymous" // Will add user profiles later
      })) || [];

      setSamplePrompts(transformedPrompts);
    } catch (error) {
      console.error('Error fetching sample prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Prompts
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and highest-rated prompts from the community
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-full">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : samplePrompts.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">No prompts yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Be the first to share your amazing prompts with the HeyPrompt! community!
            </p>
            <a href="/submit">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all duration-300"
              >
                Submit First Prompt
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {samplePrompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <Card className="h-full glass border-border/50 hover:border-primary/20 transition-all duration-300 group overflow-hidden">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${prompt.image}?w=400&h=200&fit=crop`}
                    alt={prompt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      {prompt.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 fill-star text-star" />
                    <span className="text-sm font-medium">{prompt.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({prompt.reviews} reviews)
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {prompt.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs border-border/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      by {prompt.author}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="/browse">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-light hover:shadow-glow transition-all duration-300"
            >
              View All Prompts
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}