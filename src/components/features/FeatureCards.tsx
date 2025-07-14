import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  BookMarked, 
  Users
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: "Curated & Tested",
    description: "Every prompt in our library has been tested with real examples. See actual results and learn what works best for different use cases.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: BookMarked,
    title: "Organized Library",
    description: "Save your favorite prompts, create custom collections, and organize everything with powerful tagging and search functionality.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Connect with prompt engineers and AI enthusiasts. Share your discoveries, get feedback, and learn from the best in the field.",
    gradient: "from-purple-500 to-pink-500"
  }
];

export function FeatureCards() {
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
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why developers and creators{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              trust PromptLib
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators who rely on our curated prompt library 
            to get better AI results faster.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
            >
              <Card className="p-6 h-full glass border-border/50 hover:border-primary/20 transition-all duration-300 group">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}