import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousLimits } from './useAnonymousLimits';
import { useToast } from './use-toast';

interface UsePromptActionsProps {
  onShowAuthModal?: () => void;
  onShowLimitModal?: () => void;
}

export function usePromptActions({ onShowAuthModal, onShowLimitModal }: UsePromptActionsProps = {}) {
  const { user } = useAuth();
  const { canCopy, incrementCopyCount } = useAnonymousLimits();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyPrompt = async (promptContent: string, promptTitle?: string) => {
    // If user is authenticated, allow unlimited copies
    if (user) {
      try {
        await navigator.clipboard.writeText(promptContent);
        toast({
          title: 'Copied to clipboard!',
          description: promptTitle ? `"${promptTitle}" has been copied.` : 'Prompt copied successfully.',
        });
        return true;
      } catch (error) {
        toast({
          title: 'Failed to copy',
          description: 'Please try copying manually.',
          variant: 'destructive',
        });
        return false;
      }
    }

    // For anonymous users, check limits
    if (!canCopy) {
      onShowLimitModal?.();
      return false;
    }

    // Allow copy and increment count
    try {
      await navigator.clipboard.writeText(promptContent);
      incrementCopyCount();
      toast({
        title: 'Copied to clipboard!',
        description: promptTitle ? `"${promptTitle}" has been copied.` : 'Prompt copied successfully.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try copying manually.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleLikePrompt = async (promptId: string) => {
    if (!user) {
      onShowAuthModal?.();
      return false;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual like functionality with Supabase
      toast({
        title: 'Liked!',
        description: 'Added to your liked prompts.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to like prompt. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkPrompt = async (promptId: string) => {
    if (!user) {
      onShowAuthModal?.();
      return false;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual bookmark functionality with Supabase
      toast({
        title: 'Bookmarked!',
        description: 'Added to your bookmarks.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to bookmark prompt. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (promptId: string, content: string) => {
    if (!user) {
      onShowAuthModal?.();
      return false;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual comment functionality with Supabase
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been added.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    handleCopyPrompt,
    handleLikePrompt,
    handleBookmarkPrompt,
    handleComment,
    canCopy: user || canCopy,
  };
}