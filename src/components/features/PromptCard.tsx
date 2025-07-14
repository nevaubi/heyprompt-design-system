import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Star, 
  Copy, 
  Bookmark, 
  Heart,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { usePromptActions } from '@/hooks/usePromptActions';
import { AuthModal } from '@/components/auth/AuthModal';
import { AnonymousLimitModal } from '@/components/auth/AnonymousLimitModal';
import type { PromptCardData } from '@/types/prompt';

interface PromptCardProps {
  prompt: PromptCardData;
  onCardClick?: (id: string) => void;
}

const getTokenUsageColor = (usage: 'low' | 'medium' | 'high') => {
  switch (usage) {
    case 'low': return 'text-success-foreground bg-success/10 dark:bg-success/20';
    case 'medium': return 'text-warning-foreground bg-warning/10 dark:bg-warning/20';
    case 'high': return 'text-error-foreground bg-error/10 dark:bg-error/20';
  }
};

const getTokenUsageIcon = (usage: 'low' | 'medium' | 'high') => {
  switch (usage) {
    case 'low': return Zap;
    case 'medium': return Brain;
    case 'high': return Sparkles;
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export function PromptCard({ prompt, onCardClick }: PromptCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const TokenIcon = getTokenUsageIcon(prompt.tokenUsage);
  
  const getBackgroundClass = (bgValue?: string) => {
    const backgroundOptions = {
      'gradient-blue': 'bg-gradient-to-br from-blue-500 to-purple-600',
      'gradient-pink': 'bg-gradient-to-br from-pink-500 to-orange-500',
      'gradient-green': 'bg-gradient-to-br from-green-500 to-teal-600',
      'gradient-purple': 'bg-gradient-to-br from-purple-500 to-indigo-600',
      'gradient-orange': 'bg-gradient-to-br from-orange-500 to-red-500',
      'gradient-cyan': 'bg-gradient-to-br from-cyan-500 to-blue-600',
      'solid-slate': 'bg-slate-600',
      'solid-gray': 'bg-gray-600',
      'solid-emerald': 'bg-emerald-600',
      'solid-rose': 'bg-rose-600'
    };
    return backgroundOptions[bgValue as keyof typeof backgroundOptions] || 'bg-gradient-to-br from-blue-500 to-purple-600';
  };
  
  const {
    handleCopyPrompt,
    handleLikePrompt,
    handleBookmarkPrompt,
  } = usePromptActions({
    onShowAuthModal: () => setShowAuthModal(true),
    onShowLimitModal: () => setShowLimitModal(true),
  });

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -6,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      onClick={() => onCardClick?.(prompt.id)}
      className="cursor-pointer"
    >
      <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group overflow-hidden bg-card/50 backdrop-blur-sm">
        {/* Header with emoji and token usage */}
        <div className="relative h-32 overflow-hidden">
          <div className={`w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 ${getBackgroundClass(prompt.background_color)}`}>
            <span className="text-3xl drop-shadow-sm">{prompt.emoji || '🎨'}</span>
          </div>
          
          {/* Token Usage Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className={`${getTokenUsageColor(prompt.tokenUsage)} text-xs font-semibold backdrop-blur-md bg-background/90 border border-background/20 shadow-sm`}
            >
              <TokenIcon className="w-3 h-3 mr-1.5" />
              {prompt.tokenUsage.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Title and Description */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Categories Section */}
          {prompt.whoFor.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                For
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prompt.whoFor.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs px-2 py-1 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
                {prompt.whoFor.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1 border-border/50 text-muted-foreground bg-muted/50">
                    +{prompt.whoFor.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* AI Models Section */}
          {prompt.aiModels.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Models
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prompt.aiModels.slice(0, 2).map((model) => (
                  <Badge 
                    key={model} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-secondary/60 hover:bg-secondary transition-colors font-medium"
                  >
                    {model}
                  </Badge>
                ))}
                {prompt.aiModels.length > 2 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1 bg-secondary/60 font-medium">
                    +{prompt.aiModels.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Stats and Actions */}
          <div className="pt-3 border-t border-border/30">
            {/* Stats Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatNumber(prompt.saves)}</span>
                  <span className="text-muted-foreground/70">saved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatNumber(prompt.likes)}</span>
                  <span className="text-muted-foreground/70">likes</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    onClick={(e) => handleAction(e, () => handleCopyPrompt(prompt.prompt_content || prompt.description, prompt.title))}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy prompt to clipboard</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={prompt.isBookmarked ? "default" : "outline"}
                    size="sm" 
                    className="w-9 h-9 p-0 hover:scale-105 transition-all"
                    onClick={(e) => handleAction(e, () => handleBookmarkPrompt(prompt.id))}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${prompt.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save to bookmarks</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm" 
                    className={`w-9 h-9 p-0 hover:scale-105 transition-all ${prompt.isLiked ? 'text-heart border-heart bg-heart/10' : 'hover:text-heart hover:border-heart'}`}
                    onClick={(e) => handleAction(e, () => handleLikePrompt(prompt.id))}
                  >
                    <Heart className={`w-3.5 h-3.5 ${prompt.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like this prompt</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
        description="Create an account to like prompts, save bookmarks, and join our community."
      />

      {/* Anonymous Limit Modal */}
      <AnonymousLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onSignUp={() => {
          setShowLimitModal(false);
          setShowAuthModal(true);
        }}
      />
    </motion.div>
  );
}