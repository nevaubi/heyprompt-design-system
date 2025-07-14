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
  MessageCircle,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { usePromptActions } from '@/hooks/usePromptActions';
import { AuthModal } from '@/components/auth/AuthModal';
import { AnonymousLimitModal } from '@/components/auth/AnonymousLimitModal';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string;
    prompt_content?: string;
    whoFor: string[];
    aiModels: string[];
    tokenUsage: 'Low' | 'Medium' | 'High';
    imageUrl?: string;
    saves: number;
    copies: number;
    comments: number;
    likes: number;
    author: {
      name: string;
      avatar?: string;
    };
    isBookmarked?: boolean;
    isLiked?: boolean;
  };
  onCardClick?: (id: string) => void;
}

const getTokenUsageColor = (usage: 'Low' | 'Medium' | 'High') => {
  switch (usage) {
    case 'Low': return 'text-success-foreground bg-success/10 dark:bg-success/20';
    case 'Medium': return 'text-warning-foreground bg-warning/10 dark:bg-warning/20';
    case 'High': return 'text-error-foreground bg-error/10 dark:bg-error/20';
  }
};

const getTokenUsageIcon = (usage: 'Low' | 'Medium' | 'High') => {
  switch (usage) {
    case 'Low': return Zap;
    case 'Medium': return Brain;
    case 'High': return Sparkles;
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  const TokenIcon = getTokenUsageIcon(prompt.tokenUsage);
  
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
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      onClick={() => onCardClick?.(prompt.id)}
      className="cursor-pointer"
    >
      <Card className="h-full glass border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group overflow-hidden">
        {/* Image Section */}
        {prompt.imageUrl && (
          <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            {!imageError && (
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            )}
            {imageError && (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-muted-foreground text-sm">No preview</div>
              </div>
            )}
            
            {/* Token Usage Badge */}
            <div className="absolute top-3 left-3">
              <Badge 
                variant="secondary" 
                className={`${getTokenUsageColor(prompt.tokenUsage)} text-xs font-medium`}
              >
                <TokenIcon className="w-3 h-3 mr-1" />
                {prompt.tokenUsage}
              </Badge>
            </div>

          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {prompt.description}
            </p>
          </div>

          {/* Who it's for tags */}
          {prompt.whoFor.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.whoFor.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {prompt.whoFor.length > 3 && (
                <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                  +{prompt.whoFor.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* AI Models */}
          {prompt.aiModels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.aiModels.slice(0, 2).map((model) => (
                <Badge 
                  key={model} 
                  variant="secondary" 
                  className="text-xs bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {model}
                </Badge>
              ))}
              {prompt.aiModels.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-secondary/50">
                  +{prompt.aiModels.length - 2}
                </Badge>
              )}
            </div>
          )}


          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span>{formatNumber(prompt.saves)} saves</span>
            <span>•</span>
            <span>{formatNumber(prompt.copies)} copies</span>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0 hover:bg-primary/10"
                    onClick={(e) => handleAction(e, () => handleCopyPrompt(prompt.prompt_content || prompt.description, prompt.title))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy prompt</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${prompt.isBookmarked ? 'text-primary' : ''} hover:bg-primary/10`}
                    onClick={(e) => handleAction(e, () => handleBookmarkPrompt(prompt.id))}
                  >
                    <Bookmark className={`w-4 h-4 ${prompt.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bookmark</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-8 h-8 p-0 ${prompt.isLiked ? 'text-heart' : ''} hover:bg-heart/10 dark:hover:bg-heart/20`}
                    onClick={(e) => handleAction(e, () => handleLikePrompt(prompt.id))}
                  >
                    <Heart className={`w-4 h-4 ${prompt.isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              <span>{formatNumber(prompt.comments)}</span>
              <Heart className="w-3 h-3" />
              <span>{formatNumber(prompt.likes)}</span>
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