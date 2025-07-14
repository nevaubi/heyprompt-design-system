import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";

interface Category {
  name: string;
  count: number;
  color: string;
}

export function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data: tags, error } = await supabase
        .from('tags')
        .select(`
          *,
          prompt_tags (
            prompts (
              id,
              is_published
            )
          )
        `)
        .eq('type', 'who_for');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      // Count prompts per category and format
      const categoryCounts = tags?.map(tag => ({
        name: tag.name,
        count: tag.prompt_tags?.filter(pt => pt.prompts?.is_published === true).length || 0,
        color: getCategoryColor(tag.name)
      }))
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count) || [];

      setCategories(categoryCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Business': 'from-orange-500 to-amber-500',
      'Content Creators': 'from-purple-500 to-violet-500',
      'Developers': 'from-blue-500 to-indigo-500',
      'Marketers': 'from-pink-500 to-rose-500',
      'Writers': 'from-green-500 to-emerald-500',
      'Students': 'from-teal-500 to-cyan-500',
      'Designers': 'from-indigo-500 to-blue-500',
      'Researchers': 'from-red-500 to-pink-500'
    };
    return colorMap[name] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore prompts organized by use case and industry
          </p>
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-20 bg-muted rounded-lg"></div>
              </div>
            ))
          ) : (
            categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-4 glass border-border/50 hover:border-primary/30 group transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} mx-auto mb-2 group-hover:shadow-glow transition-all`} />
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.count} prompts
                  </div>
                </div>
              </Button>
            </motion.div>
            ))
          )}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 mb-8">
          <div className="flex space-x-3 w-max">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse flex-shrink-0">
                  <div className="w-32 h-10 bg-muted rounded-lg"></div>
                </div>
              ))
            ) : (
              categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="whitespace-nowrap glass border-border/50 hover:border-primary/30 group transition-all"
                >
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${category.color} mr-2 group-hover:shadow-glow transition-all`} />
                  {category.name}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                </Button>
              </motion.div>
              ))
            )}
          </div>
        </div>

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            size="lg"
            className="glass border-border/50 hover:bg-primary/5 transition-all"
          >
            View All Categories
          </Button>
        </motion.div>
      </div>
    </section>
    );
  }

  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore prompts organized by use case and industry
          </p>
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-4 glass border-border/50 hover:border-primary/30 group transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} mx-auto mb-2 group-hover:shadow-glow transition-all`} />
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.count} prompts
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 mb-8">
          <div className="flex space-x-3 w-max">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="whitespace-nowrap glass border-border/50 hover:border-primary/30 group transition-all"
                >
                  <div className={`w-4 h-4 rounded bg-gradient-to-r ${category.color} mr-2 group-hover:shadow-glow transition-all`} />
                  {category.name}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            size="lg"
            className="glass border-border/50 hover:bg-primary/5 transition-all"
          >
            View All Categories
          </Button>
        </motion.div>
      </div>
    </section>
  );
}