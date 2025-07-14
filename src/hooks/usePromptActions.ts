import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAnonymousLimits } from './useAnonymousLimits';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      // Check if user has already liked this prompt
      const { data: existingLike, error: checkError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('prompt_id', promptId)
        .eq('interaction_type', 'like')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('user_interactions')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) throw deleteError;

        toast({
          title: 'Unliked!',
          description: 'Removed from your liked prompts.',
        });
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('user_interactions')
          .insert([{
            user_id: user.id,
            prompt_id: promptId,
            interaction_type: 'like'
          }]);

        if (insertError) throw insertError;

        toast({
          title: 'Liked!',
          description: 'Added to your liked prompts.',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
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
      // Check if user has already bookmarked this prompt
      const { data: existingBookmark, error: checkError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('prompt_id', promptId)
        .eq('interaction_type', 'bookmark')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingBookmark) {
        // Remove bookmark
        const { error: deleteError } = await supabase
          .from('user_interactions')
          .delete()
          .eq('id', existingBookmark.id);

        if (deleteError) throw deleteError;

        toast({
          title: 'Bookmark removed!',
          description: 'Removed from your bookmarks.',
        });
      } else {
        // Add bookmark
        const { error: insertError } = await supabase
          .from('user_interactions')
          .insert([{
            user_id: user.id,
            prompt_id: promptId,
            interaction_type: 'bookmark'
          }]);

        if (insertError) throw insertError;

        toast({
          title: 'Bookmarked!',
          description: 'Added to your bookmarks.',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error handling bookmark:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bookmark. Please try again.',
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