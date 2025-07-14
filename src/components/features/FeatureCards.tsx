import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Share2, 
  BookMarked, 
  Layers, 
  Zap, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    description: "Find the perfect prompt with AI-powered search and intelligent categorization across thousands of curated prompts.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: BookMarked,
    title: "Personal Library",
    description: "Save, organize, and manage your favorite prompts with custom tags, folders, and powerful filtering options.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Share2,
    title: "Team Collaboration",
    description: "Share prompt collections with your team, collaborate on improvements, and maintain consistent AI outputs.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Layers,
    title: "Template System",
    description: "Create reusable prompt templates with variables, making it easy to adapt prompts for different contexts.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "One-click copy, instant testing with multiple AI models, and rapid iteration on your prompt ideas.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "SOC 2 compliance, SSO integration, advanced permissions, and audit logs for enterprise teams.",
    gradient: "from-teal-500 to-blue-500"
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
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              master AI prompts
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From discovery to deployment, HeyPrompt provides all the tools you need 
            to build, organize, and scale your AI prompt workflows.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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