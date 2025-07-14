export interface BasePrompt {
  id: string;
  title: string;
  description: string;
  prompt_content?: string;
  whoFor: string[];
  aiModels: string[];
  tokenUsage: 'low' | 'medium' | 'high';
  emoji?: string;
  background_color?: string;
  rating?: number;
  reviewCount?: number;
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
}

export type PromptCardData = BasePrompt;