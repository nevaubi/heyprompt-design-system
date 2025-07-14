import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, ExternalLink } from 'lucide-react';

const samplePrompts = [
  {
    id: 1,
    title: "Marketing Email Generator",
    description: "Create compelling marketing emails that convert. Includes subject line suggestions and A/B testing variations.",
    category: "Marketing",
    rating: 4.8,
    reviews: 234,
    tags: ["Email", "Conversion", "A/B Testing"],
    image: "photo-1498050108023-c5249f4df085",
    author: "Sarah Chen"
  },
  {
    id: 2,
    title: "Code Review Assistant",
    description: "Get detailed code reviews with suggestions for improvements, best practices, and security considerations.",
    category: "Development", 
    rating: 4.9,
    reviews: 156,
    tags: ["Code Review", "Best Practices", "Security"],
    image: "photo-1487058792275-0ad4aaf24ca7",
    author: "Alex Rodriguez"
  },
  {
    id: 3,
    title: "Blog Post Outliner",
    description: "Generate detailed blog post outlines with SEO optimization and reader engagement strategies.",
    category: "Writing",
    rating: 4.7,
    reviews: 89,
    tags: ["SEO", "Content", "Blogging"],
    image: "photo-1581091226825-a6a2a5aee158",
    author: "Emma Thompson"
  },
  {
    id: 4,
    title: "UI Design Analyzer",
    description: "Analyze UI designs and get suggestions for improvements in accessibility, usability, and visual hierarchy.",
    category: "Design",
    rating: 4.6,
    reviews: 67,
    tags: ["UI/UX", "Accessibility", "Design"],
    image: "photo-1531297484001-80022131f5a1",
    author: "Michael Park"
  },
  {
    id: 5,
    title: "Meeting Minutes Generator",
    description: "Transform meeting recordings into structured minutes with action items and follow-up tasks.",
    category: "Business",
    rating: 4.8,
    reviews: 145,
    tags: ["Meetings", "Productivity", "AI"],
    image: "photo-1488590528505-98d2b5aba04b",
    author: "Lisa Wang"
  },
  {
    id: 6,
    title: "Learning Path Creator",
    description: "Design personalized learning paths for any topic with resources, milestones, and progress tracking.",
    category: "Education",
    rating: 4.9,
    reviews: 203,
    tags: ["Learning", "Education", "Planning"],
    image: "photo-1649972904349-6e44c42644a7",
    author: "David Kim"
  }
];

export function SamplePrompts() {
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
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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